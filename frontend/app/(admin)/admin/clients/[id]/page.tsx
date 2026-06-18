'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { STATUS_LABELS, STATUS_BADGE_CLASS, MODE_LABELS } from '@/types';
import { ArrowLeft, Envelope, Phone, MapPin, Buildings, PencilSimple } from '@phosphor-icons/react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

interface ClientDetail {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  company_name: string | null;
  notes: string | null;
  created_at: string;
  shipments: any[];
}

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', country: '', company_name: '', notes: '' });

  const fetchClient = useCallback(async () => {
    try {
      const { data } = await api.get(`/clients/${id}`);
      setClient(data.data);
      setForm({
        full_name: data.data.full_name || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        country: data.data.country || '',
        company_name: data.data.company_name || '',
        notes: data.data.notes || '',
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/clients/${id}`, form);
      toast.success('Client updated.');
      setEditing(false);
      fetchClient();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-rule border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) return <p className="text-sm text-mist py-12 text-center">Client not found.</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />

      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-2xs tracking-wider uppercase text-mist hover:text-ink transition-colors">
        <ArrowLeft size={14} /> Back to Clients
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="heading-section mb-1">{client.full_name}</h1>
          {client.company_name && <p className="text-sm text-mist">{client.company_name}</p>}
        </div>
        <button onClick={() => setEditing(!editing)} className="btn-ghost py-2.5 px-4 text-2xs">
          <PencilSimple size={14} weight="light" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="admin-card">
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={3} className="input resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary py-3 px-6 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-card">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <InfoItem icon={<Envelope size={15} />} label="Email" value={client.email || '—'} />
            <InfoItem icon={<Phone size={15} />} label="Phone" value={client.phone || '—'} />
            <InfoItem icon={<MapPin size={15} />} label="Country" value={client.country || '—'} />
            <InfoItem icon={<Buildings size={15} />} label="Company" value={client.company_name || '—'} />
          </div>
          {client.notes && (
            <div className="mt-6 pt-6 border-t border-rule">
              <p className="text-2xs tracking-wider text-mist uppercase mb-2">Notes</p>
              <p className="text-sm text-steel">{client.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Shipment history */}
      <div className="admin-card">
        <p className="eyebrow text-mist mb-5">Shipment History</p>
        {client.shipments.length === 0 ? (
          <p className="text-sm text-mist py-6 text-center">No shipments yet for this client.</p>
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-5 md:px-6 py-3">Tracking #</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Route</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Mode</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Status</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {client.shipments.map((s) => (
                  <tr key={s.tracking_number} className="border-b border-rule last:border-0 hover:bg-paper transition-colors">
                    <td className="px-5 md:px-6 py-4">
                      <Link href={`/admin/shipments/${s.tracking_number}`} className="font-mono text-sm text-ink hover:text-gold-dark">
                        {s.tracking_number}
                      </Link>
                    </td>
                    <td className="px-3 py-4 text-xs text-mist whitespace-nowrap">{s.origin} → {s.destination}</td>
                    <td className="px-3 py-4 text-xs text-steel">{MODE_LABELS[s.transport_mode as keyof typeof MODE_LABELS]}</td>
                    <td className="px-3 py-4">
                      <span className={`badge ${STATUS_BADGE_CLASS[s.status as keyof typeof STATUS_BADGE_CLASS]}`}>
                        {STATUS_LABELS[s.status as keyof typeof STATUS_LABELS]}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-mist whitespace-nowrap">{format(new Date(s.created_at), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
