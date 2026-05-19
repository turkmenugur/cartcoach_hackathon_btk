'use client';

import { motion } from 'framer-motion';
import { BrainCircuit, Gift, GitCompare, Shuffle, Sparkles } from 'lucide-react';
import type { AgentResult } from '@/types';

interface SmartCommerceLayerProps {
  agentResult: AgentResult | null;
}

function percent(value?: number): string {
  return `%${Math.round((value ?? 0) * 100)}`;
}

export function SmartCommerceLayer({ agentResult }: SmartCommerceLayerProps) {
  const twin = agentResult?.shopping_twin;
  const decision = agentResult?.decision_card;
  const reranking = agentResult?.store_reranking;
  const bundle = agentResult?.ai_bundle_builder;

  if (!agentResult) {
    return (
      <section className="commerce-card mb-10 grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase text-primary-700">
            BUFF intelligence layer
          </p>
          <h2 className="mt-1 text-2xl font-black text-foreground">
            AI Shopping Twin beklemede.
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Bir demo senaryosu calistiginda magaza kullanici hafizasina gore
            yeniden siralanir, karar karti ve bundle onerisi uretilir.
          </p>
        </div>
        {['Shopping Twin', 'Re-Ranking', 'Decision Card'].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-sm font-bold text-neutral-400"
          >
            {item}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="mb-10 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="commerce-card border-primary-200 p-5"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-primary-700">
              AI Shopping Twin
            </p>
            <h2 className="text-xl font-black text-foreground">
              {twin?.intent_profile ?? agentResult.user_profile}
            </h2>
          </div>
        </div>
        <p className="text-sm leading-6 text-neutral-600">
          {twin?.memory_summary ??
            'Kullanici davranisi ve sepet sinyalleriyle canli profil olusturuldu.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(twin?.behavior_tags ?? [agentResult.user_profile]).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-black text-primary-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-neutral-600">
          <span>Kupon egilimi: {percent(twin?.coupon_affinity)}</span>
          <span>Fiyat hassasiyeti: {percent(twin?.price_sensitivity)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="commerce-card p-5"
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
          <Shuffle className="h-4 w-4" />
          Canli re-ranking
        </div>
        <p className="text-lg font-black text-foreground">
          {reranking?.strategy_label ?? 'Live Store Re-Ranking'}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {reranking?.reason ?? 'Urun sirasi kullanici niyetine gore degisti.'}
        </p>
        <p className="mt-4 rounded-xl bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-600">
          Top pick: {reranking?.ranked_product_ids?.[0] ?? 'hesaplanıyor'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="commerce-card p-5"
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
          <GitCompare className="h-4 w-4" />
          Kararsizlik Savar 2.0
        </div>
        <p className="text-lg font-black text-foreground">
          {decision?.recommended_name ?? 'Karar karti hazir'}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {decision?.why ?? 'Iki urun arasindaki karar riski analiz edildi.'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold">
          <span className="rounded-xl bg-success-50 px-3 py-2 text-success-700">
            FP {decision?.price_performance_score ?? 82}/100
          </span>
          <span className="rounded-xl bg-warning-50 px-3 py-2 text-warning-700">
            Pismanlik {decision?.regret_risk ?? 24}/100
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="commerce-card p-5"
      >
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-primary-700">
          <Gift className="h-4 w-4" />
          AI Bundle Builder
        </div>
        <p className="text-lg font-black text-foreground">
          {bundle?.bundle_name ?? 'Smart Add-on Kit'}
        </p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {bundle?.recommendation ?? 'Sepete uygun tamamlayici urun seti hazir.'}
        </p>
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-950 px-3 py-2 text-xs font-black text-white">
          <Sparkles className="h-3.5 w-3.5" />
          +{Math.round(bundle?.projected_revenue_lift ?? 0).toLocaleString('tr-TR')} TL lift
        </p>
      </motion.div>
    </section>
  );
}
