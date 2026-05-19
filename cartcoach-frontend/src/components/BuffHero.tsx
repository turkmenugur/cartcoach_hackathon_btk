'use client';

import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Bot,
  ChevronRight,
  Cpu,
  RadioTower,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

interface BuffHeroProps {
  apiOnline: boolean | null;
  onRunAiDemo: () => void | Promise<void>;
  onScrollToProducts: () => void;
}

export function BuffHero({
  apiOnline,
  onRunAiDemo,
  onScrollToProducts,
}: BuffHeroProps) {
  return (
    <section className="buff-hero mb-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 text-white shadow-2xl">
      <div className="buff-grid" aria-hidden="true" />
      <div className="buff-scanline" aria-hidden="true" />

      <div className="relative grid min-h-[640px] gap-12 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_580px] lg:items-center xl:px-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-950/10 bg-white/55 px-3 py-1.5 text-xs font-bold text-neutral-800 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tech that fits the moment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-balance text-6xl font-black leading-[0.92] text-neutral-950 md:text-8xl xl:text-9xl"
          >
            Premium tech, smarter checkout.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700 md:text-xl"
          >
            BUFF Store teknoloji urunlerini kesfettiginiz bir e-commerce
            platformu. Gemini AI ise sepet terk riskini anlayip dogru anda
            karsilastirma, kupon veya bundle onerisi sunan akilli satis katmani.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() => void onRunAiDemo()}
              className="group inline-flex min-h-touch items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(17,19,24,0.20)] transition hover:bg-primary-800 active:scale-[0.98]"
            >
              <Bot className="h-4 w-4" />
              AI sepet riskini calistir
              <Zap className="h-4 w-4 transition group-hover:rotate-12" />
            </button>
            <button
              type="button"
              onClick={onScrollToProducts}
              className="inline-flex min-h-touch items-center gap-2 rounded-full border border-neutral-950/10 bg-white/60 px-5 py-3 text-sm font-bold text-neutral-900 backdrop-blur transition hover:border-primary-300 hover:bg-white active:scale-[0.98]"
            >
              Urunleri kesfet
            </button>
          </motion.div>

          <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ['%20', 'marj koruma limiti'],
              ['3 ajan', 'Analyst, Strategist, Synthesizer'],
              ['n8n', 'webhook otomasyon hazir'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-neutral-950/10 bg-white/58 p-4 backdrop-blur"
              >
                <p className="text-2xl font-black text-neutral-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-neutral-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          className="buff-device relative mx-auto w-full max-w-[580px]"
        >
          <div className="relative overflow-hidden rounded-[2.25rem] border border-neutral-950/10 bg-white/76 p-5 shadow-[0_35px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-primary-800">
                  Find your fit
                </p>
                <h2 className="text-2xl font-black text-neutral-950">
                  Shop by moment
                </h2>
              </div>
              <button
                type="button"
                onClick={onScrollToProducts}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-primary-800"
                aria-label="Urunlere git"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-full border border-neutral-950/10 bg-[#fbf9eb] px-4 py-3 text-sm font-bold text-neutral-600">
              <Search className="h-4 w-4 text-primary-700" />
              Search by setup, mood, budget or device
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="overflow-hidden rounded-[1.6rem] bg-[#c0dbff]">
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80"
                  alt="Premium laptop on a clean desk"
                  className="editorial-product-image h-[420px] w-full object-cover"
                />
              </div>

              <div className="grid gap-4">
                {[
                  ['Creator desk', 'Laptop + audio + light'],
                  ['Travel light', 'Mini phone + buds'],
                  ['Gaming night', 'Dock + controller'],
                ].map(([title, desc]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={onScrollToProducts}
                    className="rounded-[1.35rem] border border-neutral-950/10 bg-[#fbf9eb] p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-300 hover:bg-white"
                  >
                    <p className="text-lg font-black text-neutral-950">
                      {title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-neutral-500">
                      {desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-neutral-950/10 bg-neutral-950 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-200">
                    BUFF AI Coach
                  </p>
                  <p className="text-sm text-neutral-400">live decision layer</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                    apiOnline
                      ? 'bg-emerald-400/15 text-emerald-200'
                      : 'bg-amber-400/15 text-amber-200'
                  }`}
                >
                  {apiOnline ? 'GEMINI LIVE' : 'FALLBACK READY'}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  {
                    icon: RadioTower,
                    label: 'Telemetry',
                    value: 'idle + cart value',
                  },
                  {
                    icon: Cpu,
                    label: 'Router',
                    value: 'risk > 60 ise agent pipeline',
                  },
                  {
                    icon: ShieldCheck,
                    label: 'Guardrail',
                    value: 'teklif marji asamaz',
                  },
                  {
                    icon: BadgeCheck,
                    label: 'Automation',
                    value: 'n8n webhook ile CRM/log akisi',
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.06] p-3 transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.08]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/12 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{label}</p>
                      <p className="text-xs text-neutral-400">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
