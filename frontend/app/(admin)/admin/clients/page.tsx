'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api, getErrorMessage, generateIdempotencyKey } from '@/lib/api';
import { Client } from '@/types';
import { MagnifyingGlass, PlusCircle, X } from '@phosphor-icons/react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState({ full_name: '', email: '', phone: '', country: '', company_name: '' });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/clients', { params: { search: search || undefined, limit: 50 } });
      setClients(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.full_name) {
      toast.error('Client name is required.');
      return;
    }
    setCreating(true);
    try {
      await api.post('/clients', newClient, {
        headers: { 'Idempotency-Key': generateIdempotencyKey() },
      });
      toast.success('Client added.');
      setNewClient({ full_name: '', email: '', phone: '', country: '', company_name: '' });
      setShowCreateForm(false);
      fetchClients();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mist mb-2">Manage</p>
          <h1 className="heading-section">Clients</h1>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary py-3 px-5">
          {showCreateForm ? <X size={16} weight="light" /> : <PlusCircle size={16} weight="light" />}
          {showCreateForm ? 'Cancel' : 'New Client'}
        </button>
      </div>

      {showCreateForm && (
        <div className="admin-card">
          <p className="eyebrow text-mist mb-5">New Client</p>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input required className="input" value={newClient.full_name} onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={newClient.company_name} onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={newClient.country} onChange={(e) => setNewClient({ ...newClient, country: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={creating} className="btn-primary py-3 px-6 disabled:opacity-60">
                {creating ? 'Adding…' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <div className="flex items-center bg-paper border border-rule px-3 mb-5">
          <MagnifyingGlass size={16} className="text-mist shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, or phone…"
            className="flex-1 bg-transparent text-sm px-3 py-3 outline-none placeholder:text-mist"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-rule/40 animate-pulse" />)}
          </div>
        ) : clients.length === 0 ? (
          <p className="text-sm text-mist py-12 text-center">No clients found.</p>
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-5 md:px-6 py-3">Name</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Company</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Contact</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Shipments</th>
                  <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Joined</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-rule last:border-0 hover:bg-paper transition-colors">
                    <td className="px-5 md:px-6 py-4 text-sm text-ink font-medium">{c.full_name}</td>
                    <td className="px-3 py-4 text-sm text-steel">{c.company_name || '—'}</td>
                    <td className="px-3 py-4 text-xs text-mist">
                      <div>{c.email || '—'}</div>
                      <div>{c.phone || ''}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-steel">{c.total_shipments ?? 0}</td>
                    <td className="px-3 py-4 text-xs text-mist whitespace-nowrap">{format(new Date(c.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-3 py-4">
                      <Link href={`/admin/clients/${c.id}`} className="text-2xs tracking-wider uppercase text-gold hover:text-gold-dark whitespace-nowrap">
                        View →
                      </Link>
                    </td>
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
