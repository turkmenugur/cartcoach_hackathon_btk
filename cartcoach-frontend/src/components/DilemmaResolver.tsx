'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { GitCompare, Sparkles } from 'lucide-react';
import { ProductIcon } from './ProductIcon';
import type { CartItemData } from '@/types';

interface DilemmaResolverProps {
  items: CartItemData[];
  isVisible: boolean;
  verdict?: string;
}

export function DilemmaResolver({
  items,
  isVisible,
  verdict,
}: DilemmaResolverProps) {
  return (
    <AnimatePresence>
      {isVisible && items.length > 1 && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Urun karsilastirma paneli"
          className="commerce-card relative overflow-hidden border-primary-100 bg-gradient-to-br from-white via-primary-50/30 to-fuchsia-50/30 p-6"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-200/25 blur-3xl" />

          <div className="relative z-10 mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary">
              <GitCompare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">
                BUFF AI Kararsizlik Savar
              </h2>
              <p className="flex items-center gap-1 text-xs text-primary-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI destekli urun karsilastirma
              </p>
            </div>
          </div>

          <p className="relative z-10 mb-6 rounded-xl border border-primary-100/80 bg-white/80 p-4 text-sm leading-6 text-neutral-700 backdrop-blur-sm">
            {verdict ??
              'Iki premium teknoloji urunu arasinda kaldiginizi fark ettik. Karari kolaylastirmak icin temel farklari ozetledik.'}
          </p>

          <div className="relative z-10 grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
              <motion.div
                key={`dilemma-${item.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <ProductIcon icon={item.icon} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">{item.name}</div>
                  <p className="mt-1 text-lg font-extrabold text-primary-700">
                    {item.price.toLocaleString('tr-TR')} TL
                  </p>
                  <p className="mt-2 text-sm leading-5 text-neutral-600">
                    {item.feature}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
