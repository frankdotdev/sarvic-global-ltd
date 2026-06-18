import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { formRateLimit } from '../middleware/rateLimit';
import { sendEmail } from '../services/notificationService';

const router = Router();

// POST /api/contact — public contact form
router.post('/contact', formRateLimit, async (req: Request, res: Response) => {
  const { full_name, email, phone, company, subject, message, source_office } = req.body;
  if (!full_name || !email || !subject || !message) {
    res.status(400).json({ success: false, error: 'Required: full_name, email, subject, message' });
    return;
  }

  await query(
    'INSERT INTO contact_submissions (full_name, email, phone, company, subject, message, source_office) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [full_name, email, phone || null, company || null, subject, message, source_office || null]
  );

  // Notify Sarvic team
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'sarvicglobaltd@gmail.com',
    subject: `New Contact: ${subject} — from ${full_name}`,
    html: `<p><strong>From:</strong> ${full_name} (${email})</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Company:</strong> ${company || 'N/A'}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
  });

  res.json({ success: true, message: 'Message received. We will respond within 24 hours.' });
});

// POST /api/contact/quote — quote request
router.post('/quote', formRateLimit, async (req: Request, res: Response) => {
  const { full_name, email, phone, company, service_type, origin, destination, cargo_description, estimated_weight, additional_notes } = req.body;
  if (!full_name || !email || !service_type) {
    res.status(400).json({ success: false, error: 'Required: full_name, email, service_type' });
    return;
  }

  await query(
    'INSERT INTO quote_requests (full_name, email, phone, company, service_type, origin, destination, cargo_description, estimated_weight, additional_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [full_name, email, phone || null, company || null, service_type, origin || null, destination || null, cargo_description || null, estimated_weight || null, additional_notes || null]
  );

  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'sarvicglobaltd@gmail.com',
    subject: `New Quote Request: ${service_type} — ${full_name}`,
    html: `<p><strong>Service:</strong> ${service_type}</p><p><strong>From:</strong> ${full_name} (${email})</p><p><strong>Route:</strong> ${origin || 'N/A'} → ${destination || 'N/A'}</p><p><strong>Cargo:</strong> ${cargo_description || 'N/A'}</p><p><strong>Weight:</strong> ${estimated_weight || 'N/A'}</p><p><strong>Notes:</strong> ${additional_notes || 'N/A'}</p>`,
  });

  res.json({ success: true, message: 'Quote request received. Our team will contact you within 24 hours.' });
});

// GET /api/contact — admin: list submissions
router.get('/contact', authenticate, async (req: AuthRequest, res: Response) => {
  const { rows } = await query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100');
  res.json({ success: true, data: rows });
});

// GET /api/contact/quotes — admin: list quote requests
router.get('/quotes', authenticate, async (req: AuthRequest, res: Response) => {
  const { rows } = await query('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 100');
  res.json({ success: true, data: rows });
});

export default router;
