'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types';

export default function AdminAuthGuard({
  admin, loading, children,
}: { admin: AdminUser | null; loading: boolean; children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace('/admin/login');
    }
  }, [loading, admin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-rule border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return <>{children}</>;
}
