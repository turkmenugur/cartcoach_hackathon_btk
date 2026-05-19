'use client';

import type { ReactNode } from 'react';
import {
  ChevronRight,
  Headphones,
  Package,
  Search,
  ShoppingBag,
  Store,
} from 'lucide-react';

interface StoreHeaderProps {
  cartCount: number;
  isSimpleMode: boolean;
  apiOnline: boolean | null;
  onToggleSimpleMode: () => void;
  simpleModeLabel: string;
  simpleModeIcon: ReactNode;
}

export function StoreHeader({
  cartCount,
  isSimpleMode,
  apiOnline,
  onToggleSimpleMode,
  simpleModeLabel,
  simpleModeIcon,
}: StoreHeaderProps) {
  return (
    <header className="commerce-card mb-6 overflow-hidden">
      <div className="border-b border-neutral-100 bg-gradient-to-r from-white via-white to-primary-50/40 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary">
              <Store className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                TechZone Market
              </p>
              <h1 className="text-lg font-bold text-foreground md:text-xl">
                {isSimpleMode ? 'Sepetim' : 'Sepetim · Odeme'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSimpleMode && (
              <div className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600 sm:flex">
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Urun ara...
              </div>
            )}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-foreground shadow-xs">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onToggleSimpleMode}
              className="flex min-h-touch items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-xs transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {simpleModeIcon}
              <span className="hidden sm:inline">{simpleModeLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {!isSimpleMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs text-neutral-500 md:px-6">
          <nav aria-label="Sayfa konumu" className="flex items-center gap-1">
            <span>Ana Sayfa</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="font-semibold text-foreground">Sepet</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-primary-600" />
              Ucretsiz iade · 14 gun
            </span>
            <span className="inline-flex items-center gap-1">
              <Headphones className="h-3.5 w-3.5 text-primary-600" />
              7/24 destek
            </span>
            {apiOnline !== null && (
              <span
                className={`rounded-full px-2 py-0.5 font-semibold ${
                  apiOnline
                    ? 'bg-success-50 text-success-700'
                    : 'bg-warning-50 text-warning-700'
                }`}
              >
                CartCoach {apiOnline ? 'aktif' : 'fallback'}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
