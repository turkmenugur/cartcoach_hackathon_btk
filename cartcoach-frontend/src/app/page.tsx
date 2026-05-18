'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useTracker } from '@/hooks/useTracker';
import type { AgentResult, CartItemData, DemoScenario } from '@/types';
import {
  AgentLog,
  AgentPopup,
  CartItemCard,
  DemoScenarioBar,
  DilemmaResolver,
  OrderSummary,
  RiskMetric,
  ROIMetric,
  TelemetryPanel,
} from '@/components';

/* ============================================================
   Static Data & Configuration
   ============================================================ */

const API_URL =
  process.env.NEXT_PUBLIC_CARTCOACH_API_URL ?? 'http://127.0.0.1:8000';

const CART_ITEMS: CartItemData[] = [
  {
    id: 'p123',
    name: 'Apple Watch Series 9',
    price: 14999,
    image: 'AW',
    feature: 'Gelismis saglik sensorleri ve her zaman acik ekran',
  },
  {
    id: 'p124',
    name: 'Apple Watch SE (2. Nesil)',
    price: 9499,
    image: 'SE',
    feature: 'Fiyat/performans odakli temel akilli saat deneyimi',
  },
];

const fallbackAgentResult: AgentResult = {
  risk_score: 85,
  user_profile: 'kararsiz',
  intervention_required: true,
  final_message:
    'Sepetinizdeki iki saat arasinda kaldiginizi fark ettik. CART15 kodu 15 dakika boyunca size ozel indirim saglar. Hazirsaniz sepetinizi birlikte tamamlayalim.',
  coupon_details: {
    coupon_code: 'CART15',
    discount_ratio: 0.15,
    discount_amount: 3599.7,
    new_total: 20398.3,
    expires_in_minutes: 15,
    margin_protection_triggered: false,
  },
  comparison_data: {
    comparison_found: true,
    verdict:
      'Series 9 gelismis ekran ve sensorler icin, SE ise fiyat/performans icin daha uygundur.',
  },
  workflow_events: [
    'Telemetry captured',
    'Analyst fallback risk: 85/100 (kararsiz)',
    'Router selected intervention path',
    'Strategist selected intervention + coupon CART15 + comparison',
    'Synthesizer prepared popup message',
  ],
};

const scenarioResults: Record<DemoScenario, AgentResult> = {
  'price-sensitive': {
    risk_score: 91,
    user_profile: 'fiyat duyarli',
    intervention_required: true,
    final_message:
      'Sepetiniz icin CART15 kodunu hazirladik. Bu teklif 15 dakika gecerli ve toplam tutarda 3.674 TL avantaj saglar. Hazirsaniz siparisi birlikte tamamlayalim.',
    coupon_details: {
      coupon_code: 'CART15',
      discount_ratio: 0.15,
      discount_amount: 3674.7,
      new_total: 20823.3,
      expires_in_minutes: 15,
      margin_protection_triggered: false,
    },
    comparison_data: null,
    workflow_events: [
      'Telemetry captured',
      'Analyst calculated risk: 91/100 (fiyat duyarli)',
      'Router selected intervention path',
      'Strategist selected intervention + coupon CART15',
      'Synthesizer prepared popup message',
    ],
  },
  dilemma: fallbackAgentResult,
  'low-risk': {
    risk_score: 28,
    user_profile: 'odaklanmis',
    intervention_required: false,
    final_message:
      'Risk dusuk oldugu icin CartCoach kullaniciyi rahatsiz etmedi.',
    coupon_details: null,
    comparison_data: null,
    workflow_events: [
      'Telemetry captured',
      'Analyst calculated risk: 28/100 (odaklanmis)',
      'Router ended workflow: no intervention',
    ],
  },
};

/* ============================================================
   Page Component
   ============================================================ */

export default function CartPage() {
  /* ── State ──────────────────────────────────────────────── */
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [forcePopup, setForcePopup] = useState(false);

  const { isRiskHigh, idleTimeSeconds, mouseMovements } = useTracker(5);

  /* ── Derived values ─────────────────────────────────────── */
  const cart = useMemo(() => CART_ITEMS, []);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const recoveredRevenue = agentResult?.coupon_details
    ? Math.round(agentResult.coupon_details.new_total)
    : agentResult && !agentResult.intervention_required
      ? 0
      : Math.round(total * 0.15);

  const projectedMonthlyRecovery = recoveredRevenue * 42;

  const shouldShowPopup =
    (isRiskHigh || forcePopup) &&
    !isSimpleMode &&
    !isDismissed &&
    (agentResult?.intervention_required ?? true);

  const riskScore =
    agentResult?.risk_score ?? (isRiskHigh ? 85 : 24);
  const userProfile =
    agentResult?.user_profile ?? (isRiskHigh ? 'beklemede' : 'aktif');

  /* ── Handlers ───────────────────────────────────────────── */
  const runDemoScenario = (scenario: DemoScenario) => {
    setAgentResult(scenarioResults[scenario]);
    setAnalysisError(null);
    setIsDismissed(false);
    setForcePopup(scenarioResults[scenario].intervention_required);
  };

  const resetDemo = () => {
    setAgentResult(null);
    setAnalysisError(null);
    setIsDismissed(false);
    setForcePopup(false);
  };

  /* ── Agent API call on risk detection ───────────────────── */
  useEffect(() => {
    if (!isRiskHigh || agentResult || isAnalyzing) return;

    const analyzeCart = async () => {
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        const response = await fetch(`${API_URL}/analyze-cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_data: {
              user_id: 'usr_9988',
              idle_time_seconds: Math.max(idleTimeSeconds, 95),
              cart_items: cart.map(({ id, name, price }) => ({
                id,
                name,
                price,
              })),
              cart_total: total,
              mouse_movements: mouseMovements < 5 ? 'low' : 'active',
              scroll_depth: 72,
              exit_intent: false,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Agent API yanit vermedi');
        }

        const result = (await response.json()) as AgentResult;
        setAgentResult(result);
      } catch (error) {
        setAgentResult(fallbackAgentResult);
        setAnalysisError(
          error instanceof Error
            ? error.message
            : 'Agent API gecici olarak kullanilamiyor',
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

    void analyzeCart();
  }, [
    agentResult,
    cart,
    idleTimeSeconds,
    isAnalyzing,
    isRiskHigh,
    mouseMovements,
    total,
  ]);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <motion.main
      id="main-content"
      initial={false}
      animate={{
        backgroundColor: isSimpleMode ? '#f8fafc' : '#f9fafb',
        color: isSimpleMode ? '#0f172a' : '#111827',
      }}
      className="min-h-screen p-6 font-sans transition-colors duration-slower md:p-8"
    >
      <div className="mx-auto max-w-container">
        {/* ── Header ────────────────────────────────────────── */}
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
              {!isSimpleMode && (
                <ShoppingCart className="h-6 w-6 text-primary-600" />
              )}
              {isSimpleMode ? 'Sepet' : 'CartCoach Demo Checkout'}
            </h1>
            {!isSimpleMode && (
              <p className="mt-1 text-sm text-neutral-500">
                Telemetry + LangGraph agents + Gemini powered intervention
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isSimpleMode && (
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
                Guvenli Odeme
                <ShieldCheck className="h-4 w-4 text-success-600" />
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsSimpleMode(!isSimpleMode)}
              aria-pressed={isSimpleMode}
              className={`flex min-h-touch items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-fast focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                isSimpleMode
                  ? 'bg-neutral-900 text-white shadow-md hover:bg-black'
                  : 'border border-neutral-200 bg-surface-primary text-neutral-700 hover:bg-neutral-50 hover:shadow-sm'
              }`}
            >
              {isSimpleMode ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {isSimpleMode ? 'Standart Gorunum' : 'Sade Mod'}
            </button>
          </div>
        </header>

        {/* ── Demo Scenarios ────────────────────────────────── */}
        {!isSimpleMode && (
          <DemoScenarioBar
            onRunScenario={runDemoScenario}
            onReset={resetDemo}
          />
        )}

        {/* ── Main Grid ─────────────────────────────────────── */}
        <div
          className={`grid gap-6 ${
            isSimpleMode ? 'grid-cols-1' : 'lg:grid-cols-[1fr_360px]'
          }`}
        >
          {/* ── Left Column: Cart + Dilemma ───────────────── */}
          <div className="space-y-6">
            <motion.section
              layout
              aria-label="Sepet urunleri"
              className={`border bg-surface-primary p-5 ${
                isSimpleMode
                  ? 'rounded-lg border-2 border-neutral-300 shadow-none'
                  : 'rounded-lg border-neutral-200 shadow-sm'
              }`}
            >
              {cart.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isSimpleMode={isSimpleMode}
                />
              ))}
            </motion.section>

            <DilemmaResolver
              items={cart}
              isVisible={!isSimpleMode && cart.length > 1}
            />
          </div>

          {/* ── Right Column: Sidebar ─────────────────────── */}
          <aside className="space-y-6" aria-label="Siparis ozeti ve metrikler">
            {!isSimpleMode && (
              <div className="grid grid-cols-2 gap-3">
                <RiskMetric
                  riskScore={riskScore}
                  userProfile={userProfile}
                />
                <ROIMetric monthlyRecovery={projectedMonthlyRecovery} />
              </div>
            )}

            <OrderSummary items={cart} isSimpleMode={isSimpleMode} />

            {!isSimpleMode && (
              <AgentLog
                events={
                  agentResult?.workflow_events ?? ['Telemetry captured']
                }
                analysisError={analysisError}
              />
            )}
          </aside>
        </div>

        {/* ── Telemetry HUD ─────────────────────────────────── */}
        {!isSimpleMode && (
          <TelemetryPanel
            idleTimeSeconds={idleTimeSeconds}
            isRiskHigh={isRiskHigh}
            riskScore={riskScore}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* ── Agent Popup Modal ─────────────────────────────── */}
        <AgentPopup
          isVisible={shouldShowPopup}
          agentResult={agentResult}
          onDismiss={() => setIsDismissed(true)}
          onAccept={() => setIsDismissed(true)}
        />
      </div>
    </motion.main>
  );
}
