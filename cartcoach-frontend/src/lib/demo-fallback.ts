import type { AgentResult, DemoScenario } from '@/types';

export const fallbackAgentResult: AgentResult = {
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

export const scenarioFallbackResults: Record<DemoScenario, AgentResult> = {
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
