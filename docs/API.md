# API Reference

Base URL: `http://localhost:4000/api` (development) or your production
backend URL.

All authenticated routes require either:
- `Authorization: Bearer <token>` header, or
- `admin_token` HTTP-only cookie (set automatically on login)

## Authentication

### POST `/auth/login`
Rate limited: 5 attempts / 15 min.

```json
// Request
{ "email": "admin@sarvicglobal.com", "password": "..." }

// Response
{ "success": true, "data": { "token": "...", "admin": { "id", "email", "full_name", "role" } } }
```

### POST `/auth/logout`
Clears the auth cookie.

### GET `/auth/me`
Returns the currently authenticated admin.

### POST `/auth/change-password`
```json
{ "current_password": "...", "new_password": "..." }
```

## Public Tracking

### GET `/tracking/:trackingNumber`
Rate limited: 10 requests / minute / IP. No auth required.

Returns shipment status, route, current location, event history, and
public documents. 404 if not found or cancelled.

## Shipments (Admin — Auth Required)

### GET `/shipments`
Query params: `status`, `mode`, `search`, `page`, `limit`

### GET `/shipments/stats`
Dashboard statistics.

### GET `/shipments/:id`
Accepts either UUID or tracking number. Includes full events + documents.

### POST `/shipments`
Supports `Idempotency-Key` header.

```json
{
  "client_name": "Emeka Okafor", "client_email": "...", "client_phone": "...",
  "cargo_type": "Building Materials", "origin": "Guangzhou, China",
  "destination": "Lagos, Nigeria", "transport_mode": "ocean",
  "weight_kg": 2400, "expected_delivery": "2026-07-05"
}
```

### PATCH `/shipments/:id/status`
Supports `Idempotency-Key` header. Triggers client notifications.

```json
{ "status": "in_transit", "current_location": "Port of Singapore", "note": "Transshipment in progress" }
```

### PATCH `/shipments/:id`
General field update (any subset of shipment fields).

### POST `/shipments/:id/events`
Add a manual history entry.

```json
{ "description": "Customer requested address change", "location": "Lagos" }
```

### DELETE `/shipments/:id`
Soft-deletes (sets status to `cancelled`). Requires `admin` or `super_admin` role.

## Documents (Admin — Auth Required)

### POST `/documents/:shipmentId`
Multipart form upload. Field name: `file`. Body field: `document_type`
(one of: `invoice`, `packing_list`, `bill_of_lading`, `airway_bill`,
`customs_declaration`, `certificate_of_origin`, `insurance`, `other`).
Max file size 15MB. Allowed types: PDF, JPEG, PNG, WebP.

Returns `503` if Supabase Storage isn't configured yet (`SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` missing) — same graceful-fallback pattern as
the notification channels.

### DELETE `/documents/:documentId`
Removes the document record and attempts best-effort storage cleanup.

## Clients (Admin — Auth Required)

- `GET /clients` — list, with `search`, `page`, `limit`
- `GET /clients/:id` — detail + shipment history
- `POST /clients` — create
- `PATCH /clients/:id` — update
- `DELETE /clients/:id` — requires `super_admin` role

## Contact & Quotes

### POST `/contact/contact` (public, rate limited 5/hour)
```json
{ "full_name": "...", "email": "...", "subject": "...", "message": "..." }
```

### POST `/contact/quote` (public, rate limited 5/hour)
```json
{ "full_name": "...", "email": "...", "service_type": "Integrated Logistics", "origin": "...", "destination": "..." }
```

### GET `/contact/contact` (admin) — list submissions
### GET `/contact/quotes` (admin) — list quote requests

## Error Format

All errors follow:
```json
{ "success": false, "error": "Human-readable message" }
```

## Health Check

### GET `/health` (no `/api` prefix)
```json
{ "status": "ok", "service": "Sarvic Global API", "version": "1.0.0", "timestamp": "..." }
```
