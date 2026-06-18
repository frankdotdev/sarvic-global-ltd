'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Shipment, STATUS_LABELS, STATUS_BADGE_CLASS, MODE_LABELS } from '@/types';
import { MagnifyingGlass, PlusCircle, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { format } from 'date-fns';

const statusFilters = ['', 'received', 'loading', 'in_transit', 'customs_clearing', 'ready_for_pickup', 'delivered', 'on_hold'];

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/shipments', {
        params: { search: search || undefined, status: status || undefined, page, limit: 15 },
      });
      setShipments(data.data);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mist mb-2">Manage</p>
          <h1 className="heading-section">Shipments</h1>
        </div>
        <Link href="/admin/create" className="btn-primary py-3 px-5">
          <PlusCircle size={16} weight="light" />
          New Shipment
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="flex-1 flex items-center bg-paper border border-rule px-3">
            <MagnifyingGlass size={16} className="text-mist shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search tracking number, client name, company…"
              className="flex-1 bg-transparent text-sm px-3 py-3 outline-none placeholder:text-mist"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`text-2xs tracking-wider uppercase px-3.5 py-2 border transition-colors ${
                status === s ? 'bg-ink text-white border-ink' : 'border-rule text-mist hover:border-ink hover:text-ink'
              }`}
            >
              {s === '' ? 'All' : STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-rule/40 animate-pulse" />)}
          </div>
        ) : shipments.length === 0 ? (
          <p className="text-sm text-mist py-12 text-center">No shipments match your filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-5 md:-mx-6">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-5 md:px-6 py-3">Tracking #</th>
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Client</th>
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Route</th>
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Mode</th>
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Status</th>
                    <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Created</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s.id} className="border-b border-rule last:border-0 hover:bg-paper transition-colors">
                      <td className="px-5 md:px-6 py-4 font-mono text-sm text-ink">{s.tracking_number}</td>
                      <td className="px-3 py-4 text-sm text-steel">{s.client_name || '—'}</td>
                      <td className="px-3 py-4 text-xs text-mist whitespace-nowrap">{s.origin} → {s.destination}</td>
                      <td className="px-3 py-4 text-xs text-steel">{MODE_LABELS[s.transport_mode]}</td>
                      <td className="px-3 py-4">
                        <span className={`badge ${STATUS_BADGE_CLASS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                      </td>
                      <td className="px-3 py-4 text-xs text-mist whitespace-nowrap">{format(new Date(s.created_at), 'MMM d, yyyy')}</td>
                      <td className="px-3 py-4">
                        <Link href={`/admin/shipments/${s.id}`} className="text-2xs tracking-wider uppercase text-gold hover:text-gold-dark whitespace-nowrap">
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-rule">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-rule disabled:opacity-30 hover:border-ink transition-colors"
                >
                  <CaretLeft size={14} />
                </button>
                <span className="text-xs text-mist">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-rule disabled:opacity-30 hover:border-ink transition-colors"
                >
                  <CaretRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
