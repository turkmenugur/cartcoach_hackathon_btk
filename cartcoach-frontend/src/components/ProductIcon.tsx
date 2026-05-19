'use client';

import {
  Activity,
  Camera,
  Gamepad2,
  Headphones,
  Laptop,
  Smartphone,
  Watch,
  type LucideIcon,
} from 'lucide-react';
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
    label: 'BUFF Aura Watch',
    gradient: 'from-neutral-950 via-zinc-800 to-cyan-950',
    ring: 'ring-cyan-200/80',
    iconClass: 'text-cyan-100 drop-shadow-sm',
  },
  'watch-se': {
    Icon: Activity,
    label: 'BUFF Pulse Watch',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    ring: 'ring-orange-200/80',
    iconClass: 'text-white drop-shadow-sm',
  },
  'laptop-pro': {
    Icon: Laptop,
    label: 'BUFF NeonBook',
    gradient: 'from-indigo-950 via-slate-900 to-cyan-800',
    ring: 'ring-cyan-200/70',
    iconClass: 'text-cyan-100 drop-shadow-sm',
  },
  'audio-max': {
    Icon: Headphones,
    label: 'BUFF SonicPods',
    gradient: 'from-fuchsia-700 via-violet-800 to-slate-950',
    ring: 'ring-fuchsia-200/70',
    iconClass: 'text-fuchsia-100 drop-shadow-sm',
  },
  console: {
    Icon: Gamepad2,
    label: 'BUFF PlayDock',
    gradient: 'from-emerald-500 via-teal-700 to-slate-950',
    ring: 'ring-emerald-200/70',
    iconClass: 'text-emerald-50 drop-shadow-sm',
  },
  smartphone: {
    Icon: Smartphone,
    label: 'BUFF Titan Phone',
    gradient: 'from-sky-500 via-blue-800 to-neutral-950',
    ring: 'ring-sky-200/70',
    iconClass: 'text-sky-50 drop-shadow-sm',
  },
  'camera-pro': {
    Icon: Camera,
    label: 'BUFF FrameCam',
    gradient: 'from-zinc-900 via-stone-700 to-amber-500',
    ring: 'ring-amber-200/70',
    iconClass: 'text-amber-50 drop-shadow-sm',
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
