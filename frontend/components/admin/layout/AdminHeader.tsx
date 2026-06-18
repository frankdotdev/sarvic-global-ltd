'use client';

import { SignOut, Bell } from '@phosphor-icons/react';
import { AdminUser } from '@/types';

export default function AdminHeader({ admin, onLogout }: { admin: AdminUser | null; onLogout: () => void }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-navy border-b border-white/10 px-4 h-16 flex items-center justify-between">
      <div>
        <p className="font-display text-lg text-white tracking-tighter leading-none">Sarvic Global</p>
        <p className="text-2xs text-gold/70 tracking-widest uppercase">Admin</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-2xs text-white/50 truncate max-w-[100px]">{admin?.full_name}</span>
        <button onClick={onLogout} className="p-2 text-white/60 hover:text-white" aria-label="Sign out">
          <SignOut size={18} weight="light" />
        </button>
      </div>
    </header>
  );
}
