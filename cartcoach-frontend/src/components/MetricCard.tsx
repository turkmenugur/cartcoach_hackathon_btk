'use client';

import type { ReactNode } from 'react';
import { BarChart3, Zap } from 'lucide-react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  accentColor?: 'red' | 'green' | 'orange';
}

const accentStyles = {
  red: 'from-rose-500/10 to-rose-500/5 text-rose-600',
  green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
  orange: 'from-primary-500/15 to-primary-500/5 text-primary-700',
} as const;

export function MetricCard({
  icon,
  label,
  value,
  subtitle,
  accentColor = 'orange',
}: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-100 bg-gradient-to-br p-4 shadow-xs ${accentStyles[accentColor]}`}
    >
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-neutral-600">{subtitle}</p>
    </div>
  );
}

interface RiskMetricProps {
  riskScore: number;
  userProfile: string;
}

export function RiskMetric({ riskScore, userProfile }: RiskMetricProps) {
  return (
    <MetricCard
      icon={<Zap className="h-4 w-4" />}
      label="Terk riski"
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
      label="Kurtarilan ciro"
      value={`${monthlyRecovery.toLocaleString('tr-TR')} TL`}
      subtitle="aylik tahmini"
      accentColor="green"
    />
  );
}
