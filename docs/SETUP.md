# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (local, Supabase, Neon, or Railway)
- (Optional) Resend account for email notifications
- (Optional) Termii account for SMS
- (Optional) Meta Business + WhatsApp Cloud API access

## 1. Database Setup

### Option A: Supabase (Recommended for quick start)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `database/schema.sql`
3. Then run `database/seed.sql` for sample data
4. Copy your connection string from **Project Settings → Database → Connection String** (use the "Transaction" pooler string for serverless, or direct for persistent connections)

### Option B: Self-hosted / Neon / Railway

```bash
psql "your_connection_string" -f database/schema.sql
psql "your_connection_string" -f database/seed.sql
```

### Option C: Via backend scripts

```bash
cd backend
npm install
cp .env.example .env   # set DATABASE_URL first
npm run db:migrate
npm run db:seed
```

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=<generate with: openssl rand -base64 32>
ALLOWED_ORIGINS=http://localhost:3000
ADMIN_EMAIL=sarvicglobaltd@gmail.com
RESEND_API_KEY=re_xxxxxxxx
FROM_EMAIL=notifications@sarvicglobal.com
```

Run the dev server:

```bash
npm run dev
# API running at http://localhost:4000
# Health check: http://localhost:4000/health
```

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Run the dev server:

```bash
npm run dev
# Site running at http://localhost:3000
```

## 4. First Login

Navigate to `http://localhost:3000/admin/login` and sign in with the seeded
admin credentials (see main README). **Change the password immediately**
via Settings.

## 5. Adding Notification Providers Later

The system is built so that SMS (Termii) and WhatsApp (Meta Cloud API)
**start working automatically** the moment you add their respective API
keys to the backend `.env` file — no code changes required. Until then,
those channels silently no-op and only Email (Resend) sends.

See [NOTIFICATIONS.md](./NOTIFICATIONS.md) for full details.

## Troubleshooting

**CORS errors:** Ensure `ALLOWED_ORIGINS` in backend `.env` includes your
frontend's exact origin (including protocol, no trailing slash).

**401 errors on admin routes:** Check that `JWT_SECRET` is set and that
cookies/localStorage aren't being blocked by browser privacy settings.

**Database connection errors:** If using Supabase, ensure you're using the
correct pooler mode for your hosting environment (transaction pooler for
serverless platforms like Vercel).
