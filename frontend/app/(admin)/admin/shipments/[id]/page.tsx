'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getErrorMessage, generateIdempotencyKey } from '@/lib/api';
import { Shipment, STATUS_LABELS, STATUS_BADGE_CLASS, MODE_LABELS } from '@/types';
import { format } from 'date-fns';
import {
  ArrowLeft, MapPin, Package, CalendarBlank, CurrencyDollar,
  FileText, Download, Trash, CheckCircle, Warning, PaperPlaneTilt,
} from '@phosphor-icons/react';
import toast, { Toaster } from 'react-hot-toast';

const allStatuses: { value: string; label: string }[] = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

interface ShipmentDetail extends Shipment {
  events: any[];
  documents: any[];
  created_by_name?: string;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Status update form state
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [note, setNote] = useState('');

  // Manual event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventDesc, setEventDesc] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Document upload state
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docType, setDocType] = useState('invoice');

  const fetchShipment = useCallback(async () => {
    try {
      const { data } = await api.get(`/shipments/${id}`);
      setShipment(data.data);
      setNewStatus(data.data.status);
      setLocation(data.data.use_manual_location ? data.data.current_location_manual : data.data.current_location || '');
      setUseManualLocation(data.data.use_manual_location);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/shipments/${id}/status`, {
        status: newStatus,
        current_location: location || undefined,
        use_manual_location: useManualLocation,
        note: note || undefined,
      }, {
        headers: { 'Idempotency-Key': generateIdempotencyKey() },
      });
      toast.success('Shipment status updated. Notifications sent to client.');
      setNote('');
      fetchShipment();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDesc.trim()) return;
    setUpdating(true);
    try {
      await api.post(`/shipments/${id}/events`, {
        description: eventDesc,
        location: eventLocation || undefined,
        event_type: 'note',
      }, {
        headers: { 'Idempotency-Key': generateIdempotencyKey() },
      });
      toast.success('History entry added.');
      setEventDesc('');
      setEventLocation('');
      setShowEventForm(false);
      fetchShipment();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this shipment? This action marks it as cancelled and removes it from public tracking.')) return;
    try {
      await api.delete(`/shipments/${id}`);
      toast.success('Shipment cancelled.');
      router.push('/admin/shipments');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !shipment) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);

    try {
      await api.post(`/documents/${shipment.id}`, formData);
      toast.success('Document uploaded.');
      fetchShipment();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Remove this document?')) return;
    try {
      await api.delete(`/documents/${documentId}`);
      toast.success('Document removed.');
      fetchShipment();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-rule border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!shipment) {
    return <p className="text-sm text-mist py-12 text-center">Shipment not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />

      <Link href="/admin/shipments" className="inline-flex items-center gap-2 text-2xs tracking-wider uppercase text-mist hover:text-ink transition-colors">
        <ArrowLeft size={14} /> Back to Shipments
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-2xl text-ink tracking-wider mb-2">{shipment.tracking_number}</p>
          <span className={`badge ${STATUS_BADGE_CLASS[shipment.status]}`}>{STATUS_LABELS[shipment.status]}</span>
        </div>
        <button onClick={handleCancel} className="flex items-center gap-2 text-2xs tracking-wider uppercase text-red-700 hover:text-red-900 transition-colors">
          <Trash size={14} /> Cancel Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: details + status update */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipment Info */}
          <div className="admin-card">
            <p className="eyebrow text-mist mb-5">Shipment Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <InfoItem icon={<Package size={15} />} label="Cargo Type" value={shipment.cargo_type} />
              <InfoItem icon={<Package size={15} />} label="Mode" value={MODE_LABELS[shipment.transport_mode]} />
              <InfoItem icon={<MapPin size={15} />} label="Origin" value={shipment.origin} />
              <InfoItem icon={<MapPin size={15} />} label="Destination" value={shipment.destination} />
              <InfoItem icon={<CalendarBlank size={15} />} label="Expected Delivery" value={shipment.expected_delivery ? format(new Date(shipment.expected_delivery), 'MMM d, yyyy') : '—'} />
              <InfoItem icon={<CurrencyDollar size={15} />} label="Declared Value" value={shipment.declared_value ? `${shipment.currency} ${shipment.declared_value}` : '—'} />
              {shipment.weight_kg && <InfoItem icon={<Package size={15} />} label="Weight" value={`${shipment.weight_kg} kg`} />}
              {shipment.description && <InfoItem icon={<FileText size={15} />} label="Description" value={shipment.description} />}
            </div>
            {shipment.client_name && (
              <div className="mt-6 pt-6 border-t border-rule">
                <p className="text-2xs tracking-wider text-mist uppercase mb-3">Client</p>
                <p className="text-sm text-ink font-medium">{shipment.client_name}</p>
                <div className="flex flex-wrap gap-4 mt-1">
                  {shipment.client_email && <p className="text-xs text-mist">{shipment.client_email}</p>}
                  {shipment.client_phone && <p className="text-xs text-mist">{shipment.client_phone}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Status Update Form */}
          <div className="admin-card">
            <p className="eyebrow text-mist mb-5">Update Status & Location</p>
            <form onSubmit={handleStatusUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    {allStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Current Location</label>
                  <input
                    className="input"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setUseManualLocation(true); }}
                    placeholder="e.g. Port of Singapore"
                  />
                </div>
              </div>
              <div>
                <label className="label">Note (optional — shown in history)</label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Vessel delayed due to weather, new ETA confirmed"
                />
              </div>
              <button type="submit" disabled={updating} className="btn-primary py-3 px-6 disabled:opacity-60">
                <PaperPlaneTilt size={15} weight="light" />
                {updating ? 'Updating…' : 'Update & Notify Client'}
              </button>
              <p className="text-2xs text-mist">
                Updating status automatically sends a notification to the client via email (and SMS/WhatsApp if configured).
              </p>
            </form>
          </div>

          {/* Documents */}
          <div className="admin-card">
            <p className="eyebrow text-mist mb-5">Documents</p>

            {shipment.documents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {shipment.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-3 border border-rule p-3">
                    <FileText size={18} weight="light" className="text-gold shrink-0" />
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink flex-1 truncate hover:text-gold-dark">
                      {doc.file_name}
                    </a>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-mist hover:text-ink shrink-0">
                      <Download size={14} />
                    </a>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-mist hover:text-red-700 shrink-0">
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-stretch pt-4 border-t border-rule">
              <select className="input sm:w-48" value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="invoice">Invoice</option>
                <option value="packing_list">Packing List</option>
                <option value="bill_of_lading">Bill of Lading</option>
                <option value="airway_bill">Airway Bill</option>
                <option value="customs_declaration">Customs Declaration</option>
                <option value="certificate_of_origin">Certificate of Origin</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
              <label className="btn-ghost py-3 px-5 text-2xs cursor-pointer flex-1 justify-center">
                {uploadingDoc ? 'Uploading…' : 'Choose File to Upload (PDF, JPEG, PNG, max 15MB)'}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleUpload}
                  disabled={uploadingDoc}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-2xs text-mist mt-3">
              Uploads require Supabase Storage to be configured on the backend
              (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).
            </p>
          </div>
        </div>

        {/* Right column: history timeline */}
        <div className="lg:col-span-1">
          <div className="admin-card">
            <div className="flex items-center justify-between mb-5">
              <p className="eyebrow text-mist">History</p>
              <button onClick={() => setShowEventForm(!showEventForm)} className="text-2xs tracking-wider uppercase text-gold hover:text-gold-dark">
                {showEventForm ? 'Cancel' : '+ Add Entry'}
              </button>
            </div>

            {showEventForm && (
              <form onSubmit={handleAddEvent} className="mb-6 pb-6 border-b border-rule space-y-3">
                <textarea
                  rows={2}
                  required
                  className="input resize-none text-sm"
                  placeholder="Description"
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                />
                <input
                  className="input text-sm"
                  placeholder="Location (optional)"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                />
                <button type="submit" disabled={updating} className="btn-ghost text-2xs py-2 px-4 w-full justify-center">
                  Add to History
                </button>
              </form>
            )}

            <div className="space-y-5 max-h-[600px] overflow-y-auto">
              {shipment.events.length === 0 ? (
                <p className="text-xs text-mist">No history yet.</p>
              ) : (
                shipment.events.map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-3 pb-5 border-b border-rule last:border-0 last:pb-0">
                    <div className="shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-ink leading-relaxed">{event.description}</p>
                      {event.location && <p className="text-2xs text-mist mt-1">{event.location}</p>}
                      <p className="text-2xs text-mist/70 font-mono mt-1">
                        {format(new Date(event.occurred_at), 'MMM d, HH:mm')}
                        {event.created_by_name && ` · ${event.created_by_name}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gold mb-1.5">{icon}</div>
      <p className="text-2xs tracking-wider text-mist uppercase mb-0.5">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  );
}
