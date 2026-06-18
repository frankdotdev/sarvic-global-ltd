'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getErrorMessage, generateIdempotencyKey } from '@/lib/api';
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import toast, { Toaster } from 'react-hot-toast';

const transportModes = [
  { value: 'air', label: 'Air Cargo' },
  { value: 'ocean', label: 'Ocean Freight' },
  { value: 'rail', label: 'Rail Freight' },
  { value: 'road', label: 'Road Transport' },
  { value: 'multimodal', label: 'Multimodal' },
];

const cargoTypes = [
  'Building Materials', 'Sanitary Ware', 'Apparel', 'Automotive Parts',
  'Electronics', 'Machinery', 'General Merchandise', 'Other',
];

export default function CreateShipmentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [createdTracking, setCreatedTracking] = useState('');

  const [form, setForm] = useState({
    // Client
    client_name: '', client_email: '', client_phone: '', client_company: '',
    // Cargo
    cargo_type: cargoTypes[0], description: '', weight_kg: '', volume_cbm: '', quantity: '', unit: '',
    // Route
    origin: '', destination: '', transport_mode: 'ocean',
    // Dates & financials
    expected_delivery: '', declared_value: '', currency: 'USD', freight_cost: '',
    special_instructions: '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.client_name || !form.cargo_type || !form.origin || !form.destination) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : undefined,
        volume_cbm: form.volume_cbm ? parseFloat(form.volume_cbm) : undefined,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        declared_value: form.declared_value ? parseFloat(form.declared_value) : undefined,
        freight_cost: form.freight_cost ? parseFloat(form.freight_cost) : undefined,
        expected_delivery: form.expected_delivery || undefined,
      };

      const { data } = await api.post('/shipments', payload, {
        headers: { 'Idempotency-Key': generateIdempotencyKey() },
      });

      setCreatedTracking(data.data.tracking_number);
      toast.success('Shipment created successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (createdTracking) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />
        <CheckCircle size={48} weight="light" className="text-gold mx-auto mb-6" />
        <p className="font-display text-2xl text-ink mb-3">Shipment Created</p>
        <div className="bg-ink text-white p-6 my-6">
          <p className="text-2xs tracking-wider text-gold/80 uppercase mb-2">Tracking Number</p>
          <p className="font-mono text-2xl tracking-wider">{createdTracking}</p>
        </div>
        <p className="text-sm text-mist mb-8">
          A booking confirmation has been sent to the client if an email was provided.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href={`/admin/shipments`} className="btn-ghost py-3 px-6">View All Shipments</Link>
          <button
            onClick={() => { setCreatedTracking(''); setForm({ ...form, client_name: '', client_email: '', client_phone: '', client_company: '', description: '', weight_kg: '', volume_cbm: '', quantity: '', unit: '', origin: '', destination: '', expected_delivery: '', declared_value: '', freight_cost: '', special_instructions: '' }); }}
            className="btn-primary py-3 px-6"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />

      <Link href="/admin/shipments" className="inline-flex items-center gap-2 text-2xs tracking-wider uppercase text-mist hover:text-ink transition-colors">
        <ArrowLeft size={14} /> Back to Shipments
      </Link>

      <div>
        <p className="eyebrow text-mist mb-2">New Entry</p>
        <h1 className="heading-section">Create Shipment</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info */}
        <div className="admin-card">
          <p className="eyebrow text-mist mb-5">Client Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Client Name *</label>
              <input required className="input" value={form.client_name} onChange={(e) => update('client_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={form.client_company} onChange={(e) => update('client_company', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.client_email} onChange={(e) => update('client_email', e.target.value)} />
            </div>
            <div>
              <label className="label">Phone (for SMS/WhatsApp)</label>
              <input className="input" placeholder="+234..." value={form.client_phone} onChange={(e) => update('client_phone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Cargo Info */}
        <div className="admin-card">
          <p className="eyebrow text-mist mb-5">Cargo Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Cargo Type *</label>
              <select required className="input" value={form.cargo_type} onChange={(e) => update('cargo_type', e.target.value)}>
                {cargoTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Transport Mode *</label>
              <select required className="input" value={form.transport_mode} onChange={(e) => update('transport_mode', e.target.value)}>
                {transportModes.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={2} className="input resize-none" value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input type="number" step="0.01" className="input" value={form.weight_kg} onChange={(e) => update('weight_kg', e.target.value)} />
            </div>
            <div>
              <label className="label">Volume (CBM)</label>
              <input type="number" step="0.0001" className="input" value={form.volume_cbm} onChange={(e) => update('volume_cbm', e.target.value)} />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" className="input" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
            </div>
            <div>
              <label className="label">Unit</label>
              <input className="input" placeholder="cartons, pieces, pallets" value={form.unit} onChange={(e) => update('unit', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="admin-card">
          <p className="eyebrow text-mist mb-5">Route & Schedule</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Origin *</label>
              <input required className="input" placeholder="Guangzhou, China" value={form.origin} onChange={(e) => update('origin', e.target.value)} />
            </div>
            <div>
              <label className="label">Destination *</label>
              <input required className="input" placeholder="Lagos, Nigeria" value={form.destination} onChange={(e) => update('destination', e.target.value)} />
            </div>
            <div>
              <label className="label">Expected Delivery</label>
              <input type="date" className="input" value={form.expected_delivery} onChange={(e) => update('expected_delivery', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="admin-card">
          <p className="eyebrow text-mist mb-5">Financials (Optional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Declared Value</label>
              <input type="number" step="0.01" className="input" value={form.declared_value} onChange={(e) => update('declared_value', e.target.value)} />
            </div>
            <div>
              <label className="label">Currency</label>
              <select className="input" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
                <option value="CNY">CNY</option>
                <option value="TRY">TRY</option>
              </select>
            </div>
            <div>
              <label className="label">Freight Cost</label>
              <input type="number" step="0.01" className="input" value={form.freight_cost} onChange={(e) => update('freight_cost', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="admin-card">
          <label className="label">Special Instructions</label>
          <textarea rows={3} className="input resize-none" value={form.special_instructions} onChange={(e) => update('special_instructions', e.target.value)} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary py-4 px-8 disabled:opacity-60">
          {submitting ? 'Creating Shipment…' : 'Create Shipment'}
        </button>
      </form>
    </div>
  );
}
