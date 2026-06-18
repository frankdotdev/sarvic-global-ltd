# Tracking System

## Tracking Number Format

```
SVG-DDMM-XXXX
```

- `SVG` — fixed prefix for Sarvic Global
- `DDMM` — day and month the shipment was created (e.g. `2606` = June 26)
- `XXXX` — random 4-digit number, guaranteed unique

**Example:** `SVG-2606-8941`

Generated automatically by `backend/src/utils/trackingNumber.ts` on shipment
creation. Uniqueness is checked against the database with up to 10 retry
attempts before falling back to a timestamp-based suffix.

## Status Flow

Shipments move through six primary stages, in order:

1. **Received at Warehouse** (`received`)
2. **Loading & Consolidation** (`loading`)
3. **In Transit** (`in_transit`)
4. **Customs Clearing** (`customs_clearing`)
5. **Ready for Pickup** (`ready_for_pickup`)
6. **Delivered** (`delivered`)

Two side-states exist outside the linear progress bar:

- **On Hold** (`on_hold`) — shown as a warning banner on the public tracking page; progress bar freezes
- **Cancelled** (`cancelled`) — shipment is excluded from public tracking entirely
- **Out for Delivery** (`out_for_delivery`) — optional sub-state between "Ready for Pickup" and "Delivered"

## Public Tracking API

```
GET /api/tracking/:trackingNumber
```

- Rate limited to **10 requests/minute per IP**
- Returns limited fields only (no internal financial data, no admin notes)
- Excludes cancelled shipments (404 returned)
- Includes: status, current location, route, cargo type, full event
  history, and downloadable documents (invoice, packing list, bill of
  lading, airway bill, certificate of origin only — internal docs excluded)

## Manual Location Override

Admins can override the system-tracked location with a manual value via
the shipment detail page. This is stored separately
(`current_location_manual` + `use_manual_location` flag) so the original
system location isn't lost if the override is later removed.

## Notifications on Status Change

Every status update via `PATCH /api/shipments/:id/status` triggers
`notifyStatusUpdate()`, which fires email, SMS, and WhatsApp notifications
concurrently (`Promise.allSettled`) to the client's stored email/phone.
Channels without configured API keys silently skip — see
[NOTIFICATIONS.md](./NOTIFICATIONS.md).

## Idempotency

Status updates and shipment creation support an `Idempotency-Key` header.
If the same key is sent twice (e.g. due to a network retry), the cached
response from the first request is returned instead of processing the
operation again. Keys expire after 24 hours.
