-- =============================================================
-- SARVIC GLOBAL LTD — Seed Data (Development & Testing)
-- Run AFTER schema.sql
-- =============================================================

-- =============================================================
-- DEFAULT SUPER ADMIN
-- Password: Admin@Sarvic2024 (bcrypt hash — change immediately)
-- =============================================================
INSERT INTO admin_users (id, email, password_hash, full_name, role)
VALUES (
  uuid_generate_v4(),
  'admin@sarvicglobal.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewk.eCWxPnJP0iqe',
  'Victor Uchechukwu Dike',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- =============================================================
-- SAMPLE CLIENTS
-- =============================================================
INSERT INTO clients (id, full_name, email, phone, country, company_name)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Emeka Okafor', 'emeka@example.com', '+2348012345678', 'Nigeria', 'Okafor Building Supplies'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Adaeze Nwosu', 'adaeze@example.com', '+2348098765432', 'Nigeria', 'Nwosu Interiors Ltd'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Mohammed Al-Rashid', 'mohammed@example.com', '+905001234567', 'Turkey', 'Rashid Trading Co')
ON CONFLICT DO NOTHING;

-- =============================================================
-- SAMPLE SHIPMENTS
-- =============================================================
INSERT INTO shipments (
  id, tracking_number, client_id, cargo_type, description, weight_kg,
  origin, destination, transport_mode, status, current_location,
  expected_delivery, created_at
)
VALUES
  (
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'SVG-2606-8941',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Building Materials',
    'Ceramic tiles and sanitary fittings - 200 cartons',
    2400.00,
    'Guangzhou, China',
    'Lagos, Nigeria',
    'ocean',
    'in_transit',
    'Port of Singapore (Transshipment)',
    '2026-07-05',
    NOW() - INTERVAL '11 days'
  ),
  (
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'SVG-1506-3312',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Apparel',
    'Women''s clothing collection - 85 cartons',
    420.00,
    'Guangzhou, China',
    'Lagos, Nigeria',
    'air',
    'customs_clearing',
    'Murtala Muhammed International Airport, Lagos',
    '2026-06-20',
    NOW() - INTERVAL '5 days'
  ),
  (
    'f6a7b8c9-d0e1-2345-fabc-456789012345',
    'SVG-0506-7734',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Automotive Parts',
    'Engine components and body spare parts',
    850.00,
    'Guangzhou, China',
    'Istanbul, Turkey',
    'ocean',
    'delivered',
    'Istanbul Port',
    '2026-06-10',
    NOW() - INTERVAL '25 days'
  )
ON CONFLICT (tracking_number) DO NOTHING;

-- =============================================================
-- SAMPLE SHIPMENT EVENTS
-- =============================================================
INSERT INTO shipment_events (shipment_id, event_type, location, description, occurred_at, is_system_generated)
VALUES
  -- SVG-2606-8941 events
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'status_change', 'Guangzhou Warehouse', 'Goods received at Guangzhou warehouse. Inspection completed.', NOW() - INTERVAL '11 days', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'status_change', 'Guangzhou Port', 'Container loaded and sealed. Container No: TCKU3456789.', NOW() - INTERVAL '8 days', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'status_change', 'Guangzhou Port', 'Vessel departed Guangzhou Port. Vessel: MV Pacific Star, Voyage: PS0612.', NOW() - INTERVAL '4 days', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'location_update', 'Port of Singapore', 'Transshipment at Singapore. Connecting to West Africa service.', NOW() - INTERVAL '1 day', true),

  -- SVG-1506-3312 events
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'status_change', 'Guangzhou Warehouse', 'Cargo received and consolidated at Guangzhou facility.', NOW() - INTERVAL '5 days', true),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'status_change', 'Guangzhou Airport', 'Shipment loaded on flight CA0901 to Lagos via Addis Ababa.', NOW() - INTERVAL '4 days', true),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'status_change', 'Lagos, Nigeria', 'Arrived at Murtala Muhammed Airport. Awaiting customs clearance.', NOW() - INTERVAL '1 day', true),

  -- SVG-0506-7734 events (completed)
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'status_change', 'Guangzhou Warehouse', 'Goods received. Quality inspection completed.', NOW() - INTERVAL '25 days', true),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'status_change', 'Guangzhou Port', 'Container loaded. Vessel: MV Ocean Pearl.', NOW() - INTERVAL '22 days', true),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'status_change', 'En Route', 'Vessel in transit via Indian Ocean.', NOW() - INTERVAL '15 days', true),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'status_change', 'Istanbul Port', 'Arrived Istanbul Port. Customs clearance completed.', NOW() - INTERVAL '6 days', true),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'status_change', 'Istanbul, Turkey', 'Shipment delivered to client warehouse.', NOW() - INTERVAL '3 days', true)
ON CONFLICT DO NOTHING;
