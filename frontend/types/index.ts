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

export interface ShipmentEvent {
  id?: string;
  event_type: string;
  location: string | null;
  description: string;
  occurred_at: string;
  is_system_generated?: boolean;
  created_by_name?: string;
}

export interface ShipmentDocument {
  id?: string;
  document_type: string;
  file_name: string;
  file_url: string;
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
  description?: string | null;
  client_name?: string | null;
  created_at: string;
  updated_at: string;
  events: ShipmentEvent[];
  documents: ShipmentDocument[];
}

export interface Shipment extends PublicTrackingResult {
  id: string;
  client_id: string | null;
  weight_kg: number | null;
  volume_cbm: number | null;
  quantity: number | null;
  unit: string | null;
  declared_value: number | null;
  currency: string;
  freight_cost: number | null;
  special_instructions: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  use_manual_location: boolean;
  current_location_manual: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  client_company?: string | null;
}

export interface Client {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  company_name: string | null;
  notes: string | null;
  total_shipments?: number;
  active_shipments?: number;
  created_at: string;
}

export interface DashboardStats {
  total_shipments: number;
  in_transit: number;
  delivered: number;
  pending: number;
  on_hold: number;
  customs_clearing: number;
  total_clients: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'operator';
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

export const STATUS_PROGRESS_ORDER: ShipmentStatus[] = [
  'received',
  'loading',
  'in_transit',
  'customs_clearing',
  'ready_for_pickup',
  'delivered',
];

export const STATUS_BADGE_CLASS: Record<ShipmentStatus, string> = {
  received: 'badge-received',
  loading: 'badge-loading',
  in_transit: 'badge-transit',
  customs_clearing: 'badge-customs',
  ready_for_pickup: 'badge-pickup',
  out_for_delivery: 'badge-pickup',
  delivered: 'badge-delivered',
  on_hold: 'badge-hold',
  cancelled: 'badge-hold',
};
