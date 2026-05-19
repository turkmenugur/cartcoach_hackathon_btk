'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AgentLog } from './AgentLog';
import { CartItemCard } from './CartItemCard';
import { DilemmaResolver } from './DilemmaResolver';
import { OrderSummary } from './OrderSummary';
import { RiskMetric, ROIMetric } from './MetricCard';
import type { AgentResult, CartItemData } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItemData[];
  riskScore: number;
  userProfile: string;
  monthlyRecovery: number;
  agentResult: AgentResult | null;
  analysisError: string | null;
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  riskScore,
  userProfile,
  monthlyRecovery,
  agentResult,
  analysisError,
  onClose,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-modal bg-neutral-950/35 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-[#fbf9eb] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            aria-label="Sepet paneli"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 bg-white/80 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-xs font-black uppercase text-primary-700">
                  BUFF checkout
                </p>
                <h2 className="text-2xl font-black text-foreground">
                  Sepetim ({items.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Sepeti kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-5 grid grid-cols-2 gap-3">
                <RiskMetric riskScore={riskScore} userProfile={userProfile} />
                <ROIMetric monthlyRecovery={monthlyRecovery} />
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-8 text-center text-sm font-semibold text-neutral-500">
                  Sepet bos. Urun vitrininden bir cihaz ekleyin.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={`drawer-${item.id}`}
                      item={item}
                      isSimpleMode={false}
                      onRemove={() => onRemoveItem(item.id)}
                    />
                  ))}
                </div>
              )}

              <DilemmaResolver
                items={items}
                isVisible={items.length > 1}
                verdict={agentResult?.comparison_data?.verdict}
                decisionCard={agentResult?.decision_card}
              />

              <div className="mt-5">
                <AgentLog
                  events={agentResult?.workflow_events ?? ['Telemetry captured']}
                  analysisError={analysisError}
                  agentResult={agentResult}
                />
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-white/88 p-5 backdrop-blur">
              <OrderSummary
                items={items}
                isSimpleMode={false}
                onCheckout={onCheckout}
              />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
