'use client';

import { Activity, Watch, type LucideIcon } from 'lucide-react';
import type { ProductIconKey } from '@/types';

const ICON_CONFIG: Record<
  ProductIconKey,
  {
    Icon: LucideIcon;
    label: string;
    gradient: string;
    ring: string;
    iconClass: string;
  }
> = {
  'watch-series': {
    Icon: Watch,
    label: 'Premium saat',
    gradient: 'from-zinc-800 via-slate-700 to-zinc-900',
    ring: 'ring-zinc-200/80',
    iconClass: 'text-white drop-shadow-sm',
  },
  'watch-se': {
    Icon: Activity,
    label: 'Akilli saat',
    gradient: 'from-orange-500 via-amber-500 to-orange-600',
    ring: 'ring-orange-200/80',
    iconClass: 'text-white drop-shadow-sm',
  },
};

type ProductIconProps = {
  icon: ProductIconKey;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: { box: 'h-14 w-14', icon: 'h-6 w-6', rounded: 'rounded-xl' },
  md: { box: 'h-20 w-20', icon: 'h-9 w-9', rounded: 'rounded-2xl' },
  lg: { box: 'h-24 w-24', icon: 'h-11 w-11', rounded: 'rounded-2xl' },
};

export function ProductIcon({
  icon,
  size = 'md',
  className = '',
}: ProductIconProps) {
  const config = ICON_CONFIG[icon];
  const { Icon } = config;
  const sizes = sizeClasses[size];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center bg-gradient-to-br shadow-md ring-2 ${config.gradient} ${config.ring} ${sizes.box} ${sizes.rounded} ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
      <Icon
        className={`relative z-10 ${sizes.icon} ${config.iconClass}`}
        strokeWidth={1.75}
      />
    </div>
  );
}

export function getProductIconLabel(icon: ProductIconKey): string {
  return ICON_CONFIG[icon].label;
}
