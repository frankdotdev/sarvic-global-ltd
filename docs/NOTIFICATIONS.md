# Notifications Configuration

Sarvic Global's notification system supports three channels: Email, SMS,
and WhatsApp. All three are fully wired into the codebase, but **SMS and
WhatsApp remain inactive (silent no-ops) until you add their respective
API credentials** — no code changes are required to activate them later.

## Email — Resend (Active Now)

1. Create a free account at [resend.com](https://resend.com)
2. Verify your sending domain (or use their test domain for development)
3. Generate an API key
4. Add to backend `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=notifications@sarvicglobal.com
```

Email is used for: booking confirmations, status update notifications,
and internal alerts for new contact/quote form submissions (sent to
`ADMIN_EMAIL`).

## SMS — Termii (Currently Inactive — Add Keys to Activate)

1. Create an account at [termii.com](https://termii.com)
2. Get your API key and register a Sender ID
3. Add to backend `.env`:

```env
TERMII_API_KEY=your_key_here
TERMII_SENDER_ID=Sarvic
```

Once these are set, SMS notifications will start sending automatically
on the next status update — **no deployment or code change needed**,
just restart the backend process to pick up the new environment
variables.

## WhatsApp — Meta Cloud API (Currently Inactive — Add Keys to Activate)

1. Set up a Meta Business Account and WhatsApp Business API access
2. Create a permanent access token and note your Phone Number ID
3. Add to backend `.env`:

```env
META_WA_TOKEN=your_permanent_token
META_WA_PHONE_ID=your_phone_number_id
```

Same as SMS — WhatsApp messages will start sending automatically once
these variables are present and the backend is restarted.

## How the Graceful Fallback Works

Each notification function (`sendEmail`, `sendSMS`, `sendWhatsApp` in
`backend/src/services/notificationService.ts`) checks for its required
environment variable(s) at call time. If missing, it logs a warning and
returns `{ success: false, error: 'X service not configured' }` without
throwing — so a shipment status update never fails just because SMS or
WhatsApp isn't set up yet.

```js
if (!process.env.TERMII_API_KEY) {
  console.warn('[SMS] TERMII_API_KEY not configured. SMS not sent.');
  return { success: false, error: 'SMS service not configured' };
}
```

## Checking Channel Status

The admin **Settings** page (`/admin/settings`) displays a live status
indicator for each channel based on whether its environment variables
are present on the backend.

## Notification Logs

Every notification attempt (sent or failed) is recorded in the
`notification_logs` table, including channel, recipient, message,
status, and error message if applicable — useful for auditing delivery
issues once SMS/WhatsApp are activated.
