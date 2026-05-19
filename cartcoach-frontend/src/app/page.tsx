'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useTracker } from '@/hooks/useTracker';
import {
  analyzeCart,
  buildTelemetryPayload,
  checkApiHealth,
  fetchProductCatalog,
  scenarioTelemetry,
} from '@/lib/api';
import {
  fallbackAgentResult,
  scenarioFallbackResults,
} from '@/lib/demo-fallback';
import type {
  AgentResult,
  BackendProduct,
  CartItemData,
  DemoScenario,
  ProductIconKey,
} from '@/types';
import {
  AgentPopup,
  BuffHero,
  CartDrawer,
  DemoScenarioBar,
  EditorialStory,
  JudgeModePanel,
  ProductShowcase,
  SmartCommerceLayer,
  StoreHeader,
  TelemetryPanel,
} from '@/components';

const PRODUCT_IMAGE_URLS: Record<string, string> = {
  p101: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
  p102: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80',
  p103: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  p104: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  p105: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
  p106: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  p107: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  p108: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
  p109: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  p110: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
  p111: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  p112: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
  p113: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80',
  p114: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
  p115: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80',
  p116: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=80',
  p117: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  p118: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80',
  p119: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
  p120: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80',
  p121: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=900&q=80',
  p122: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80',
  p123: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
  p124: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  p125: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
  p126: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
  p127: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
  p128: 'https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=900&q=80',
  p129: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  p130: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80',
  p131: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80',
  p132: 'https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=900&q=80',
  p133: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
  p134: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
  p135: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80',
  p136: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
};

const PRODUCT_SEEDS = [
  ['p101', 'BUFF Aura Watch Pro', 18999, 'Wearable', 'watch-series', 'Son 8 urun', 'Titanyum kasa, microLED ekran ve gelismis saglik sensorleri'],
  ['p102', 'BUFF Pulse Watch Air', 10999, 'Wearable', 'watch-se', 'Hizli teslimat', 'Hafif govde, 7 gun pil hedefi ve fiyat/performans odakli akilli saat'],
  ['p103', 'BUFF NeonBook Pro X', 62999, 'Laptop', 'laptop-pro', 'Studio bundle', 'OLED ekran, AI hizlandiricili NPU ve 18 saat pil omru'],
  ['p104', 'BUFF SonicPods Max', 14999, 'Audio', 'audio-max', 'Yeni seri', 'Adaptif ANC, kayipsiz ses profili ve 42 saat pil'],
  ['p105', 'BUFF PlayDock 5', 25999, 'Gaming', 'console', 'Game pass hediyeli', '4K cloud gaming dock ve dusuk gecikme modu'],
  ['p106', 'BUFF Titan Phone Ultra', 48999, 'Phone', 'smartphone', 'Trade-in uygun', 'Periskop kamera, uydu baglantisi ve cihaz ici AI fotograf motoru'],
  ['p107', 'BUFF FrameCam Creator', 32999, 'Camera', 'camera-pro', 'Creator pick', '4K video, renk profilleri ve yapay zeka netleme'],
  ['p108', 'BUFF Keys Studio', 5999, 'Accessory', 'laptop-pro', 'Sessiz switch', 'Aluminyum mekanik klavye ve premium masa hissi'],
  ['p109', 'BUFF DeskHub 12', 7999, 'Desk', 'laptop-pro', 'USB-C hub', '12 port dock, 8K cikis ve hizli sarj destegi'],
  ['p110', 'BUFF AirCharge Stand', 3999, 'Accessory', 'smartphone', '3 cihaz', 'Telefon, saat ve kulaklik icin tek manyetik sarj standi'],
  ['p111', 'BUFF MiniBook Air', 38999, 'Laptop', 'laptop-pro', 'Travel light', '1 kg altinda hafif kasa ve tum gun pil'],
  ['p112', 'BUFF WorkPad OLED', 22999, 'Desk', 'smartphone', 'Not alma', 'OLED tablet, kalem destegi ve kreatif is akisi'],
  ['p113', 'BUFF SonicBuds Lite', 5499, 'Audio', 'audio-max', 'Gunluk', 'Hafif ANC kulaklik ve uzun pil omru'],
  ['p114', 'BUFF SonicBar Mini', 8999, 'Audio', 'audio-max', 'Ev sinema', 'Kompakt soundbar ve dusuk gecikmeli oyun modu'],
  ['p115', 'BUFF GamePad Elite', 4299, 'Gaming', 'console', 'Pro kontrol', 'Hall effect analoglar ve ayarlanabilir tetikler'],
  ['p116', 'BUFF CloudStick', 6999, 'Gaming', 'console', 'Mobil oyun', 'Bulut oyun icin elde tasinir kontrol cihazi'],
  ['p117', 'BUFF Titan Phone Mini', 32999, 'Phone', 'smartphone', 'Kompakt', 'Kucuk govde, amiral gemisi kamera ve hizli sarj'],
  ['p118', 'BUFF Titan Fold', 71999, 'Phone', 'smartphone', 'Katlanabilir', 'Buyuk ekranli katlanabilir telefon ve multitasking modu'],
  ['p119', 'BUFF Aura Ring', 7999, 'Wearable', 'watch-series', 'Wellness', 'Uyku, nabiz ve stres takibi icin minimal akilli yuzuk'],
  ['p120', 'BUFF Trail Watch', 16999, 'Wearable', 'watch-se', 'Outdoor', 'GPS, pusula ve 10 ATM dayaniklilik'],
  ['p121', 'BUFF FrameCam Pocket', 18999, 'Camera', 'camera-pro', 'Vlog', 'Kompakt kamera, flip ekran ve hizli transfer'],
  ['p122', 'BUFF LensKit Creator', 11999, 'Camera', 'camera-pro', 'Lens pack', 'Mobil ve kamera cekimleri icin kreatif lens seti'],
  ['p123', 'BUFF StudioLight Pro', 6499, 'Desk', 'camera-pro', 'Creator desk', 'Ayarlanabilir renk isisi ve masaustu yayin isigi'],
  ['p124', 'BUFF FocusLamp', 2999, 'Desk', 'laptop-pro', 'Deep work', 'Parlama azaltan masa lambasi ve odak modu'],
  ['p125', 'BUFF SecureCam 2K', 4999, 'Camera', 'camera-pro', 'Home tech', '2K guvenlik kamerasi ve akilli hareket algilama'],
  ['p126', 'BUFF Router Mesh', 6999, 'Desk', 'laptop-pro', 'Wi-Fi 7', 'Mesh ag, dusuk gecikme ve akilli cihaz onceligi'],
  ['p127', 'BUFF PowerBank Graphene', 3499, 'Accessory', 'smartphone', 'Travel', 'Hizli sarj, dusuk isi ve kompakt govde'],
  ['p128', 'BUFF CableKit Pro', 1999, 'Accessory', 'smartphone', 'Organizer', 'USB-C kablo seti ve manyetik tasima kutusu'],
  ['p129', 'BUFF Monitor 5K', 44999, 'Desk', 'laptop-pro', '5K studio', '5K ekran, renk dogrulugu ve USB-C tek kablo baglanti'],
  ['p130', 'BUFF ErgoChair Flow', 18999, 'Desk', 'laptop-pro', 'Ergonomi', 'Uzun calisma icin nefes alan premium ofis koltugu'],
  ['p131', 'BUFF VR Lens', 27999, 'Gaming', 'console', 'Immersive', 'Yuksek cozunurluklu VR deneyimi ve el takibi'],
  ['p132', 'BUFF StreamDeck Nano', 4999, 'Gaming', 'console', 'Yayin', 'Kisayol tuslari, sahne kontrolu ve kreatif makrolar'],
  ['p133', 'BUFF StudioMic X', 8999, 'Audio', 'audio-max', 'Podcast', 'USB-C mikrofon, temiz vokal ve masustu stand'],
  ['p134', 'BUFF SleepBuds Calm', 4499, 'Audio', 'audio-max', 'Uyku', 'Gece kullanimi icin hafif kulaklik ve pasif izolasyon'],
  ['p135', 'BUFF HomePod Mini X', 6999, 'Audio', 'audio-max', 'Akilli ev', 'Oda dolusu ses ve akilli ev kontrolu'],
  ['p136', 'BUFF Creator Backpack', 5999, 'Accessory', 'laptop-pro', 'Carry', 'Laptop, kamera ve aksesuarlar icin premium sirt cantasi'],
] as const;

const FEATURED_PRODUCTS: CartItemData[] = PRODUCT_SEEDS.map(
  ([id, name, price, category, icon, badge, feature], index) => ({
    id,
    name,
    price,
    image: id.toUpperCase(),
    icon,
    imageUrl: PRODUCT_IMAGE_URLS[id],
    badge,
    category,
    rating: 4.5 + ((index % 5) * 0.1),
    stockSignal: index % 4 === 0 ? 'Sinirli stok' : index % 3 === 0 ? 'Bugun kargoda' : 'Premium stok',
    feature,
    aiHint:
      category === 'Laptop' || price > 30000
        ? 'Yuksek tutarda taksit, bundle ve marj korumali teklif stratejisi uretilir.'
        : 'Kullanici niyetine gore karsilastirma, alternatif veya tamamlayici urun onerilir.',
  }),
);

const INITIAL_CART: CartItemData[] = FEATURED_PRODUCTS.slice(0, 2);

function iconForCategory(category: string): ProductIconKey {
  const iconMap: Record<string, ProductIconKey> = {
    Accessory: 'smartphone',
    Audio: 'audio-max',
    Camera: 'camera-pro',
    Desk: 'laptop-pro',
    Gaming: 'console',
    Laptop: 'laptop-pro',
    Phone: 'smartphone',
    Wearable: 'watch-series',
  };
  return iconMap[category] ?? 'laptop-pro';
}

function mapBackendProduct(product: BackendProduct, index: number): CartItemData {
  const category = product.category ?? 'Tech';
  const price = Number(product.price || 0);

  return {
    id: product.product_id,
    name: product.name,
    price,
    image: product.product_id.toUpperCase(),
    icon: product.icon_key ?? iconForCategory(category),
    imageUrl: product.image_url ?? PRODUCT_IMAGE_URLS[product.product_id],
    badge: product.badge ?? 'Premium pick',
    category,
    rating: Number(product.rating ?? 4.5 + ((index % 5) * 0.1)),
    stockSignal:
      product.stock_signal ??
      (index % 4 === 0
        ? 'Sinirli stok'
        : index % 3 === 0
          ? 'Bugun kargoda'
          : 'Premium stok'),
    feature:
      product.feature ??
      'BUFF AI ile karsilastirma, bundle ve sepet riski sinyallerine baglanir.',
    aiHint:
      product.ai_hint ??
      (category === 'Laptop' || price > 30000
        ? 'Yuksek tutarda taksit, bundle ve marj korumali teklif stratejisi uretilir.'
        : 'Kullanici niyetine gore karsilastirma, alternatif veya tamamlayici urun onerilir.'),
  };
}

export default function CartPage() {
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [forcePopup, setForcePopup] = useState(false);
  const [cart, setCart] = useState<CartItemData[]>(INITIAL_CART);
  const [products, setProducts] = useState<CartItemData[]>(FEATURED_PRODUCTS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(
    null,
  );

  const { isRiskHigh, idleTimeSeconds, mouseMovements, reset: resetTracker } =
    useTracker(5);

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart],
  );

  const visibleProducts = useMemo(
    () => {
      const base =
        selectedCategory === 'All'
          ? products
          : products.filter(
              (product) => product.category === selectedCategory,
            );
      const rankedIds = agentResult?.store_reranking?.ranked_product_ids ?? [];
      if (!rankedIds.length) return base;

      const rank = new Map(rankedIds.map((id, index) => [id, index]));
      return [...base].sort(
        (a, b) =>
          (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
          (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER),
      );
    },
    [agentResult?.store_reranking?.ranked_product_ids, products, selectedCategory],
  );

  const rerankMessages = useMemo(() => {
    const entries = agentResult?.store_reranking?.items ?? [];
    return Object.fromEntries(
      entries.map((item) => [item.product_id, item.card_message]),
    );
  }, [agentResult?.store_reranking?.items]);

  const productCategories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(products.map((product) => product.category ?? 'Tech')),
      ),
    ],
    [products],
  );

  const recoveredRevenue = agentResult?.business_impact
    ? Math.round(agentResult.business_impact.recovered_revenue)
    : agentResult?.coupon_details
      ? Math.round(agentResult.coupon_details.new_total)
    : agentResult && !agentResult.intervention_required
      ? 0
      : Math.round(total * 0.15);

  const projectedMonthlyRecovery =
    agentResult?.business_impact?.monthly_recovery_projection ??
    recoveredRevenue * 42;

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
        'Risk dusuk: BUFF AI mudahale etmedi (router -> END).',
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
    setSelectedCategory('All');
    setIsCartOpen(false);
    setCart(INITIAL_CART);
    resetTracker();
  };

  const removeFromCart = (itemId: string) => {
    setCart((items) => items.filter((item) => item.id !== itemId));
    setStatusMessage('Urun sepetten kaldirildi.');
  };

  const addToCart = (product: CartItemData) => {
    setCart((items) => {
      if (items.some((item) => item.id === product.id)) return items;
      return [...items, product];
    });
    setIsDismissed(false);
    setStatusMessage(`${product.name} sepete eklendi.`);
    setIsCartOpen(true);
  };

  const askAiForProduct = async (product: CartItemData) => {
    addToCart(product);
    setStatusMessage(`${product.name} icin BUFF AI Coach calisiyor.`);
    await runAnalysis(
      {
        idle_time_seconds: 92,
        mouse_movements: 'low',
        scroll_depth: 48,
        exit_intent: product.price > 30000,
      },
      product.price > 30000
        ? scenarioFallbackResults['price-sensitive']
        : fallbackAgentResult,
    );
  };

  const scrollToProducts = () => {
    document
      .getElementById('buff-products')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    void fetchProductCatalog()
      .then((catalog) => {
        if (!catalog.products.length) return;
        setProducts(catalog.products.map(mapBackendProduct));
      })
      .catch(() => {
        setProducts(FEATURED_PRODUCTS);
      });
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
      <div className="mx-auto w-full max-w-[1760px]">
        <StoreHeader
          cartCount={cart.length}
          isSimpleMode={isSimpleMode}
          apiOnline={apiOnline}
          onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
          onOpenCart={() => setIsCartOpen(true)}
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
          <BuffHero
            apiOnline={apiOnline}
            onRunAiDemo={() => runDemoScenario('price-sensitive')}
            onScrollToProducts={scrollToProducts}
          />
        )}

        {!isSimpleMode && <SmartCommerceLayer agentResult={agentResult} />}

        {!isSimpleMode && (
          <ProductShowcase
            products={visibleProducts}
            cartIds={cart.map((item) => item.id)}
            categories={productCategories}
            selectedCategory={selectedCategory}
            rerankMessages={rerankMessages}
            onSelectCategory={setSelectedCategory}
            onAddToCart={addToCart}
            onAskAi={askAiForProduct}
          />
        )}

        {!isSimpleMode && <EditorialStory />}

        {!isSimpleMode && (
          <DemoScenarioBar
            onRunScenario={runDemoScenario}
            onReset={resetDemo}
            isLoading={isAnalyzing}
            activeScenario={activeScenario}
          />
        )}

        {!isSimpleMode && (
          <JudgeModePanel
            agentResult={agentResult}
            apiOnline={apiOnline}
            cartTotal={total}
            idleTimeSeconds={idleTimeSeconds}
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

        <CartDrawer
          isOpen={isCartOpen}
          items={cart}
          riskScore={riskScore}
          userProfile={userProfile}
          monthlyRecovery={projectedMonthlyRecovery}
          agentResult={agentResult}
          analysisError={analysisError}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </motion.main>
  );
}
