/* ============================================================
   CartCoach — Shared Type Definitions
   ============================================================ */

export type ProductIconKey =
  | 'watch-series'
  | 'watch-se'
  | 'laptop-pro'
  | 'audio-max'
  | 'console'
  | 'smartphone'
  | 'camera-pro';

export type CartItemData = {
  id: string;
  name: string;
  price: number;
  /** @deprecated Use icon — kept for backward compatibility */
  image: string;
  icon: ProductIconKey;
  imageUrl?: string;
  feature: string;
  badge?: string;
  category?: string;
  rating?: number;
  stockSignal?: string;
  aiHint?: string;
};

export type CouponDetails = {
  coupon_code: string;
  discount_ratio: number;
  discount_amount: number;
  new_total: number;
  expires_in_minutes: number;
  margin_protection_triggered: boolean;
};

export type ComparisonData = {
  comparison_found: boolean;
  verdict?: string;
  products?: Record<string, unknown>;
};

export type ModelTraceItem = {
  agent: string;
  status: 'live' | 'fallback';
  latency_ms: number;
  detail: string;
};

export type BusinessImpact = {
  cart_total: number;
  discount_amount: number;
  new_total: number;
  recovered_revenue: number;
  monthly_recovery_projection: number;
  avoided_unnecessary_popup: boolean;
};

export type Guardrails = {
  risk_threshold: number;
  max_discount_ratio: number;
  margin_protection_triggered: boolean;
};

export type AutomationStatus = {
  provider: 'n8n' | 'supabase_outbox' | 'supabase_outbox+n8n';
  configured: boolean;
  triggered: boolean;
  status: 'ready' | 'sent' | 'skipped' | 'failed' | 'queued' | 'processed';
  detail: string;
};

export type BackendProduct = {
  product_id: string;
  name: string;
  category: string;
  price: number | string;
  image_url?: string | null;
  icon_key?: ProductIconKey | null;
  badge?: string | null;
  feature?: string | null;
  rating?: number | string | null;
  stock_signal?: string | null;
  ai_hint?: string | null;
};

export type AgentResult = {
  risk_score: number;
  user_profile: string;
  intervention_required: boolean;
  final_message: string;
  coupon_details?: CouponDetails | null;
  comparison_data?: ComparisonData | null;
  workflow_events: string[];
  tool_calls?: string[];
  model_trace?: ModelTraceItem[];
  source_status?: 'live' | 'fallback';
  latency_ms?: number;
  business_impact?: BusinessImpact;
  guardrails?: Guardrails;
  automation?: AutomationStatus;
};

export type DemoScenario =
  | 'price-sensitive'
  | 'dilemma'
  | 'low-risk'
  | 'margin-guardrail';
