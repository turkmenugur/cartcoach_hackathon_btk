'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useTracker } from '@/hooks/useTracker';
import {
  analyzeCart,
  buildTelemetryPayload,
  checkApiHealth,
  scenarioTelemetry,
} from '@/lib/api';
import {
  fallbackAgentResult,
  scenarioFallbackResults,
} from '@/lib/demo-fallback';
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
  StoreHeader,
  TelemetryPanel,
} from '@/components';

const INITIAL_CART: CartItemData[] = [
  {
    id: 'p123',
    name: 'Apple Watch Series 9',
    price: 14999,
    image: 'AW',
    icon: 'watch-series',
    badge: 'Yarin kargoda',
    feature: 'Gelismis saglik sensorleri ve her zaman acik ekran',
  },
  {
    id: 'p124',
    name: 'Apple Watch SE (2. Nesil)',
    price: 9499,
    image: 'SE',
    icon: 'watch-se',
    badge: 'Ucretsiz kargo',
    feature: 'Fiyat/performans odakli temel akilli saat deneyimi',
  },
];

export default function CartPage() {
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [forcePopup, setForcePopup] = useState(false);
  const [cart, setCart] = useState<CartItemData[]>(INITIAL_CART);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(
    null,
  );

  const { isRiskHigh, idleTimeSeconds, mouseMovements, reset: resetTracker } =
    useTracker(5);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart],
  );

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
    Boolean(agentResult?.intervention_required);

  const riskScore = agentResult?.risk_score ?? (isRiskHigh ? 85 : 24);
  const userProfile =
    agentResult?.user_profile ?? (isRiskHigh ? 'beklemede' : 'aktif');

  const runAnalysis = useCallback(
    async (
      telemetryOverrides: Parameters<typeof buildTelemetryPayload>[1] = {},
      fallback: AgentResult = fallbackAgentResult,
    ) => {
      if (cart.length === 0) {
        setStatusMessage('Sepet bos oldugu icin agent analizi calistirilmadi.');
        return null;
      }

      setIsAnalyzing(true);
      setAnalysisError(null);
      setStatusMessage(null);

      const payload = buildTelemetryPayload(cart, {
        idle_time_seconds: Math.max(idleTimeSeconds, 5),
        mouse_movements: mouseMovements < 5 ? 'low' : 'active',
        ...telemetryOverrides,
      });

      try {
        const result = await analyzeCart(payload);
        setAgentResult(result);
        setForcePopup(Boolean(result.intervention_required));
        setApiOnline(true);
        return result;
      } catch (error) {
        setAgentResult(fallback);
        setForcePopup(fallback.intervention_required);
        setAnalysisError(
          error instanceof Error
            ? error.message
            : 'Agent API gecici olarak kullanilamiyor',
        );
        setApiOnline(false);
        return fallback;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [cart, idleTimeSeconds, mouseMovements],
  );

  const runDemoScenario = async (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setIsDismissed(false);
    resetTracker();

    const result = await runAnalysis(
      scenarioTelemetry[scenario],
      scenarioFallbackResults[scenario],
    );

    if (result && !result.intervention_required) {
      setStatusMessage(
        'Risk dusuk: CartCoach mudahale etmedi (router -> END).',
      );
    }

    setActiveScenario(null);
  };

  const resetDemo = () => {
    setAgentResult(null);
    setAnalysisError(null);
    setIsDismissed(false);
    setForcePopup(false);
    setStatusMessage(null);
    setActiveScenario(null);
    setCart(INITIAL_CART);
    resetTracker();
  };

  const removeFromCart = (itemId: string) => {
    setCart((items) => items.filter((item) => item.id !== itemId));
    setStatusMessage('Urun sepetten kaldirildi.');
  };

  const handleCheckout = () => {
    setStatusMessage(
      isSimpleMode
        ? 'Demo: Odeme adimina gecildi.'
        : 'Demo: Guvenli odeme akisi baslatildi.',
    );
    setIsDismissed(true);
  };

  useEffect(() => {
    void checkApiHealth().then(setApiOnline);
  }, []);

  useEffect(() => {
    if (!isRiskHigh || agentResult || isAnalyzing || activeScenario) return;
    if (cart.length === 0) return;

    void runAnalysis({ idle_time_seconds: Math.max(idleTimeSeconds, 95) });
  }, [
    activeScenario,
    agentResult,
    cart.length,
    idleTimeSeconds,
    isAnalyzing,
    isRiskHigh,
    runAnalysis,
  ]);

  return (
    <motion.main
      id="main-content"
      initial={false}
      animate={{
        backgroundColor: isSimpleMode ? '#f8fafc' : 'transparent',
      }}
      className={`min-h-screen font-sans transition-colors duration-slower ${
        isSimpleMode ? 'p-6 md:p-8' : 'commerce-page-bg p-4 md:p-6 lg:p-8'
      }`}
    >
      <div className="mx-auto max-w-container">
        <StoreHeader
          cartCount={cart.length}
          isSimpleMode={isSimpleMode}
          apiOnline={apiOnline}
          onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
          simpleModeLabel={isSimpleMode ? 'Standart' : 'Sade Mod'}
          simpleModeIcon={
            isSimpleMode ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
        />

        {!isSimpleMode && (
          <DemoScenarioBar
            onRunScenario={runDemoScenario}
            onReset={resetDemo}
            isLoading={isAnalyzing}
            activeScenario={activeScenario}
          />
        )}

        <AnimatePresence>
          {statusMessage && !isSimpleMode && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="status"
              className="mb-4 rounded-xl border border-primary-200 bg-white/90 px-4 py-3 text-sm text-primary-900 shadow-sm backdrop-blur-sm"
            >
              {statusMessage}
            </motion.p>
          )}
        </AnimatePresence>

        <div
          className={`grid gap-6 ${
            isSimpleMode ? 'grid-cols-1' : 'lg:grid-cols-[1fr_360px]'
          }`}
        >
          <div className="space-y-6">
            <motion.section
              layout
              aria-label="Sepet urunleri"
              className={
                isSimpleMode
                  ? 'rounded-2xl border-2 border-neutral-300 bg-white p-5'
                  : 'commerce-card p-4 md:p-5'
              }
            >
              {!isSimpleMode && cart.length > 0 && (
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
                  Sepetiniz ({cart.length} urun)
                </h2>
              )}
              {cart.length === 0 ? (
                <p className="py-12 text-center text-sm text-neutral-500">
                  Sepetiniz bos. Demo senaryosu icin Sifirla butonuna basin.
                </p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      isSimpleMode={isSimpleMode}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}
                </div>
              )}
            </motion.section>

            <DilemmaResolver
              items={cart}
              isVisible={!isSimpleMode && cart.length > 1}
              verdict={agentResult?.comparison_data?.verdict}
            />
          </div>

          <aside className="space-y-6" aria-label="Siparis ozeti ve metrikler">
            {!isSimpleMode && (
              <div className="grid grid-cols-2 gap-3">
                <RiskMetric riskScore={riskScore} userProfile={userProfile} />
                <ROIMetric monthlyRecovery={projectedMonthlyRecovery} />
              </div>
            )}

            <OrderSummary
              items={cart}
              isSimpleMode={isSimpleMode}
              onCheckout={handleCheckout}
            />

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

        {!isSimpleMode && (
          <TelemetryPanel
            idleTimeSeconds={idleTimeSeconds}
            isRiskHigh={isRiskHigh}
            riskScore={riskScore}
            isAnalyzing={isAnalyzing}
          />
        )}

        <AgentPopup
          isVisible={shouldShowPopup}
          agentResult={agentResult}
          onDismiss={() => setIsDismissed(true)}
          onAccept={() => {
            setIsDismissed(true);
            setStatusMessage('Demo: Teklif kabul edildi, sepet korunuyor.');
          }}
        />
      </div>
    </motion.main>
  );
}
