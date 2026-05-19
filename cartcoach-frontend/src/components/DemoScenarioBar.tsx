'use client';

import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import type { DemoScenario } from '@/types';

interface DemoScenarioBarProps {
  onRunScenario: (scenario: DemoScenario) => void | Promise<void>;
  onReset: () => void;
  isLoading?: boolean;
  activeScenario?: DemoScenario | null;
}

const SCENARIOS: Array<{
  id: DemoScenario;
  label: string;
  variant: 'primary' | 'outline';
}> = [
  { id: 'price-sensitive', label: 'Fiyat riski', variant: 'primary' },
  { id: 'dilemma', label: 'Kararsizlik', variant: 'outline' },
  { id: 'margin-guardrail', label: 'Marj koruma', variant: 'outline' },
  { id: 'low-risk', label: 'Dusuk risk', variant: 'outline' },
];

export function DemoScenarioBar({
  onRunScenario,
  onReset,
  isLoading = false,
  activeScenario = null,
}: DemoScenarioBarProps) {
  return (
    <section
      aria-label="Demo senaryolari"
      className="commerce-card mb-5 grid gap-4 border-dashed border-primary-200 bg-gradient-to-r from-white to-primary-50/40 p-4 lg:grid-cols-[1fr_auto] lg:items-center"
    >
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Sparkles className="h-4 w-4 text-primary-600" />
          Hackathon demo kontrolleri
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Bu butonlar normal kullanici akisi icin degil; juriye farkli AI
          kararlarini hizli gostermek icin.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map(({ id, label, variant }) => {
          const isActive = activeScenario === id;
          const isPrimary = variant === 'primary';

          return (
            <button
              key={id}
              type="button"
              disabled={isLoading}
              onClick={() => void onRunScenario(id)}
              className={`inline-flex min-h-touch items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 ${
                isPrimary
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary hover:from-primary-700 hover:to-primary-600'
                  : 'border border-neutral-200 bg-white text-foreground hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              {isActive && isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="inline-flex min-h-touch items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-neutral-50 disabled:opacity-70"
        >
          <RefreshCw className="h-4 w-4" />
          Sifirla
        </button>
      </div>
    </section>
  );
}
