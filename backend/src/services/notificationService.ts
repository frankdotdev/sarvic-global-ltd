import { Resend } from 'resend';
import axios from 'axios';
import { query } from '../db';
import { ShipmentStatus, STATUS_LABELS } from '../utils/types';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// =============================================================
// EMAIL (Resend)
// =============================================================
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  shipmentId?: string;
  clientId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured. Email not sent.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Sarvic Global Ltd <${process.env.FROM_EMAIL || 'notifications@sarvicglobal.com'}>`,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) throw error;

    // Log notification
    if (params.shipmentId || params.clientId) {
      await query(
        `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, subject, message, status, provider_message_id, sent_at)
         VALUES ($1, $2, 'email', $3, $4, $5, 'sent', $6, NOW())`,
        [params.shipmentId || null, params.clientId || null, params.to, params.subject, params.html, data?.id]
      );
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[Email] Send failed:', err);

    if (params.shipmentId || params.clientId) {
      await query(
        `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, subject, message, status, error_message)
         VALUES ($1, $2, 'email', $3, $4, $5, 'failed', $6)`,
        [params.shipmentId || null, params.clientId || null, params.to, params.subject, params.html, err.message]
      ).catch(console.error);
    }

    return { success: false, error: err.message };
  }
}

// =============================================================
// SMS (Termii)
// =============================================================
export async function sendSMS(params: {
  to: string;
  message: string;
  shipmentId?: string;
  clientId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!process.env.TERMII_API_KEY) {
    console.warn('[SMS] TERMII_API_KEY not configured. SMS not sent.');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const response = await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: params.to,
      from: process.env.TERMII_SENDER_ID || 'Sarvic',
      sms: params.message,
      type: 'plain',
      api_key: process.env.TERMII_API_KEY,
      channel: 'generic',
    });

    await query(
      `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, message, status, provider_message_id, sent_at)
       VALUES ($1, $2, 'sms', $3, $4, 'sent', $5, NOW())`,
      [params.shipmentId || null, params.clientId || null, params.to, params.message, response.data?.message_id]
    ).catch(console.error);

    return { success: true, messageId: response.data?.message_id };
  } catch (err: any) {
    console.error('[SMS] Send failed:', err);
    await query(
      `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, message, status, error_message)
       VALUES ($1, $2, 'sms', $3, $4, 'failed', $5)`,
      [params.shipmentId || null, params.clientId || null, params.to, params.message, err.message]
    ).catch(console.error);
    return { success: false, error: err.message };
  }
}

// =============================================================
// WHATSAPP (Meta Cloud API)
// =============================================================
export async function sendWhatsApp(params: {
  to: string;
  message: string;
  shipmentId?: string;
  clientId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!process.env.META_WA_TOKEN || !process.env.META_WA_PHONE_ID) {
    console.warn('[WhatsApp] META_WA_TOKEN or META_WA_PHONE_ID not configured. WhatsApp not sent.');
    return { success: false, error: 'WhatsApp service not configured' };
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.META_WA_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: params.to.replace(/\D/g, ''), // Strip non-digits
        type: 'text',
        text: { body: params.message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_WA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await query(
      `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, message, status, provider_message_id, sent_at)
       VALUES ($1, $2, 'whatsapp', $3, $4, 'sent', $5, NOW())`,
      [params.shipmentId || null, params.clientId || null, params.to, params.message, response.data?.messages?.[0]?.id]
    ).catch(console.error);

    return { success: true, messageId: response.data?.messages?.[0]?.id };
  } catch (err: any) {
    console.error('[WhatsApp] Send failed:', err?.response?.data || err.message);
    await query(
      `INSERT INTO notification_logs (shipment_id, client_id, channel, recipient, message, status, error_message)
       VALUES ($1, $2, 'whatsapp', $3, $4, 'failed', $5)`,
      [params.shipmentId || null, params.clientId || null, params.to, params.message, JSON.stringify(err?.response?.data || err.message)]
    ).catch(console.error);
    return { success: false, error: err.message };
  }
}

// =============================================================
// SHIPMENT STATUS UPDATE NOTIFICATION (sends to all channels)
// =============================================================
export async function notifyStatusUpdate(params: {
  trackingNumber: string;
  newStatus: ShipmentStatus;
  clientEmail?: string | null;
  clientPhone?: string | null;
  shipmentId: string;
  clientId?: string | null;
  currentLocation?: string | null;
}): Promise<void> {
  const statusLabel = STATUS_LABELS[params.newStatus];
  const message = `Sarvic Global Update: Your shipment ${params.trackingNumber} is now "${statusLabel}".${
    params.currentLocation ? ` Current location: ${params.currentLocation}.` : ''
  } Track at: https://sarvicglobal.com/track`;

  const emailHtml = generateStatusEmailHtml({
    trackingNumber: params.trackingNumber,
    status: params.newStatus,
    statusLabel,
    currentLocation: params.currentLocation,
  });

  const tasks: Promise<any>[] = [];

  if (params.clientEmail) {
    tasks.push(
      sendEmail({
        to: params.clientEmail,
        subject: `Shipment Update: ${params.trackingNumber} — ${statusLabel}`,
        html: emailHtml,
        shipmentId: params.shipmentId,
        clientId: params.clientId || undefined,
      })
    );
  }

  if (params.clientPhone) {
    tasks.push(
      sendSMS({
        to: params.clientPhone,
        message,
        shipmentId: params.shipmentId,
        clientId: params.clientId || undefined,
      })
    );
    tasks.push(
      sendWhatsApp({
        to: params.clientPhone,
        message,
        shipmentId: params.shipmentId,
        clientId: params.clientId || undefined,
      })
    );
  }

  // Fire all concurrently, don't block on failures
  await Promise.allSettled(tasks);
}

// =============================================================
// EMAIL TEMPLATE
// =============================================================
function generateStatusEmailHtml(params: {
  trackingNumber: string;
  status: ShipmentStatus;
  statusLabel: string;
  currentLocation?: string | null;
}): string {
  const isDelivered = params.status === 'delivered';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipment Update — Sarvic Global</title>
</head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E2DDD6;max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#0F1F38;padding:32px 40px;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#C8A96E;text-transform:uppercase;">Sarvic Global Ltd</p>
              <p style="margin:4px 0 0;font-size:10px;color:#8A8A8A;letter-spacing:1px;">CONNECTING GLOBAL TRADE WITHOUT BOUNDARIES</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#8A8A8A;text-transform:uppercase;">Shipment Status Update</p>
              <h1 style="margin:0 0 24px;font-size:28px;font-weight:400;color:#0D0D0D;letter-spacing:-0.5px;">${params.statusLabel}</h1>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;border:1px solid #E2DDD6;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #E2DDD6;">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;color:#8A8A8A;text-transform:uppercase;">Tracking Number</p>
                    <p style="margin:4px 0 0;font-size:18px;font-family:'DM Mono',monospace;color:#0D0D0D;letter-spacing:1px;">${params.trackingNumber}</p>
                  </td>
                </tr>
                ${params.currentLocation ? `
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;color:#8A8A8A;text-transform:uppercase;">Current Location</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#0D0D0D;">${params.currentLocation}</p>
                  </td>
                </tr>` : ''}
              </table>

              ${isDelivered ? `
              <p style="font-size:15px;color:#3A3A3A;line-height:1.6;">
                Excellent news — your shipment has been <strong>successfully delivered</strong>. Thank you for choosing Sarvic Global Ltd. We look forward to serving you again.
              </p>` : `
              <p style="font-size:15px;color:#3A3A3A;line-height:1.6;">
                Your shipment status has been updated. You can track your shipment in real time on our website.
              </p>`}

              <a href="https://sarvicglobal.com/track?id=${params.trackingNumber}"
                 style="display:inline-block;margin-top:24px;background:#0D0D0D;color:#FFFFFF;text-decoration:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;">
                TRACK SHIPMENT
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F7F5F0;border-top:1px solid #E2DDD6;padding:24px 40px;">
              <p style="margin:0;font-size:11px;color:#8A8A8A;line-height:1.6;">
                Sarvic Global Ltd &nbsp;|&nbsp; +86 19566805494 &nbsp;|&nbsp; sarvicglobaltd@gmail.com
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#8A8A8A;">
                Guangzhou · Turkey · Lagos · Alaba International Market
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
