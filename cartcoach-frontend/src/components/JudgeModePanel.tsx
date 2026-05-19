'use client';

import {
  BadgeCheck,
  Bot,
  Clock3,
  Database,
  PlugZap,
  Route,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Zap,
} from 'lucide-react';
import type { AgentResult } from '@/types';

interface JudgeModePanelProps {
  agentResult: AgentResult | null;
  apiOnline: boolean | null;
  cartTotal: number;
  idleTimeSeconds: number;
}

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString('tr-TR')} TL`;
}

function statusLabel(agentResult: AgentResult | null, apiOnline: boolean | null) {
  if (apiOnline === false) return 'API OFFLINE';
  if (!agentResult) return 'WAITING';
  return agentResult.source_status === 'live' ? 'LIVE GEMINI' : 'FALLBACK MODE';
}

export function JudgeModePanel({
  agentResult,
  apiOnline,
  cartTotal,
  idleTimeSeconds,
}: JudgeModePanelProps) {
  const status = statusLabel(agentResult, apiOnline);
  const isLive = status === 'LIVE GEMINI';
  const impact = agentResult?.business_impact;
  const guardrails = agentResult?.guardrails;
  const automation = agentResult?.automation;
  const coupon = agentResult?.coupon_details;
  const toolCalls = agentResult?.tool_calls ?? ['get_user_abandonment_history'];
  const trace = agentResult?.model_trace ?? [];
  const pipelineSteps = [
    {
      label: 'Telemetry',
      value: `${idleTimeSeconds}s idle`,
      active: true,
      icon: Clock3,
    },
    {
      label: 'Agent',
      value: agentResult
        ? `${agentResult.risk_score}/100 ${agentResult.user_profile}`
        : 'waiting',
      active: Boolean(agentResult),
      icon: Bot,
    },
    {
      label: 'Tool Calls',
      value: `${toolCalls.length} call`,
      active: toolCalls.length > 0,
      icon: Wrench,
    },
    {
      label: 'Supabase Write',
      value: agentResult ? 'event logged' : 'waiting',
      active: Boolean(agentResult),
      icon: Database,
    },
    {
      label: 'Coupon',
      value: coupon?.coupon_code ?? 'not issued',
      active: Boolean(coupon),
      icon: ShoppingBag,
    },
    {
      label: 'Automation',
      value: automation?.status ?? 'ready',
      active: automation?.status === 'queued' || automation?.status === 'processed',
      icon: Zap,
    },
  ];
  const routerDecision = agentResult
    ? agentResult.intervention_required
      ? 'Intervention path'
      : 'END: no popup'
    : 'Waiting for telemetry';

  return (
    <section
      aria-label="Juri modu karar paneli"
      className="commerce-card mb-10 overflow-hidden border-primary-200"
    >
      <div className="grid gap-4 border-b border-neutral-100 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-1 text-xs font-black uppercase text-primary-700">
            Hackathon kanit paneli
          </p>
          <h2 className="flex items-center gap-2 text-xl font-black text-foreground">
            <Bot className="h-4 w-4 text-primary-600" />
            AI pipeline ne karar verdi?
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Bu alan musteriye gosterilen magazanin parcasi degil; juriye Gemini,
            router, tool call, guardrail ve n8n akisini kanitlamak icin var.
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold ${
            isLive
              ? 'bg-success-50 text-success-700'
              : status === 'API OFFLINE'
                ? 'bg-error-50 text-error-700'
                : 'bg-warning-50 text-warning-700'
          }`}
        >
          <BadgeCheck className="h-4 w-4" />
          {status}
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-5">
        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
            <Clock3 className="h-3.5 w-3.5" />
            Telemetry
          </div>
          <p className="text-lg font-extrabold text-foreground">
            {idleTimeSeconds}s idle
          </p>
          <p className="text-xs text-neutral-500">
            Sepet: {formatCurrency(cartTotal)}
          </p>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
            <Route className="h-3.5 w-3.5" />
            Router
          </div>
          <p className="text-lg font-extrabold text-foreground">
            {agentResult?.risk_score ?? '--'}/100
          </p>
          <p className="text-xs text-neutral-500">{routerDecision}</p>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Guardrail
          </div>
          <p className="text-lg font-extrabold text-foreground">
            %{Math.round((guardrails?.max_discount_ratio ?? 0.2) * 100)}
          </p>
          <p
            className={`text-xs ${
              guardrails?.margin_protection_triggered
                ? 'font-bold text-error-600'
                : 'text-neutral-500'
            }`}
          >
            {guardrails?.margin_protection_triggered
              ? 'Marj koruma devrede'
              : 'Marj limiti asilmadi'}
          </p>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
            <BadgeCheck className="h-3.5 w-3.5" />
            Business impact
          </div>
          <p className="text-lg font-extrabold text-foreground">
            {formatCurrency(impact?.monthly_recovery_projection ?? 0)}
          </p>
          <p className="text-xs text-neutral-500">aylik projeksiyon</p>
        </div>

        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-neutral-500">
            <PlugZap className="h-3.5 w-3.5" />
            Automation
          </div>
          <p className="text-lg font-extrabold text-foreground">
            {automation?.status ?? 'ready'}
          </p>
          <p className="text-xs text-neutral-500">
            {automation?.configured ? 'Supabase outbox' : 'outbox bekliyor'}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-[#fbf9eb]/70 p-4">
        <h3 className="mb-3 text-xs font-black uppercase text-primary-700">
          Juri demo akisi
        </h3>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className={`relative rounded-xl border p-3 ${
                  step.active
                    ? 'border-primary-200 bg-white text-foreground'
                    : 'border-neutral-100 bg-white/60 text-neutral-400'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      step.active
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[10px] font-black text-neutral-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-xs font-black uppercase">{step.label}</p>
                <p className="mt-1 truncate text-xs font-semibold text-neutral-500">
                  {step.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 border-t border-neutral-100 p-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-neutral-500">
            <Wrench className="h-4 w-4" />
            Tool calls
          </h3>
          <div className="flex flex-wrap gap-2">
            {toolCalls.map((tool, index) => (
              <span
                key={`${tool}-${index}`}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-neutral-500">
            <Bot className="h-4 w-4" />
            Model trace
          </h3>
          <div className="grid gap-2">
            {(trace.length > 0
              ? trace
              : [
                  {
                    agent: 'Analyst',
                    status: 'fallback' as const,
                    latency_ms: 0,
                    detail: 'Telemetry bekleniyor.',
                  },
                ]
            ).map((item) => (
              <div
                key={`${item.agent}-${item.status}-${item.latency_ms}`}
                className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2 text-xs"
              >
                <span className="font-bold text-foreground">{item.agent}</span>
                <span className="text-neutral-500">{item.latency_ms}ms</span>
                <span
                  className={
                    item.status === 'live'
                      ? 'font-bold text-success-700'
                      : 'font-bold text-warning-700'
                  }
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
