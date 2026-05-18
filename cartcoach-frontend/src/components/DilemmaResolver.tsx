'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { CartItemData } from '@/types';

interface DilemmaResolverProps {
  items: CartItemData[];
  isVisible: boolean;
}

export function DilemmaResolver({ items, isVisible }: DilemmaResolverProps) {
  return (
    <AnimatePresence>
      {isVisible && items.length > 1 && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Urun karsilastirma paneli"
          className="relative overflow-hidden rounded-lg border border-accent-200 bg-gradient-to-br from-accent-50 to-primary-50 p-6"
        >
          {/* Decorative gradient orb */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-200/30 blur-3xl" />

          <div className="relative z-10 mb-4 flex items-center gap-2.5">
            <div className="rounded-lg bg-accent-100 p-2">
              <Sparkles className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <h2 className="font-bold text-accent-900">
                CartCoach Kararsizlik Savar
              </h2>
              <p className="text-xs text-accent-600">
                AI destekli urun karsilastirma
              </p>
            </div>
          </div>

          <p className="relative z-10 mb-6 text-sm leading-6 text-accent-800">
            Iki guclu saat arasinda kaldiginizi fark ettik. Karari
            kolaylastirmak icin temel farklari ozetledik.
          </p>

          <div className="relative z-10 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <motion.div
                key={`dilemma-${item.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border border-neutral-200 bg-surface-primary p-4 shadow-xs transition-shadow duration-normal hover:shadow-md"
              >
                <div className="mb-2 font-semibold text-foreground">
                  {item.name}
                </div>
                <div className="mb-2 text-lg font-bold text-primary-600">
                  {item.price.toLocaleString('tr-TR')} TL
                </div>
                <div className="flex items-start gap-2 text-sm leading-5 text-neutral-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-600" />
                  <span>{item.feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
