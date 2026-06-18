import Link from 'next/link';
import { format } from 'date-fns';
import { Shipment, STATUS_LABELS, STATUS_BADGE_CLASS, MODE_LABELS } from '@/types';

export default function RecentShipmentsTable({ shipments, loading }: { shipments: Shipment[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-rule/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (shipments.length === 0) {
    return <p className="text-sm text-mist py-8 text-center">No shipments yet. Create your first shipment to get started.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-5 md:-mx-6">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-rule">
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-5 md:px-6 py-3">Tracking #</th>
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Client</th>
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Route</th>
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Mode</th>
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Status</th>
            <th className="text-left text-2xs tracking-wider text-mist uppercase font-medium px-3 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="border-b border-rule last:border-0 hover:bg-paper transition-colors">
              <td className="px-5 md:px-6 py-4">
                <Link href={`/admin/shipments/${s.id}`} className="font-mono text-sm text-ink hover:text-gold-dark">
                  {s.tracking_number}
                </Link>
              </td>
              <td className="px-3 py-4 text-sm text-steel">{s.client_name || '—'}</td>
              <td className="px-3 py-4 text-xs text-mist">{s.origin} → {s.destination}</td>
              <td className="px-3 py-4 text-xs text-steel">{MODE_LABELS[s.transport_mode]}</td>
              <td className="px-3 py-4">
                <span className={`badge ${STATUS_BADGE_CLASS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
              </td>
              <td className="px-3 py-4 text-xs text-mist">{format(new Date(s.created_at), 'MMM d, yyyy')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
