'use client';

import type { ReactNode } from 'react';
import {
  ChevronRight,
  Cpu,
  Headphones,
  Package,
  Search,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface StoreHeaderProps {
  cartCount: number;
  isSimpleMode: boolean;
  apiOnline: boolean | null;
  onToggleSimpleMode: () => void;
  onOpenCart: () => void;
  simpleModeLabel: string;
  simpleModeIcon: ReactNode;
}

export function StoreHeader({
  cartCount,
  isSimpleMode,
  apiOnline,
  onToggleSimpleMode,
  onOpenCart,
  simpleModeLabel,
  simpleModeIcon,
}: StoreHeaderProps) {
  return (
    <header className="commerce-card mb-10 overflow-hidden rounded-[1.75rem] border-neutral-950/10 bg-white/80 backdrop-blur-xl">
      {!isSimpleMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-950/10 bg-neutral-950 px-5 py-2 text-xs font-bold text-white md:px-7">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary-300" />
            Gemini AI ile premium teknoloji alisverisi
          </span>
          <span className="text-neutral-300">
            Hackathon demo · live/fallback agent pipeline
          </span>
        </div>
      )}

      <div className="border-b border-neutral-100 bg-gradient-to-r from-white/90 via-[#fbf9eb] to-[#c0dbff]/45 px-5 py-4 md:px-7">
        <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-950 via-cyan-800 to-primary-500 shadow-primary">
              <Cpu className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                BUFF Store
              </p>
              <h1 className="text-lg font-bold text-foreground md:text-xl">
                {isSimpleMode ? 'Sepetim' : 'Premium teknoloji vitrini'}
              </h1>
            </div>
          </div>

          {!isSimpleMode && (
            <nav
              aria-label="Ana kategoriler"
              className="hidden justify-center gap-2 xl:flex"
            >
              {['Laptops', 'Wearables', 'Audio', 'Gaming', 'Phones', 'Desk'].map(
                (item) => (
                  <a
                    key={item}
                    href="#buff-products"
                    className="rounded-full px-3 py-2 text-sm font-black text-neutral-700 transition hover:bg-white hover:text-primary-800"
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>
          )}

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {!isSimpleMode && (
              <div className="hidden min-h-touch w-64 items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-xs text-neutral-600 shadow-xs sm:flex">
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                BUFF cihaz ara...
              </div>
            )}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-foreground shadow-xs transition hover:border-primary-300 hover:bg-primary-50"
              aria-label="Sepeti ac"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onToggleSimpleMode}
              className="flex min-h-touch items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-black text-neutral-700 shadow-xs transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {simpleModeIcon}
              <span className="hidden sm:inline">{simpleModeLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {!isSimpleMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs text-neutral-500 md:px-7">
          <nav aria-label="Sayfa konumu" className="flex items-center gap-1">
            <span>BUFF Store</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="font-semibold text-foreground">AI Cart</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Package className="h-3.5 w-3.5 text-primary-600" />
              Premium teslimat · 14 gun iade
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
              Gemini {apiOnline ? 'live' : 'fallback'}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
