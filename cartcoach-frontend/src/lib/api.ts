import type { AgentResult, CartItemData, DemoScenario } from '@/types';

export const API_URL =
  process.env.NEXT_PUBLIC_CARTCOACH_API_URL ?? 'http://127.0.0.1:8000';

export type TelemetryPayload = {
  user_id: string;
  idle_time_seconds: number;
  cart_items: Array<{ id: string; name: string; price: number }>;
  cart_total: number;
  mouse_movements: string;
  scroll_depth: number;
  exit_intent: boolean;
};

export function buildTelemetryPayload(
  cart: CartItemData[],
  overrides: Partial<TelemetryPayload> = {},
): TelemetryPayload {
  const cart_total = cart.reduce((sum, item) => sum + item.price, 0);

  return {
    user_id: 'usr_9988',
    idle_time_seconds: 95,
    cart_items: cart.map(({ id, name, price }) => ({ id, name, price })),
    cart_total,
    mouse_movements: 'low',
    scroll_depth: 72,
    exit_intent: false,
    ...overrides,
  };
}

export const scenarioTelemetry: Record<DemoScenario, Partial<TelemetryPayload>> =
  {
    'price-sensitive': {
      user_id: 'usr_9988',
      idle_time_seconds: 120,
      mouse_movements: 'low',
      scroll_depth: 35,
      exit_intent: true,
    },
    dilemma: {
      user_id: 'usr_9988',
      idle_time_seconds: 95,
      mouse_movements: 'low',
      scroll_depth: 68,
    },
    'low-risk': {
      user_id: 'usr_1234',
      idle_time_seconds: 8,
      mouse_movements: 'active',
      scroll_depth: 88,
      exit_intent: false,
    },
  };

export async function analyzeCart(
  userData: TelemetryPayload,
): Promise<AgentResult> {
  const response = await fetch(`${API_URL}/analyze-cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_data: userData }),
  });

  if (!response.ok) {
    let detail = 'Agent API yanit vermedi';
    try {
      const errBody = (await response.json()) as {
        error?: string;
        detail?: string;
        fallback_message?: string;
      };
      detail =
        errBody.detail ?? errBody.error ?? errBody.fallback_message ?? detail;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail);
  }

  return (await response.json()) as AgentResult;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}
