/* ============================================================
   CartCoach — Shared Type Definitions
   ============================================================ */

export type CartItemData = {
  id: string;
  name: string;
  price: number;
  image: string;
  feature: string;
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

export type AgentResult = {
  risk_score: number;
  user_profile: string;
  intervention_required: boolean;
  final_message: string;
  coupon_details?: CouponDetails | null;
  comparison_data?: ComparisonData | null;
  workflow_events: string[];
};

export type DemoScenario = 'price-sensitive' | 'dilemma' | 'low-risk';
