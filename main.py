import io
import json
import os
import sys
import time
from typing import Any, Dict
from urllib import error, request

from dotenv import load_dotenv
from langgraph.graph import END, StateGraph

from agents import AgentState, analyst_agent, strategist_agent, synthesizer_agent
from tools import enqueue_automation_event, log_agent_analysis


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
load_dotenv()


def build_cartcoach_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("analyst", analyst_agent)
    workflow.add_node("strategist", strategist_agent)
    workflow.add_node("synthesizer", synthesizer_agent)

    workflow.set_entry_point("analyst")

    def route_based_on_risk(state: AgentState) -> str:
        risk = state.get("risk_score", 0) or 0
        print(f"\n[Router] Hesaplanan Risk Skoru: {risk}")
        if risk > 60:
            print("[Router] Risk yuksek, otonom ikna stratejisi tetikleniyor...")
            return "strategist"

        print("[Router] Risk dusuk, mudahaleye gerek yok.")
        return "end"

    workflow.add_conditional_edges(
        "analyst",
        route_based_on_risk,
        {
            "strategist": "strategist",
            "end": END,
        },
    )

    workflow.add_edge("strategist", "synthesizer")
    workflow.add_edge("synthesizer", END)

    return workflow.compile()


def normalize_user_data(user_data: Dict[str, Any]) -> Dict[str, Any]:
    cart_items = user_data.get("cart_items") or []
    cart_total = user_data.get("cart_total")

    if not cart_total:
        cart_total = sum(float(item.get("price") or 0) for item in cart_items)

    return {
        **user_data,
        "user_id": user_data.get("user_id") or "usr_demo",
        "cart_items": cart_items,
        "cart_total": cart_total,
    }


def dispatch_automation(analysis: Dict[str, Any]) -> Dict[str, Any]:
    outbox_result = enqueue_automation_event("cart_rescue_analysis", analysis)
    webhook_url = os.environ.get("N8N_WEBHOOK_URL")
    automation = {
        "provider": "supabase_outbox+n8n",
        "configured": outbox_result.get("configured") or bool(webhook_url),
        "triggered": bool(outbox_result.get("triggered")),
        "status": outbox_result.get("status", "skipped"),
        "detail": outbox_result.get("detail", "Otomasyon pasif."),
    }

    if not webhook_url:
        return automation

    if not analysis.get("intervention_required"):
        automation["detail"] = "Risk dusuk oldugu icin n8n webhook tetiklenmedi."
        return automation

    payload = {
        "event": "buff_store_cart_rescue",
        "user_id": analysis.get("user_id"),
        "risk_score": analysis.get("risk_score"),
        "user_profile": analysis.get("user_profile"),
        "coupon_details": analysis.get("coupon_details"),
        "business_impact": analysis.get("business_impact"),
        "source_status": analysis.get("source_status"),
    }

    try:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            webhook_url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with request.urlopen(req, timeout=3) as response:
            automation.update(
                {
                    "triggered": True,
                    "status": "sent",
                    "detail": f"Supabase outbox + n8n webhook {response.status} tamamlandi.",
                }
            )
    except (error.URLError, TimeoutError, OSError) as exc:
        automation.update(
            {
                "triggered": False,
                "status": "failed",
                "detail": f"n8n webhook gonderimi basarisiz: {exc}",
            }
        )

    return automation


def run_cartcoach_analysis(user_data: Dict[str, Any]) -> Dict[str, Any]:
    normalized_user_data = normalize_user_data(user_data)
    initial_state: AgentState = {
        "user_data": normalized_user_data,
        "user_id": None,
        "risk_score": None,
        "user_profile": None,
        "strategy": None,
        "coupon_details": None,
        "comparison_data": None,
        "review_summary": None,
        "bundle_recommendations": None,
        "final_message": None,
        "workflow_events": ["Telemetry captured"],
        "model_trace": [],
        "tool_calls": [],
    }

    started_at = time.perf_counter()
    app = build_cartcoach_graph()
    result = app.invoke(initial_state)
    total_latency_ms = int((time.perf_counter() - started_at) * 1000)

    risk_score = result.get("risk_score") or 0
    intervention_required = risk_score > 60
    workflow_events = list(result.get("workflow_events") or [])
    model_trace = list(result.get("model_trace") or [])
    tool_calls = list(result.get("tool_calls") or [])
    coupon_details = result.get("coupon_details")
    cart_total = float(normalized_user_data.get("cart_total") or 0)
    discount_amount = (
        float(coupon_details.get("discount_amount") or 0) if coupon_details else 0
    )
    new_total = float(coupon_details.get("new_total") or cart_total)
    monthly_recovery_projection = new_total * 42 if intervention_required else 0
    source_status = (
        "fallback"
        if any(item.get("status") == "fallback" for item in model_trace)
        else "live"
    )

    router_event = (
        "Router selected intervention path"
        if intervention_required
        else "Router ended workflow: no intervention"
    )
    if router_event not in workflow_events:
        workflow_events.append(router_event)

    analysis = {
        "user_id": result.get("user_id"),
        "risk_score": risk_score,
        "user_profile": result.get("user_profile"),
        "intervention_required": intervention_required,
        "strategy": result.get("strategy"),
        "coupon_details": coupon_details,
        "comparison_data": result.get("comparison_data"),
        "review_summary": result.get("review_summary"),
        "bundle_recommendations": result.get("bundle_recommendations"),
        "final_message": result.get("final_message")
        or "Risk dusuk oldugu icin BUFF Store kullaniciyi rahatsiz etmedi.",
        "workflow_events": workflow_events,
        "tool_calls": tool_calls,
        "model_trace": model_trace,
        "source_status": source_status,
        "latency_ms": total_latency_ms,
        "business_impact": {
            "cart_total": cart_total,
            "discount_amount": discount_amount,
            "new_total": new_total,
            "recovered_revenue": new_total if intervention_required else 0,
            "monthly_recovery_projection": round(monthly_recovery_projection, 2),
            "avoided_unnecessary_popup": not intervention_required,
        },
        "guardrails": {
            "risk_threshold": 60,
            "max_discount_ratio": 0.20,
            "margin_protection_triggered": bool(
                coupon_details and coupon_details.get("margin_protection_triggered")
            ),
        },
    }

    log_agent_analysis(analysis)
    automation = dispatch_automation(analysis)
    analysis["automation"] = automation
    if automation["status"] == "sent":
        analysis["workflow_events"].append("n8n automation webhook sent")
    elif automation["configured"]:
        analysis["workflow_events"].append(f"n8n automation {automation['status']}")

    return analysis


def run_demo():
    print("--- BUFF Store Multi-Agent Demo Basliyor ---")

    mock_user_data = {
        "user_id": "usr_9988",
        "idle_time_seconds": 95,
        "cart_items": [
            {"id": "p101", "name": "BUFF Aura Watch Pro", "price": 18999},
            {"id": "p102", "name": "BUFF Pulse Watch Air", "price": 10999},
        ],
        "cart_total": 29998,
        "mouse_movements": "low",
        "scroll_depth": 72,
        "exit_intent": False,
    }

    result = run_cartcoach_analysis(mock_user_data)

    print("\n================== ISLEM SONUCU ==================")
    print(f"Musteri ID: {result.get('user_id')}")
    print(f"Risk Skoru: {result.get('risk_score')}/100")
    print(f"Kullanici Profili: {result.get('user_profile')}")
    print("\nWorkflow:")
    for event in result.get("workflow_events") or []:
        print(f"  - {event}")
    print(f"\nPopup Mesaji:\n{result.get('final_message')}")
    print("==================================================")


if __name__ == "__main__":
    if not os.environ.get("GOOGLE_API_KEY"):
        print(
            "Uyari: GOOGLE_API_KEY bulunamadi. Fallback mod calisabilir, "
            "Gemini ciktisi icin .env dosyasini ayarlayin."
        )
    run_demo()
