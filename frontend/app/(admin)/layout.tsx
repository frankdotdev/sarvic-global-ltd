'use client';

import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminBottomNav from '@/components/admin/layout/AdminBottomNav';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminAuthGuard from '@/components/admin/layout/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { admin, loading, logout } = useAdminAuth();

  if (isLoginPage) {
    return <div className="bg-navy min-h-screen">{children}</div>;
  }

  return (
    <AdminAuthGuard admin={admin} loading={loading}>
      <div className="min-h-screen bg-paper">
        <AdminSidebar admin={admin} onLogout={logout} />
        <AdminHeader admin={admin} onLogout={logout} />
        <div className="admin-content pb-24 lg:pb-8">
          <div className="container-main pt-6 pb-6 lg:pt-8">{children}</div>
        </div>
        <AdminBottomNav />
      </div>
    </AdminAuthGuard>
  );
}
