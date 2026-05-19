'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { ProductIcon } from './ProductIcon';
import type { CartItemData } from '@/types';

interface CartItemCardProps {
  item: CartItemData;
  isSimpleMode: boolean;
  onRemove?: () => void;
}

export function CartItemCard({
  item,
  isSimpleMode,
  onRemove,
}: CartItemCardProps) {
  if (isSimpleMode) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 py-5 last:border-0">
        <div className="flex items-center gap-4">
          <ProductIcon icon={item.icon} size="lg" />
          <h3 className="text-2xl font-semibold text-foreground">{item.name}</h3>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {item.price.toLocaleString('tr-TR')} TL
        </span>
      </div>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-start gap-4">
        <ProductIcon icon={item.icon} size="md" />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <Truck className="h-3 w-3" aria-hidden="true" />
              {item.badge ?? 'Yarin kargoda'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Orijinal urun
            </span>
          </div>

          <h3 className="text-base font-bold leading-snug text-foreground md:text-lg">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {item.feature}
          </p>

          <div className="mt-3 inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
            <button
              type="button"
              aria-label="Adet azalt"
              className="rounded-l-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              disabled
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] px-2 text-center text-sm font-semibold text-foreground">
              1
            </span>
            <button
              type="button"
              aria-label="Adet artir"
              className="rounded-r-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              disabled
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <div className="text-right">
          <p className="text-xs text-neutral-400 line-through">
            {(item.price * 1.08).toLocaleString('tr-TR', {
              maximumFractionDigits: 0,
            })}{' '}
            TL
          </p>
          <p className="text-xl font-extrabold text-primary-700">
            {item.price.toLocaleString('tr-TR')}{' '}
            <span className="text-sm font-semibold">TL</span>
          </p>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${item.name} urununu sepetten kaldir`}
            className="inline-flex min-h-touch items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-500 transition hover:border-error-200 hover:bg-error-50 hover:text-error-600 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Kaldir</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
