import hashlib
import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from buff_catalog import CATALOG_BY_ID, CATALOG_PRODUCTS
from supabase_client import (
    is_supabase_configured,
    supabase_insert,
    supabase_select,
    supabase_update,
)


def _stable_int(value: str, minimum: int, maximum: int) -> int:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()
    number = int(digest[:8], 16)
    return minimum + (number % (maximum - minimum + 1))


def _cart_product_ids(user_data: Dict[str, Any]) -> List[str]:
    return [
        item.get("id")
        for item in user_data.get("cart_items", [])
        if isinstance(item, dict) and item.get("id")
    ]


def get_user_abandonment_history(user_id: str) -> Dict[str, Any]:
    """
    Analyst ajanina kullanici gecmisi verir.
    Supabase bagliysa buff_user_profiles tablosundan okur; degilse stabil demo verisi kullanir.
    """
    print(f"\n[Tool Use] get_user_abandonment_history (user_id={user_id})")

    rows = supabase_select(
        "buff_user_profiles",
        {
            "select": "*",
            "user_id": f"eq.{user_id}",
            "limit": "1",
        },
    )
    if rows:
        row = rows[0]
        memory = get_customer_memory_profile(user_id)
        row["customer_memory"] = memory
        row["source"] = "supabase"
        return row

    mock_db = {
        "usr_9988": {
            "user_id": "usr_9988",
            "past_purchases": 5,
            "abandoned_carts_count": 8,
            "abandonment_rate": 61.5,
            "loyalty_segment": "Silver",
            "preferred_category": "Wearable",
            "average_order_value": 18950,
            "return_rate": 6.8,
            "source": "fallback",
        },
        "usr_1234": {
            "user_id": "usr_1234",
            "past_purchases": 12,
            "abandoned_carts_count": 2,
            "abandonment_rate": 14.2,
            "loyalty_segment": "Gold",
            "preferred_category": "Desk",
            "average_order_value": 24990,
            "return_rate": 2.1,
            "source": "fallback",
        },
    }

    if user_id in mock_db:
        profile = mock_db[user_id]
        profile["customer_memory"] = get_customer_memory_profile(user_id)
        return profile

    abandonment_rate = round(float(_stable_int(user_id, 34, 78)), 1)
    return {
        "user_id": user_id,
        "past_purchases": _stable_int(user_id + "purchases", 0, 4),
        "abandoned_carts_count": _stable_int(user_id + "abandoned", 2, 7),
        "abandonment_rate": abandonment_rate,
        "loyalty_segment": "Bronze",
        "preferred_category": "General",
        "average_order_value": _stable_int(user_id + "aov", 6000, 22000),
        "return_rate": round(float(_stable_int(user_id + "returns", 1, 12)), 1),
        "customer_memory": get_customer_memory_profile(user_id),
        "source": "fallback",
    }


def get_customer_memory_profile(user_id: str) -> Dict[str, Any]:
    """
    Kullanici hakkinda arka plan alisveris hafizasini getirir.
    Supabase'de buff_customer_memory yoksa fallback demo hafizasi kullanir.
    """
    print(f"\n[Tool Use] get_customer_memory_profile (user_id={user_id})")
    rows = supabase_select(
        "buff_customer_memory",
        {
            "select": "*",
            "user_id": f"eq.{user_id}",
            "limit": "1",
        },
    )
    if rows:
        row = rows[0]
        row["source"] = "supabase"
        return row

    fallback = {
        "usr_9988": {
            "user_id": "usr_9988",
            "preferred_categories": ["Wearable", "Audio", "Accessory"],
            "price_sensitivity": 0.82,
            "coupon_affinity": 0.76,
            "payment_preference": "installment",
            "delivery_preference": "fast",
            "brand_affinity": "premium-but-deal-driven",
            "purchase_cadence_days": 28,
            "recent_purchases": [
                {"product_id": "p110", "name": "BUFF AirCharge Stand", "price": 3999},
                {"product_id": "p113", "name": "BUFF SonicBuds Lite", "price": 5499},
            ],
            "behavior_tags": ["kararsiz", "kuponla doner", "wellness odakli"],
            "source": "fallback",
        },
        "usr_1234": {
            "user_id": "usr_1234",
            "preferred_categories": ["Desk", "Laptop", "Camera"],
            "price_sensitivity": 0.32,
            "coupon_affinity": 0.18,
            "payment_preference": "card",
            "delivery_preference": "standard",
            "brand_affinity": "premium-first",
            "purchase_cadence_days": 18,
            "recent_purchases": [
                {"product_id": "p123", "name": "BUFF StudioLight Pro", "price": 6499},
                {"product_id": "p126", "name": "BUFF Router Mesh", "price": 6999},
            ],
            "behavior_tags": ["sadik", "creator desk", "premium tercih"],
            "source": "fallback",
        },
    }
    if user_id in fallback:
        return fallback[user_id]

    return {
        "user_id": user_id,
        "preferred_categories": ["General"],
        "price_sensitivity": round(_stable_int(user_id + "price", 25, 85) / 100, 2),
        "coupon_affinity": round(_stable_int(user_id + "coupon", 20, 80) / 100, 2),
        "payment_preference": "card",
        "delivery_preference": "standard",
        "brand_affinity": "balanced",
        "purchase_cadence_days": _stable_int(user_id + "cadence", 14, 45),
        "recent_purchases": [],
        "behavior_tags": ["genel"],
        "source": "fallback",
    }


def fetch_products(product_ids: List[str]) -> List[Dict[str, Any]]:
    if not product_ids:
        return []

    quoted_ids = ",".join(product_ids)
    rows = supabase_select(
        "buff_products",
        {
            "select": "*",
            "product_id": f"in.({quoted_ids})",
        },
    )
    if rows:
        found_ids = {row.get("product_id") for row in rows}
        missing = [
            CATALOG_BY_ID[pid]
            for pid in product_ids
            if pid not in found_ids and pid in CATALOG_BY_ID
        ]
        return rows + missing

    return [CATALOG_BY_ID[pid] for pid in product_ids if pid in CATALOG_BY_ID]


def get_product_catalog() -> Dict[str, Any]:
    rows = supabase_select(
        "buff_products",
        {
            "select": "*",
            "is_active": "eq.true",
            "order": "category.asc,name.asc",
        },
    )
    if rows:
        found_ids = {row.get("product_id") for row in rows}
        merged_products = rows + [
            product
            for product in CATALOG_PRODUCTS
            if product["product_id"] not in found_ids
        ]
        source = "supabase" if len(merged_products) == len(rows) else "mixed"
        return {"source": source, "products": merged_products}

    return {"source": "fallback", "products": CATALOG_PRODUCTS}


def build_shopping_twin(
    user_data: Dict[str, Any],
    history: Dict[str, Any],
    user_profile: str,
) -> Dict[str, Any]:
    memory = history.get("customer_memory") or get_customer_memory_profile(
        user_data.get("user_id") or "usr_demo"
    )
    cart_items = user_data.get("cart_items") or []
    cart_categories = [
        CATALOG_BY_ID[item.get("id")].get("category")
        for item in cart_items
        if item.get("id") in CATALOG_BY_ID
    ]
    price_sensitivity = float(memory.get("price_sensitivity") or 0)
    coupon_affinity = float(memory.get("coupon_affinity") or 0)
    cart_total = float(user_data.get("cart_total") or 0)

    if "karars" in user_profile:
        intent = "kararsiz karar arayan"
    elif price_sensitivity > 0.7 or coupon_affinity > 0.65:
        intent = "fiyat hassas firsat avcisi"
    elif cart_total > 45000 or "premium" in str(memory.get("brand_affinity")):
        intent = "premium performans arayan"
    elif "Accessory" in cart_categories:
        intent = "tamamlayici setup kuran"
    else:
        intent = "dengeli teknoloji alicisi"

    return {
        "name": "BUFF Shopping Twin",
        "intent_profile": intent,
        "confidence": 0.86 if memory.get("source") == "supabase" else 0.74,
        "preferred_categories": memory.get("preferred_categories") or [],
        "payment_preference": memory.get("payment_preference"),
        "delivery_preference": memory.get("delivery_preference"),
        "coupon_affinity": coupon_affinity,
        "price_sensitivity": price_sensitivity,
        "behavior_tags": memory.get("behavior_tags") or [],
        "memory_summary": (
            f"{memory.get('brand_affinity', 'balanced')} profil; "
            f"{memory.get('payment_preference', 'card')} odeme; "
            f"{memory.get('delivery_preference', 'standard')} teslimat; "
            f"kupon egilimi %{round(coupon_affinity * 100)}."
        ),
        "source": memory.get("source", "fallback"),
    }


def build_live_store_reranking(
    products: List[Dict[str, Any]],
    shopping_twin: Dict[str, Any],
    user_profile: str,
) -> Dict[str, Any]:
    preferred = set(shopping_twin.get("preferred_categories") or [])
    price_sensitivity = float(shopping_twin.get("price_sensitivity") or 0)
    coupon_affinity = float(shopping_twin.get("coupon_affinity") or 0)
    intent = str(shopping_twin.get("intent_profile") or "")

    ranked = []
    for product in products:
        price = float(product.get("price") or 0)
        category = product.get("category")
        margin = float(product.get("margin_ratio") or 0.25)
        score = 50.0
        reasons = []

        if category in preferred:
            score += 20
            reasons.append("gecmis kategori tercihi")
        if price_sensitivity > 0.7 and price < 16000:
            score += 16
            reasons.append("fiyat hassas profil")
        if "premium" in intent and price > 30000:
            score += 18
            reasons.append("premium niyet")
        if coupon_affinity > 0.65 and margin > 0.28:
            score += 10
            reasons.append("kupon marji uygun")
        if "karars" in user_profile and category in {"Wearable", "Laptop", "Phone"}:
            score += 8
            reasons.append("karsilastirma icin uygun")

        ranked.append(
            {
                "product_id": product.get("product_id"),
                "score": round(score, 1),
                "reason": ", ".join(reasons[:2]) or "genel uygunluk",
                "card_message": (
                    "Sana gore one cikarildi: "
                    + (", ".join(reasons[:2]) or "dengeli tercih")
                ),
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {
        "strategy_label": "Live Store Re-Ranking",
        "reason": "Urun sirasi kullanicinin hafizasi, sepet davranisi ve fiyat hassasiyetine gore yeniden dizildi.",
        "ranked_product_ids": [item["product_id"] for item in ranked],
        "items": ranked[:12],
    }


def build_decision_card(
    product_ids: List[str],
    comparison_data: Optional[Dict[str, Any]],
    shopping_twin: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    products = fetch_products(product_ids[:2])
    if len(products) < 2:
        return None

    price_sensitivity = float(shopping_twin.get("price_sensitivity") or 0)
    sorted_products = sorted(products, key=lambda item: float(item.get("price") or 0))
    recommended = sorted_products[0] if price_sensitivity > 0.65 else sorted_products[-1]
    alternative = sorted_products[-1] if recommended == sorted_products[0] else sorted_products[0]
    perf_score = 82 if recommended == sorted_products[0] else 91
    regret_risk = 22 if recommended == sorted_products[0] else 31

    return {
        "title": "Kararsizlik Savar 2.0",
        "recommended_product_id": recommended.get("product_id"),
        "recommended_name": recommended.get("name"),
        "why": (
            "Fiyat hassasiyetin ve kupon kullanma egilimin nedeniyle daha dengeli secim."
            if price_sensitivity > 0.65
            else "Premium performans ve uzun omurlu kullanim sinyallerin daha guclu."
        ),
        "choose_other_when": f"{alternative.get('name')} sec: teknik ozellik ya da prestij senin icin fiyattan daha onemliyse.",
        "regret_risk": regret_risk,
        "price_performance_score": perf_score,
        "verdict": (comparison_data or {}).get("verdict")
        or f"{recommended.get('name')} bu profil icin daha dusuk karar pismanligi tasiyor.",
    }


def build_ai_bundle_builder(
    user_data: Dict[str, Any],
    bundle_recommendations: Optional[Dict[str, Any]],
    shopping_twin: Dict[str, Any],
) -> Dict[str, Any]:
    cart_total = float(user_data.get("cart_total") or 0)
    raw_items = (bundle_recommendations or {}).get("items") or []
    first = raw_items[0] if raw_items else {}
    bundle_name = first.get("bundle_name") or (
        "Creator Desk Set"
        if "Desk" in (shopping_twin.get("preferred_categories") or [])
        else "BUFF Smart Add-on Kit"
    )
    expected_lift = float(first.get("expected_lift_ratio") or 0.08)
    projected_lift = round(cart_total * expected_lift, 2)

    return {
        "bundle_name": bundle_name,
        "recommendation": first.get("recommendation")
        or "Sepete uygun tamamlayici aksesuar ve audio urunleri oner.",
        "expected_lift_ratio": expected_lift,
        "projected_revenue_lift": projected_lift,
        "margin_safe": expected_lift <= 0.15,
        "why_it_fits": (
            f"{shopping_twin.get('intent_profile')} profili icin sepet degerini "
            "artirirken indirim marjini guvenli tutar."
        ),
    }


def get_product_comparison_details(product_ids: List[str]) -> Dict[str, Any]:
    """
    Kararsiz kullanicilar icin urun ozelliklerini ve fiyat farkini getirir.
    """
    print(f"\n[Tool Use] get_product_comparison_details (product_ids={product_ids})")
    products = fetch_products(product_ids)
    comparison = {product["name"]: product for product in products}

    if len(products) >= 2:
        sorted_products = sorted(products, key=lambda item: float(item.get("price") or 0))
        cheaper = sorted_products[0]
        premium = sorted_products[-1]
        verdict = (
            f"{premium['name']} daha guclu teknik ozellik ve premium deneyim isteyen kullanici icin uygun. "
            f"{cheaper['name']} daha dusuk butceyle temel ihtiyaci karsilayan fiyat/performans secenegi."
        )
    elif products:
        verdict = f"{products[0]['name']} icin teknik ozellikler ve stok sinyalleri hazirlandi."
    else:
        verdict = "Kiyaslanacak urun verisi bulunamadi."

    return {
        "comparison_found": len(comparison) > 0,
        "products": comparison,
        "verdict": verdict,
        "source": "supabase" if is_supabase_configured() and products else "fallback",
    }


def summarize_product_reviews(product_ids: List[str]) -> Dict[str, Any]:
    """
    Urun yorumlarini ozetleyerek Strategist'e kalite/fiyat/guven sinyali verir.
    """
    print(f"\n[Tool Use] summarize_product_reviews (product_ids={product_ids})")

    if not product_ids:
        return {"summary_found": False, "items": [], "source": "none"}

    rows = supabase_select(
        "buff_product_review_summaries",
        {
            "select": "*",
            "product_id": f"in.({','.join(product_ids)})",
        },
    )
    if rows:
        return {"summary_found": True, "items": rows, "source": "supabase"}

    fallback_items = [
        {
            "product_id": product_id,
            "quality_score": round(_stable_int(product_id + "q", 78, 96) / 10, 1),
            "sentiment_score": round(_stable_int(product_id + "s", 72, 94) / 100, 2),
            "top_praise": "Premium his, guclu performans ve hizli teslimat.",
            "top_complaint": "Fiyat yuksek algilanabiliyor.",
            "review_summary": "Kullanicilar urunu kaliteli buluyor; karar noktasi genelde fiyat ve ihtiyac seviyesi.",
        }
        for product_id in product_ids[:4]
    ]
    return {"summary_found": True, "items": fallback_items, "source": "fallback"}


def get_bundle_recommendations(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sepete gore tamamlayici urun/bundle onerileri uretir.
    """
    product_ids = _cart_product_ids(user_data)
    print(f"\n[Tool Use] get_bundle_recommendations (product_ids={product_ids})")

    rows = supabase_select(
        "buff_bundle_rules",
        {
            "select": "*",
            "trigger_product_id": f"in.({','.join(product_ids)})" if product_ids else "eq.none",
            "limit": "3",
        },
    )
    if rows:
        return {"bundle_found": True, "items": rows, "source": "supabase"}

    cart_total = float(user_data.get("cart_total") or 0)
    fallback_bundle = {
        "bundle_found": True,
        "items": [
            {
                "bundle_name": "Creator Desk Boost",
                "recommendation": "Laptop veya telefon sepetine SonicPods Max ve AirCharge Stand eklenebilir.",
                "expected_lift_ratio": 0.12 if cart_total > 30000 else 0.08,
            }
        ],
        "source": "fallback",
    }
    return fallback_bundle


def _get_offer_policy(strategy_type: str) -> Dict[str, Any]:
    rows = supabase_select(
        "buff_offer_policies",
        {
            "select": "*",
            "strategy_type": f"eq.{strategy_type}",
            "is_active": "eq.true",
            "limit": "1",
        },
    )
    if rows:
        return rows[0]
    return {
        "strategy_type": strategy_type,
        "max_discount_ratio": 0.20,
        "expires_in_minutes": 15,
        "coupon_prefix": "BUFF",
    }


def generate_dynamic_coupon(
    cart_total: float,
    discount_ratio: float,
    strategy_type: str,
    user_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Marj korumali dinamik kupon uretir ve Supabase bagliysa buff_coupons tablosuna yazar.
    """
    print(
        "\n[Tool Use] generate_dynamic_coupon "
        f"(total={cart_total}, ratio={discount_ratio}, strategy={strategy_type})"
    )
    policy = _get_offer_policy(strategy_type)
    max_discount_ratio = float(policy.get("max_discount_ratio") or 0.20)
    actual_ratio = min(discount_ratio, max_discount_ratio)
    discount_amount = round(cart_total * actual_ratio, 2)
    new_total = round(cart_total - discount_amount, 2)
    prefix = str(policy.get("coupon_prefix") or "BUFF")
    random.seed(f"{user_id}-{cart_total}-{actual_ratio}-{strategy_type}")
    coupon_code = f"{prefix}{int(actual_ratio * 100)}{random.randint(10, 99)}"

    coupon = {
        "success": True,
        "user_id": user_id,
        "coupon_code": coupon_code,
        "discount_ratio": actual_ratio,
        "requested_discount_ratio": discount_ratio,
        "discount_amount": discount_amount,
        "new_total": new_total,
        "expires_in_minutes": int(policy.get("expires_in_minutes") or 15),
        "margin_protection_triggered": discount_ratio > max_discount_ratio,
        "source": "supabase" if is_supabase_configured() else "fallback",
    }

    supabase_insert("buff_coupons", coupon)
    return coupon


def enqueue_automation_event(event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    n8n kullanmasak bile otomasyon mantigini DB outbox olarak tutar.
    Sonradan Edge Function, cron veya n8n buradan okuyabilir.
    """
    event = {
        "event_type": event_type,
        "status": "pending",
        "payload": payload,
    }
    rows = supabase_insert("buff_automation_outbox", event)
    return {
        "provider": "supabase_outbox",
        "configured": is_supabase_configured(),
        "triggered": bool(rows),
        "status": "queued" if rows else "skipped",
        "detail": "Supabase automation outbox'a yazildi." if rows else "Supabase outbox pasif veya yazilamadi.",
    }


def log_agent_analysis(analysis: Dict[str, Any]) -> None:
    supabase_insert(
        "buff_agent_events",
        {
            "user_id": analysis.get("user_id"),
            "risk_score": analysis.get("risk_score"),
            "user_profile": analysis.get("user_profile"),
            "intervention_required": analysis.get("intervention_required"),
            "source_status": analysis.get("source_status"),
            "payload": analysis,
        },
    )


def process_automation_outbox(limit: int = 10) -> Dict[str, Any]:
    """
    Pending automation eventlerini isler.
    Hackathon demosunda gercek webhook yerine DB uzerinde processed durumuna alir.
    """
    rows = supabase_select(
        "buff_automation_outbox",
        {
            "select": "*",
            "status": "eq.pending",
            "order": "created_at.asc",
            "limit": str(limit),
        },
    )

    processed = []
    for row in rows:
        event_id = row.get("id")
        if not event_id:
            continue

        updated_rows = supabase_update(
            "buff_automation_outbox",
            {
                "status": "processed",
                "processed_at": datetime.now(timezone.utc).isoformat(),
            },
            {"id": f"eq.{event_id}"},
        )
        processed.extend(updated_rows)

    return {
        "configured": is_supabase_configured(),
        "requested_limit": limit,
        "pending_found": len(rows),
        "processed_count": len(processed),
        "processed_events": processed,
    }
