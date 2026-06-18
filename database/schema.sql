-- =============================================================
-- SARVIC GLOBAL LTD — PostgreSQL Database Schema
-- Compatible with Supabase, Neon, Railway, or any VPS PostgreSQL
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- ADMIN USERS
-- =============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('super_admin', 'admin', 'operator')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- CLIENTS
-- =============================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  country TEXT,
  company_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- SHIPMENTS
-- =============================================================
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  -- Cargo details
  cargo_type TEXT NOT NULL,
  description TEXT,
  weight_kg DECIMAL(10,2),
  volume_cbm DECIMAL(10,4),
  quantity INTEGER,
  unit TEXT,

  -- Route
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  transport_mode TEXT NOT NULL CHECK (transport_mode IN ('air', 'ocean', 'rail', 'road', 'multimodal')),

  -- Status
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN (
      'received',
      'loading',
      'in_transit',
      'customs_clearing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
      'on_hold',
      'cancelled'
    )
  ),

  -- Location tracking
  current_location TEXT,
  current_location_manual TEXT, -- Admin override location
  use_manual_location BOOLEAN DEFAULT false,

  -- Dates
  expected_delivery DATE,
  actual_delivery TIMESTAMPTZ,

  -- Financials (optional)
  declared_value DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  freight_cost DECIMAL(15,2),

  -- Metadata
  special_instructions TEXT,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,

  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- SHIPMENT EVENTS (Timeline / History Log)
-- =============================================================
CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  is_system_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- SHIPMENT DOCUMENTS
-- =============================================================
CREATE TABLE IF NOT EXISTS shipment_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (
    document_type IN (
      'invoice',
      'packing_list',
      'bill_of_lading',
      'airway_bill',
      'customs_declaration',
      'certificate_of_origin',
      'insurance',
      'other'
    )
  ),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- NOTIFICATION LOGS
-- =============================================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp')),
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- IDEMPOTENCY KEYS (prevent duplicate operations)
-- =============================================================
CREATE TABLE IF NOT EXISTS idempotency_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  endpoint TEXT NOT NULL,
  response_status INTEGER,
  response_body JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- =============================================================
-- CONTACT FORM SUBMISSIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  source_office TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- QUOTE REQUESTS
-- =============================================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  origin TEXT,
  destination TEXT,
  cargo_description TEXT,
  estimated_weight TEXT,
  additional_notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'quoted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- RATE LIMIT TRACKING (for tracking API endpoint)
-- =============================================================
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================

-- Shipments
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_client_id ON shipments(client_id);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_transport_mode ON shipments(transport_mode);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON shipment_events(occurred_at DESC);

-- Documents
CREATE INDEX IF NOT EXISTS idx_docs_shipment_id ON shipment_documents(shipment_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_shipment_id ON notification_logs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notification_logs(status);

-- Idempotency
CREATE INDEX IF NOT EXISTS idx_idempotency_key ON idempotency_keys(key);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);

-- Rate limits
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip ON rate_limit_log(ip_address, endpoint, window_start);

-- Clients
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- =============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trigger_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- ROW LEVEL SECURITY (Supabase — optional but recommended)
-- =============================================================

-- Enable RLS on sensitive tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Public read policy for tracking (shipments only — limited fields via VIEW)
-- We expose a view rather than the raw table for public tracking
CREATE OR REPLACE VIEW public_shipment_view AS
SELECT
  s.tracking_number,
  s.status,
  s.transport_mode,
  s.origin,
  s.destination,
  CASE WHEN s.use_manual_location THEN s.current_location_manual ELSE s.current_location END AS current_location,
  s.expected_delivery,
  s.actual_delivery,
  s.cargo_type,
  s.created_at,
  s.updated_at
FROM shipments s
WHERE s.status != 'cancelled';

-- =============================================================
-- CLEANUP FUNCTION (scheduled via pg_cron or Supabase Edge Function)
-- =============================================================
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency_keys()
RETURNS void AS $$
BEGIN
  DELETE FROM idempotency_keys WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
