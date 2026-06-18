'use client';

import { useState, useEffect } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { CheckCircle, XCircle, Lock } from '@phosphor-icons/react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword });
      toast.success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13, borderRadius: 0 } }} />

      <div>
        <p className="eyebrow text-mist mb-2">Account</p>
        <h1 className="heading-section">Settings</h1>
      </div>

      {/* Account Info */}
      <div className="admin-card">
        <p className="eyebrow text-mist mb-5">Account Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-2xs tracking-wider text-mist uppercase mb-1">Name</p>
            <p className="text-sm text-ink">{admin?.full_name}</p>
          </div>
          <div>
            <p className="text-2xs tracking-wider text-mist uppercase mb-1">Email</p>
            <p className="text-sm text-ink">{admin?.email}</p>
          </div>
          <div>
            <p className="text-2xs tracking-wider text-mist uppercase mb-1">Role</p>
            <p className="text-sm text-ink capitalize">{admin?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="admin-card">
        <p className="eyebrow text-mist mb-5">Change Password</p>
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="label">Current Password</label>
            <input required type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">New Password</label>
              <input required type="password" minLength={8} className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input required type="password" minLength={8} className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-3 px-6 disabled:opacity-60">
            <Lock size={15} weight="light" />
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notification Channels Status */}
      <div className="admin-card">
        <p className="eyebrow text-mist mb-2">Notification Channels</p>
        <p className="text-xs text-mist mb-5">
          These statuses reflect whether each channel is configured on the backend server.
          Channels marked &ldquo;Not Configured&rdquo; will silently skip sending until API keys are added.
        </p>
        <div className="space-y-3">
          <ChannelStatus name="Email (Resend)" configured envVar="RESEND_API_KEY" />
          <ChannelStatus name="SMS (Termii)" configured={false} envVar="TERMII_API_KEY" />
          <ChannelStatus name="WhatsApp (Meta Cloud API)" configured={false} envVar="META_WA_TOKEN, META_WA_PHONE_ID" />
        </div>
      </div>
    </div>
  );
}

function ChannelStatus({ name, configured, envVar }: { name: string; configured: boolean; envVar: string }) {
  return (
    <div className="flex items-center justify-between border border-rule px-4 py-3">
      <div>
        <p className="text-sm text-ink">{name}</p>
        <p className="text-2xs text-mist font-mono mt-0.5">{envVar}</p>
      </div>
      {configured ? (
        <span className="flex items-center gap-1.5 text-2xs tracking-wider uppercase text-green-700">
          <CheckCircle size={14} weight="fill" /> Active
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-2xs tracking-wider uppercase text-mist">
          <XCircle size={14} weight="light" /> Not Configured
        </span>
      )}
    </div>
  );
}
