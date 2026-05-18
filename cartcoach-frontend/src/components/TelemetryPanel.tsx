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
      className="fixed bottom-4 left-4 right-4 z-telemetry rounded-lg border border-neutral-800 bg-surface-overlay-heavy p-4 font-mono text-xs text-white shadow-2xl backdrop-blur-md sm:right-auto sm:min-w-72"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)' }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isRiskHigh ? 'bg-error-400' : 'bg-success-500'}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isRiskHigh ? 'bg-error-500' : 'bg-success-500'}`} />
        </span>
        <span className="font-bold tracking-wider text-primary-300">
          TELEMETRY SENSOR
        </span>
      </div>

      <p className="text-neutral-300">
        Kullanici Durumu:{' '}
        <span className="font-semibold text-white">
          {idleTimeSeconds > 0 ? `IDLE (${idleTimeSeconds}s)` : 'ACTIVE'}
        </span>
      </p>

      <p className="text-neutral-300">
        Risk:{' '}
        {isRiskHigh ? (
          <span className="font-bold text-error-400">
            YUKSEK ({riskScore}/100)
          </span>
        ) : (
          <span className="font-semibold text-success-500">DUSUK</span>
        )}
      </p>

      {isAnalyzing && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-primary-300">
          <Loader2 className="h-3 w-3 animate-spin" />
          Agent analizi calisiyor...
        </p>
      )}
    </div>
  );
}
