'use client';

import type { CartItemData } from '@/types';

interface OrderSummaryProps {
  items: CartItemData[];
  isSimpleMode: boolean;
}

const SHIPPING_COST = 49.9;

export function OrderSummary({ items, isSimpleMode }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + SHIPPING_COST;

  return (
    <div
      className={`border bg-surface-primary p-6 ${
        isSimpleMode
          ? 'rounded-lg border-2 border-neutral-300 shadow-none'
          : 'rounded-lg border-neutral-200 shadow-sm'
      }`}
    >
      {!isSimpleMode && (
        <>
          <div className="mb-2 flex justify-between text-neutral-600">
            <span>Ara Toplam:</span>
            <span>{subtotal.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="mb-4 flex justify-between text-neutral-600">
            <span>Kargo:</span>
            <span>{SHIPPING_COST.toLocaleString('tr-TR')} TL</span>
          </div>
        </>
      )}

      <div
        className={`flex justify-between font-bold ${
          isSimpleMode
            ? 'mb-8 text-3xl text-foreground'
            : 'mb-6 border-t border-neutral-200 pt-4 text-xl text-foreground'
        }`}
      >
        <span>{isSimpleMode ? 'Toplam:' : 'Genel Toplam:'}</span>
        <span>{total.toLocaleString('tr-TR')} TL</span>
      </div>

      <button
        type="button"
        aria-label={`Siparisi tamamla — toplam ${total.toLocaleString('tr-TR')} TL`}
        className={`w-full font-bold transition-all active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          isSimpleMode
            ? 'min-h-touch rounded-lg bg-neutral-900 py-6 text-2xl text-white shadow-lg hover:bg-black'
            : 'min-h-touch rounded-lg bg-primary-600 py-4 text-white shadow-primary hover:bg-primary-700 hover:shadow-primary-lg'
        }`}
      >
        {isSimpleMode ? 'ODE' : 'Siparisi Tamamla'}
      </button>
    </div>
  );
}
