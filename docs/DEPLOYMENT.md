# Deployment Guide

## Recommended Architecture

- **Frontend:** Vercel (Next.js native support, free tier viable)
- **Backend:** Railway, Render, or a VPS (Hetzner/DigitalOcean)
- **Database:** Supabase (managed Postgres with built-in pooling) or Neon

## Frontend Deployment (Vercel)

1. Push the `frontend/` directory to a Git repository (or connect the monorepo with a root directory override)
2. Import the project into Vercel
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.sarvicglobal.com/api
   ```
5. Deploy. Vercel will auto-detect Next.js and configure the build.

### Custom Domain
Point `sarvicglobal.com` and `www.sarvicglobal.com` to Vercel via DNS
(CNAME or A record as instructed in Vercel's domain settings).

## Backend Deployment

### Option A: Railway

1. Create a new project, connect your repo, set root directory to `backend`
2. Add a PostgreSQL plugin (or use your external Supabase/Neon instance)
3. Set environment variables (see `backend/.env.example`)
4. Set the start command: `npm run build && npm run start`
5. Railway will assign a public URL — use this as `NEXT_PUBLIC_API_URL` on the frontend

### Option B: VPS (Hetzner / DigitalOcean)

```bash
# On the server
git clone <your-repo>
cd sarvic-global/backend
npm install
npm run build
cp .env.example .env   # fill in production values

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.js --name sarvic-api
pm2 save
pm2 startup
```

Set up Nginx as a reverse proxy with SSL (via Certbot/Let's Encrypt)
pointing `api.sarvicglobal.com` to `localhost:4000`.

## Database Migration in Production

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql   # optional — skip in production, or edit seed.sql to remove sample data
```

**Important:** Before going live, either skip `seed.sql` entirely or
edit it to remove sample clients/shipments, and immediately change the
default admin password.

## Pre-Launch Checklist

- [ ] Change default admin password
- [ ] Set a strong, unique `JWT_SECRET` (32+ random characters)
- [ ] Configure `RESEND_API_KEY` with a verified sending domain
- [ ] Set `ALLOWED_ORIGINS` to production domains only (remove localhost)
- [ ] Set `NODE_ENV=production` on the backend
- [ ] Verify `/health` endpoint responds correctly
- [ ] Test the full tracking flow end-to-end with a real shipment
- [ ] Replace `/logo.png` and `/og-image.jpg` placeholders with real assets
- [ ] Set up domain SSL on both frontend and backend
- [ ] Configure DNS for both `sarvicglobal.com` and `api.sarvicglobal.com`
- [ ] Add SMS (Termii) and WhatsApp (Meta) credentials when ready — no code changes needed

## Monitoring

The `/health` endpoint on the backend returns service status and can be
used with uptime monitoring tools (UptimeRobot, Better Uptime, etc.) to
alert on downtime.
