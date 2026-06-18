'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  SquaresFour, Package, Users, PlusCircle, Gear, SignOut, Globe,
} from '@phosphor-icons/react';
import { AdminUser } from '@/types';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: SquaresFour },
  { label: 'Shipments', href: '/admin/shipments', icon: Package },
  { label: 'Create Shipment', href: '/admin/create', icon: PlusCircle },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Gear },
];

export default function AdminSidebar({ admin, onLogout }: { admin: AdminUser | null; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="block">
          <span className="font-display text-xl text-white tracking-tighter font-light block">Sarvic Global</span>
          <span className="text-2xs tracking-widest text-gold/80 uppercase font-sans" style={{ letterSpacing: '0.2em' }}>Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                active ? 'bg-white/10 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} weight={active ? 'fill' : 'light'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick link to public site */}
      <div className="px-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <Globe size={18} weight="light" />
          View Public Site
        </Link>
      </div>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="px-2 mb-3">
          <p className="text-sm text-white truncate">{admin?.full_name}</p>
          <p className="text-2xs text-white/40 uppercase tracking-wider">{admin?.role.replace('_', ' ')}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
        >
          <SignOut size={18} weight="light" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
