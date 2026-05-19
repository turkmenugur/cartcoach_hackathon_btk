'use client';

import { Activity } from 'lucide-react';
import type { AgentResult } from '@/types';

interface AgentLogProps {
  events: string[];
  analysisError: string | null;
  agentResult?: AgentResult | null;
}

export function AgentLog({ events, analysisError, agentResult }: AgentLogProps) {
  const sourceStatus = agentResult?.source_status ?? 'fallback';

  return (
    <div className="commerce-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Activity className="h-4 w-4 text-primary-600" />
          Agent Karar Gunlugu
        </div>
        {agentResult && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
              sourceStatus === 'live'
                ? 'bg-success-50 text-success-700'
                : 'bg-warning-50 text-warning-700'
            }`}
          >
            {sourceStatus === 'live' ? 'LIVE GEMINI' : 'FALLBACK'}
          </span>
        )}
      </div>

      <div className="space-y-2 text-xs text-neutral-600" role="log" aria-label="Agent karar gunlugu">
        {events.map((event, index) => (
          <div
            key={`${event}-${index}`}
            className="flex gap-2 rounded-md bg-neutral-50 px-3 py-2 transition-colors duration-fast"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span>{event}</span>
          </div>
        ))}
      </div>

      {analysisError && (
        <p className="mt-3 rounded-md bg-warning-50 px-3 py-2 text-xs text-warning-700">
          Backend baglantisi yoksa demo fallback modu kullanilir. Son hata:{' '}
          {analysisError}
        </p>
      )}
    </div>
  );
}
