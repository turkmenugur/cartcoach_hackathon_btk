'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { CartItemData } from '@/types';

interface CartItemCardProps {
  item: CartItemData;
  isSimpleMode: boolean;
}

export function CartItemCard({ item, isSimpleMode }: CartItemCardProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {!isSimpleMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-primary-100 bg-primary-50 text-sm font-bold text-primary-700"
          >
            {item.image}
          </motion.div>
        )}
        <div>
          <h3
            className={`font-semibold text-foreground ${
              isSimpleMode ? 'text-2xl' : 'text-lg'
            }`}
          >
            {item.name}
          </h3>
          {!isSimpleMode && (
            <p className="mt-1 text-sm text-neutral-500">Hemen teslim</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <span
          className={`font-bold text-foreground ${
            isSimpleMode ? 'text-2xl' : 'text-xl'
          }`}
        >
          {item.price.toLocaleString('tr-TR')} TL
        </span>
        {!isSimpleMode && (
          <button
            type="button"
            aria-label={`${item.name} urununu sepetten kaldir`}
            className="min-h-touch rounded-md p-2 text-error-400 transition-colors duration-fast hover:bg-error-50 hover:text-error-600 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
