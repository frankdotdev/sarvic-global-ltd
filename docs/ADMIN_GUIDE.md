# Admin Dashboard Guide

## Accessing the Dashboard

Navigate to `/admin/login` and sign in with your admin credentials.
Sessions last 8 hours (configurable via `JWT_EXPIRES_IN` in backend `.env`).

## Roles

| Role | Permissions |
|---|---|
| `super_admin` | Full access, including deleting clients |
| `admin` | Create/edit/cancel shipments, manage clients |
| `operator` | Create/edit shipments, view clients (cannot cancel or delete) |

## Dashboard Overview

The main dashboard shows six live statistics (total shipments, in transit,
delivered, pending, customs clearing, total clients) plus a table of the
8 most recent shipments.

## Managing Shipments

### Creating a Shipment

Go to **Create Shipment**. Fill in client details (a new client is
created automatically if no existing client is selected), cargo details,
route, and optional financial information. On submission, a tracking
number is generated automatically and a booking confirmation is sent to
the client's email if provided.

### Updating Status

Open any shipment's detail page (**Shipments → Manage**). Use the **Update
Status & Location** form to:

- Change the shipment status (dropdown)
- Set or override the current location
- Add an optional note (saved to shipment history)

Submitting this form **automatically notifies the client** via every
configured channel (email always; SMS/WhatsApp once configured).

### Adding Manual History Entries

On the shipment detail page, click **+ Add Entry** in the History panel
to log a custom event (e.g. "Customer requested address change") without
changing the shipment's status.

### Cancelling a Shipment

Click **Cancel Shipment** on the detail page. This sets status to
`cancelled`, which removes it from public tracking but preserves all
data for internal records. Requires `admin` or `super_admin` role.

## Managing Clients

The **Clients** page lists all clients with shipment counts. Click into
any client to view their full shipment history, edit their details, or
add notes.

## Settings

- **Change Password** — update your own login credentials
- **Notification Channels** — view which notification channels
  (Email/SMS/WhatsApp) are currently active based on backend
  configuration

## Mobile Usage

The admin dashboard is fully responsive. On mobile, navigation moves to
a bottom tab bar (Dashboard / Shipments / Create / Clients / Settings)
with a sticky top header showing your name and a sign-out button.
