# Sarvic Global Ltd — Corporate Website & Tracking Platform

A premium, fully integrated corporate website for **Sarvic Global Ltd**
(operating as Guangzhou Sarvic Global Trading Co., Ltd) — a global trade
conglomerate spanning logistics, procurement, manufacturing, automotive
supply, and foreign exchange services across China, Turkey, and Nigeria.

## Project Structure

```
sarvic-global/
├── frontend/          Next.js 15 corporate site + admin dashboard
├── backend/           Express REST API
├── database/          PostgreSQL schema + seed data
└── docs/              Documentation (you are here)
```

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Phosphor Icons, Leaflet
- **Backend:** Node.js + Express, JWT auth, PostgreSQL
- **Database:** PostgreSQL (Supabase-compatible, portable to Neon/Railway/VPS)
- **Notifications:** Resend (email, active), Termii (SMS, key-gated), Meta WhatsApp Cloud API (key-gated)
- **Maps:** Leaflet + OpenStreetMap (no API key required)

## Quick Start

See [SETUP.md](./SETUP.md) for full local development setup instructions.

```bash
# 1. Database
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql

# 2. Backend
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev             # runs on http://localhost:4000

# 3. Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev             # runs on http://localhost:3000
```

## Documentation Index

- [SETUP.md](./SETUP.md) — Environment setup, dependencies, running locally
- [TRACKING_SYSTEM.md](./TRACKING_SYSTEM.md) — Tracking number format, status flow, public API
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — Using the admin dashboard
- [API.md](./API.md) — Full backend API reference
- [NOTIFICATIONS.md](./NOTIFICATIONS.md) — Email/SMS/WhatsApp configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production deployment guide

## Default Admin Credentials (Development Seed)

```
Email: admin@sarvicglobal.com
Password: Admin@Sarvic2024
```

**Change this password immediately in any non-local environment.**

## Built by Hackverse Software Solutions

## Business Information

- **Legal Name:** Guangzhou Sarvic Global Trading Co., Ltd
- **Founded:** January 2020
- **Founder/CEO:** Engr. Victor Uchechukwu Dike
- **Co-Founder:** Mrs Sarah Oluchi Dike
- **Email:** sarvicglobaltd@gmail.com
- **Offices:** Guangzhou (China), Istanbul (Turkey), Lagos & Alaba International Market (Nigeria)
