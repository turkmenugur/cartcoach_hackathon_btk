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
        return mock_db[user_id]

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
