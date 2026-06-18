import type { Icon } from '@phosphor-icons/react';
import { clsx } from 'clsx';

interface StatCardProps {
  icon: Icon;
  label: string;
  value: number | string;
  loading?: boolean;
  accent?: 'gold' | 'navy' | 'default';
}

export default function StatCard({ icon: Icon, label, value, loading, accent = 'default' }: StatCardProps) {
  return (
    <div className="stat-card">
      <Icon
        size={20}
        weight="light"
        className={clsx(
          'mb-4',
          accent === 'gold' && 'text-gold',
          accent === 'navy' && 'text-navy',
          accent === 'default' && 'text-mist'
        )}
      />
      {loading ? (
        <div className="h-8 w-12 bg-rule animate-pulse mb-1" />
      ) : (
        <p className="font-display text-3xl text-ink font-light">{value}</p>
      )}
      <p className="text-2xs tracking-wider text-mist uppercase mt-1">{label}</p>
    </div>
  );
}
