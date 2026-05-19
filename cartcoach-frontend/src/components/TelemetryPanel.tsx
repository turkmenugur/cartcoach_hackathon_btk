'use client';

import { Loader2 } from 'lucide-react';

interface TelemetryPanelProps {
  idleTimeSeconds: number;
  isRiskHigh: boolean;
  riskScore: number;
  isAnalyzing: boolean;
}

export function TelemetryPanel({
  idleTimeSeconds,
  isRiskHigh,
  riskScore,
  isAnalyzing,
}: TelemetryPanelProps) {
  return (
    <div
      role="status"
      aria-label="Telemetri verisi"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-telemetry rounded-full border border-neutral-950/10 bg-white/86 px-4 py-3 font-mono text-[11px] text-neutral-800 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isRiskHigh ? 'bg-error-400' : 'bg-success-500'}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isRiskHigh ? 'bg-error-500' : 'bg-success-500'}`} />
        </span>
        <span className="font-bold tracking-wider text-primary-800">
          TELEMETRY SENSOR
        </span>
        <span className="hidden text-neutral-400 sm:inline">/</span>
        <span className="hidden text-neutral-600 sm:inline">
          {idleTimeSeconds > 0 ? `IDLE (${idleTimeSeconds}s)` : 'ACTIVE'}
        </span>
        {isRiskHigh ? (
          <span className="font-bold text-error-400">
            RISK {riskScore}
          </span>
        ) : (
          <span className="font-semibold text-success-600">LOW</span>
        )}
      </div>

      {isAnalyzing && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-primary-300">
          <Loader2 className="h-3 w-3 animate-spin" />
          Agent analizi calisiyor...
        </p>
      )}
    </div>
  );
}
