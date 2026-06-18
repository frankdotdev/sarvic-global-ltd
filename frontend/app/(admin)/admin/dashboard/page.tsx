'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardStats, Shipment } from '@/types';
import StatCard from '@/components/admin/dashboard/StatCard';
import RecentShipmentsTable from '@/components/admin/dashboard/RecentShipmentsTable';
import { Package, Truck, CheckCircle, Clock, Stamp, Users, PlusCircle } from '@phosphor-icons/react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, shipmentsRes] = await Promise.all([
          api.get('/shipments/stats'),
          api.get('/shipments?limit=8'),
        ]);
        setStats(statsRes.data.data);
        setRecentShipments(shipmentsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mist mb-2">Overview</p>
          <h1 className="heading-section">Dashboard</h1>
        </div>
        <Link href="/admin/create" className="btn-primary py-3 px-5">
          <PlusCircle size={16} weight="light" />
          New Shipment
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Package} label="Total Shipments" value={stats?.total_shipments ?? '—'} loading={loading} />
        <StatCard icon={Truck} label="In Transit" value={stats?.in_transit ?? '—'} loading={loading} accent="navy" />
        <StatCard icon={CheckCircle} label="Delivered" value={stats?.delivered ?? '—'} loading={loading} accent="gold" />
        <StatCard icon={Clock} label="Pending" value={stats?.pending ?? '—'} loading={loading} />
        <StatCard icon={Stamp} label="Customs" value={stats?.customs_clearing ?? '—'} loading={loading} />
        <StatCard icon={Users} label="Clients" value={stats?.total_clients ?? '—'} loading={loading} />
      </div>

      {/* Recent Shipments */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <p className="eyebrow text-mist">Recent Shipments</p>
          <Link href="/admin/shipments" className="text-2xs tracking-wider uppercase text-gold hover:text-gold-dark">
            View All →
          </Link>
        </div>
        <RecentShipmentsTable shipments={recentShipments} loading={loading} />
      </div>
    </div>
  );
}
