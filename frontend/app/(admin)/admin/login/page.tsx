'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getErrorMessage } from '@/lib/api';
import { Lock, Envelope, Eye, EyeSlash } from '@phosphor-icons/react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display text-3xl text-white tracking-tighter font-light">Sarvic Global</p>
          <p className="text-2xs tracking-widest text-gold/80 uppercase mt-1" style={{ letterSpacing: '0.2em' }}>
            Admin Panel
          </p>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-sm border border-white/15 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} weight="light" className="text-gold" />
            <p className="text-sm text-white/70">Secure Admin Access</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 mb-5">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-2xs tracking-wider text-white/50 uppercase mb-2">Email</label>
              <div className="flex items-center bg-white/10 border border-white/20 px-3">
                <Envelope size={16} className="text-white/30 shrink-0" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm px-3 py-3 outline-none placeholder:text-white/20"
                  placeholder="admin@sarvicglobal.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-2xs tracking-wider text-white/50 uppercase mb-2">Password</label>
              <div className="flex items-center bg-white/10 border border-white/20 px-3">
                <Lock size={16} className="text-white/30 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm px-3 py-3 outline-none placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/30 hover:text-white/60 shrink-0">
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary bg-gold text-ink hover:bg-gold-dark w-full justify-center py-4 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-2xs text-white/30 text-center mt-6 tracking-wide">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
