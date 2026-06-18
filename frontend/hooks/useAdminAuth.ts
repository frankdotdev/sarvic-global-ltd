'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminUser } from '@/types';

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setAdmin(data.data);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('sarvic_admin_token', data.data.token);
    }
    setAdmin(data.data.admin);
    return data.data.admin;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sarvic_admin_token');
      }
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  return { admin, loading, login, logout, refetch: checkAuth };
}
