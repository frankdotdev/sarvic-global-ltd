// =============================================================
// SARVIC GLOBAL LTD — Shared TypeScript Types
// =============================================================

export type ShipmentStatus =
  | 'received'
  | 'loading'
  | 'in_transit'
  | 'customs_clearing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'on_hold'
  | 'cancelled';

export type TransportMode = 'air' | 'ocean' | 'rail' | 'road' | 'multimodal';

export type AdminRole = 'super_admin' | 'admin' | 'operator';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp';

export type DocumentType =
  | 'invoice'
  | 'packing_list'
  | 'bill_of_lading'
  | 'airway_bill'
  | 'customs_declaration'
  | 'certificate_of_origin'
  | 'insurance'
  | 'other';

export interface Shipment {
  id: string;
  tracking_number: string;
  client_id: string | null;
  cargo_type: string;
  description: string | null;
  weight_kg: number | null;
  volume_cbm: number | null;
  quantity: number | null;
  unit: string | null;
  origin: string;
  destination: string;
  transport_mode: TransportMode;
  status: ShipmentStatus;
  current_location: string | null;
  current_location_manual: string | null;
  use_manual_location: boolean;
  expected_delivery: string | null;
  actual_delivery: string | null;
  declared_value: number | null;
  currency: string;
  freight_cost: number | null;
  special_instructions: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentEvent {
  id: string;
  shipment_id: string;
  event_type: string;
  location: string | null;
  description: string;
  occurred_at: string;
  created_by: string | null;
  is_system_generated: boolean;
  created_at: string;
}

export interface ShipmentDocument {
  id: string;
  shipment_id: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  company_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface PublicTrackingResult {
  tracking_number: string;
  status: ShipmentStatus;
  transport_mode: TransportMode;
  origin: string;
  destination: string;
  current_location: string | null;
  expected_delivery: string | null;
  actual_delivery: string | null;
  cargo_type: string;
  events: ShipmentEvent[];
  documents: Array<{
    document_type: DocumentType;
    file_name: string;
    file_url: string;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DashboardStats {
  total_shipments: number;
  in_transit: number;
  delivered: number;
  pending: number;
  on_hold: number;
  total_clients: number;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  received: 'Received at Warehouse',
  loading: 'Loading & Consolidation',
  in_transit: 'In Transit',
  customs_clearing: 'Customs Clearing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
};

export const MODE_LABELS: Record<TransportMode, string> = {
  air: 'Air Cargo',
  ocean: 'Ocean Freight',
  rail: 'Rail Freight',
  road: 'Road Transport',
  multimodal: 'Multimodal',
};

export const STATUS_ORDER: ShipmentStatus[] = [
  'received',
  'loading',
  'in_transit',
  'customs_clearing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
];
