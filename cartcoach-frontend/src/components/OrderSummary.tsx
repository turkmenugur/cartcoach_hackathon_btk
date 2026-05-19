'use client';

import { CreditCard, Lock, Truck } from 'lucide-react';
import type { CartItemData } from '@/types';

interface OrderSummaryProps {
  items: CartItemData[];
  isSimpleMode: boolean;
  onCheckout?: () => void;
}

const SHIPPING_COST = 49.9;

export function OrderSummary({
  items,
  isSimpleMode,
  onCheckout,
}: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + (items.length > 0 ? SHIPPING_COST : 0);

  return (
    <div
      className={
        isSimpleMode
          ? 'rounded-2xl border-2 border-neutral-300 bg-white p-6'
          : 'commerce-card p-6'
      }
    >
      {!isSimpleMode && (
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-500">
          <CreditCard className="h-4 w-4 text-primary-600" />
          Siparis Ozeti
        </h2>
      )}

      {!isSimpleMode && items.length > 0 && (
        <ul className="mb-4 space-y-2 border-b border-neutral-100 pb-4">
          {items.map((item) => (
            <li
              key={`summary-${item.id}`}
              className="flex justify-between gap-2 text-sm text-neutral-600"
            >
              <span className="line-clamp-1">{item.name}</span>
              <span className="shrink-0 font-medium text-foreground">
                {item.price.toLocaleString('tr-TR')} TL
              </span>
            </li>
          ))}
        </ul>
      )}

      {!isSimpleMode && (
        <>
          <div className="mb-2 flex justify-between text-sm text-neutral-600">
            <span>Ara toplam</span>
            <span>{subtotal.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="mb-1 flex justify-between text-sm text-neutral-600">
            <span className="inline-flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-primary-600" />
              Kargo
            </span>
            <span>
              {items.length > 0
                ? `${SHIPPING_COST.toLocaleString('tr-TR')} TL`
                : '—'}
            </span>
          </div>
        </>
      )}

      <div
        className={`flex justify-between font-bold ${
          isSimpleMode
            ? 'mb-8 text-3xl text-foreground'
            : 'mb-5 border-t border-neutral-100 pt-4 text-xl text-foreground'
        }`}
      >
        <span>{isSimpleMode ? 'Toplam' : 'Odenecek tutar'}</span>
        <span className="text-primary-700">
          {total.toLocaleString('tr-TR')} TL
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={items.length === 0}
        className={`flex w-full min-h-touch items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isSimpleMode
            ? 'rounded-2xl bg-neutral-900 py-6 text-2xl text-white shadow-lg hover:bg-black'
            : 'rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-4 text-white shadow-primary hover:from-primary-700 hover:to-primary-600 hover:shadow-primary-lg'
        }`}
      >
        {!isSimpleMode && <Lock className="h-4 w-4" aria-hidden="true" />}
        {isSimpleMode ? 'ODE' : 'Guvenli Odeme'}
      </button>

      {!isSimpleMode && (
        <p className="mt-3 text-center text-xs text-neutral-400">
          256-bit SSL · Kart bilgileriniz korunur
        </p>
      )}
    </div>
  );
}
