'use client';

import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tag, Scale } from 'lucide-react';
import type { AgentResult } from '@/types';

interface AgentPopupProps {
  isVisible: boolean;
  agentResult: AgentResult | null;
  onDismiss: () => void;
  onAccept: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { scale: 0.95, y: 18, opacity: 0 },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: {
    scale: 0.95,
    y: 18,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function AgentPopup({
  isVisible,
  agentResult,
  onDismiss,
  onAccept,
}: AgentPopupProps) {
  /* ── Escape key to close (A11y) ───────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss],
  );

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleKeyDown]);

  /* ── Trap focus inside modal ──────────────────────────────── */
  useEffect(() => {
    if (!isVisible) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-modal flex items-center justify-center bg-surface-overlay p-4 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
          onClick={onDismiss}
        >
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cartcoach-popup-title"
            aria-describedby="cartcoach-popup-message"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-primary-100 bg-surface-primary p-6 shadow-2xl"
          >
            {/* ── Header ──────────────────────────────────────── */}
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 p-3 shadow-xs">
                <Tag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2
                  id="cartcoach-popup-title"
                  className="text-xl font-bold text-foreground"
                >
                  CartCoach Ozel Teklif
                </h2>
                <p className="text-sm font-medium text-primary-600">
                  Gemini destekli satis asistani
                </p>
              </div>
            </div>

            {/* ── Agent Message ────────────────────────────────── */}
            <p
              id="cartcoach-popup-message"
              className="mb-5 text-lg leading-8 text-neutral-700"
            >
              {agentResult?.final_message ??
                'CartCoach sizin icin en uygun teklifi hazirliyor.'}
            </p>

            {/* ── Coupon Badge ─────────────────────────────────── */}
            {agentResult?.coupon_details && (
              <div className="mb-5 rounded-lg border border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary-600 px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-white">
                      {agentResult.coupon_details.coupon_code}
                    </span>
                  </div>
                  <span className="font-bold text-primary-800">
                    {agentResult.coupon_details.discount_amount.toLocaleString(
                      'tr-TR',
                    )}{' '}
                    TL indirim
                  </span>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  {agentResult.coupon_details.expires_in_minutes} dakika gecerli
                </p>
              </div>
            )}

            {/* ── Comparison Verdict ──────────────────────────── */}
            {agentResult?.comparison_data?.verdict && (
              <div className="mb-6 flex gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                <Scale className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                <span>{agentResult.comparison_data.verdict}</span>
              </div>
            )}

            {/* ── Actions ─────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Teklifi kapat ve daha sonra degerlendir"
                className="min-h-touch flex-1 rounded-lg border border-neutral-200 px-6 py-3 font-bold text-neutral-600 transition-all duration-fast hover:bg-neutral-50 hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Daha Sonra
              </button>
              <button
                type="button"
                onClick={onAccept}
                aria-label="Teklifi kabul et ve sepeti tamamla"
                className="min-h-touch flex-1 rounded-lg bg-primary-600 px-6 py-3 font-bold text-white shadow-primary transition-all duration-fast hover:bg-primary-700 hover:shadow-primary-lg active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Teklifi Kabul Et
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
