'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { SquaresFour, Package, PlusCircle, Users, Gear } from '@phosphor-icons/react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: SquaresFour },
  { label: 'Shipments', href: '/admin/shipments', icon: Package },
  { label: 'Create', href: '/admin/create', icon: PlusCircle },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Gear },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-white/10 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const isCreate = item.href === '/admin/create';
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1"
            >
              {isCreate ? (
                <div className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center -mt-4 transition-colors',
                  active ? 'bg-gold' : 'bg-white/10'
                )}>
                  <Icon size={20} weight={active ? 'fill' : 'light'} className={active ? 'text-ink' : 'text-white'} />
                </div>
              ) : (
                <>
                  <Icon size={20} weight={active ? 'fill' : 'light'} className={active ? 'text-gold' : 'text-white/50'} />
                  <span className={clsx('text-[10px] tracking-wide', active ? 'text-gold' : 'text-white/50')}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
