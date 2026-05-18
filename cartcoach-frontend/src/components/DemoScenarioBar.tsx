'use client';

import { RefreshCw } from 'lucide-react';
import type { DemoScenario } from '@/types';

interface DemoScenarioBarProps {
  onRunScenario: (scenario: DemoScenario) => void;
  onReset: () => void;
}

export function DemoScenarioBar({ onRunScenario, onReset }: DemoScenarioBarProps) {
  return (
    <section
      aria-label="Demo senaryolari"
      className="mb-6 grid gap-3 rounded-lg border border-neutral-200 bg-surface-primary p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center"
    >
      <div>
        <h2 className="text-sm font-bold text-foreground">
          Juri demo senaryolari
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Beklemeden farkli agent yollarini gostermek icin bir senaryo secin.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRunScenario('price-sensitive')}
          className="min-h-touch rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-primary transition-all duration-fast hover:bg-primary-700 hover:shadow-primary-lg active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Fiyat riski
        </button>
        <button
          type="button"
          onClick={() => onRunScenario('dilemma')}
          className="min-h-touch rounded-lg border border-neutral-200 bg-surface-primary px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-fast hover:bg-neutral-50 hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Kararsizlik
        </button>
        <button
          type="button"
          onClick={() => onRunScenario('low-risk')}
          className="min-h-touch rounded-lg border border-neutral-200 bg-surface-primary px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-fast hover:bg-neutral-50 hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Dusuk risk
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-touch items-center gap-2 rounded-lg border border-neutral-200 bg-surface-primary px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-fast hover:bg-neutral-50 hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Sifirla
        </button>
      </div>
    </section>
  );
}
