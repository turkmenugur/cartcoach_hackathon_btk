'use client';

import type { ReactNode } from 'react';
import { Zap, BarChart3 } from 'lucide-react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  accentColor?: 'red' | 'green' | 'blue';
}

const accentStyles = {
  red: 'text-error-500',
  green: 'text-success-600',
  blue: 'text-primary-600',
} as const;

export function MetricCard({
  icon,
  label,
  value,
  subtitle,
  accentColor = 'blue',
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-surface-primary p-4 shadow-sm transition-shadow duration-normal hover:shadow-md">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
        <span className={accentStyles[accentColor]}>{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{subtitle}</div>
    </div>
  );
}

/* ── Pre-configured metric cards ────────────────────────────── */

interface RiskMetricProps {
  riskScore: number;
  userProfile: string;
}

export function RiskMetric({ riskScore, userProfile }: RiskMetricProps) {
  return (
    <MetricCard
      icon={<Zap className="h-4 w-4" />}
      label="Risk"
      value={`${riskScore}/100`}
      subtitle={userProfile}
      accentColor="red"
    />
  );
}

interface ROIMetricProps {
  monthlyRecovery: number;
}

export function ROIMetric({ monthlyRecovery }: ROIMetricProps) {
  return (
    <MetricCard
      icon={<BarChart3 className="h-4 w-4" />}
      label="ROI"
      value={`${monthlyRecovery.toLocaleString('tr-TR')} TL`}
      subtitle="aylik tahmini kurtarim"
      accentColor="green"
    />
  );
}
