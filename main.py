import io
import os
import sys
from typing import Any, Dict

from dotenv import load_dotenv
from langgraph.graph import END, StateGraph

from agents import AgentState, analyst_agent, strategist_agent, synthesizer_agent


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
        "final_message": None,
        "workflow_events": ["Telemetry captured"],
    }

    app = build_cartcoach_graph()
    result = app.invoke(initial_state)

    risk_score = result.get("risk_score") or 0
    intervention_required = risk_score > 60
    workflow_events = list(result.get("workflow_events") or [])

    if intervention_required:
        workflow_events.insert(2, "Router selected intervention path")
    else:
        workflow_events.append("Router ended workflow: no intervention")

    return {
        "user_id": result.get("user_id"),
        "risk_score": risk_score,
        "user_profile": result.get("user_profile"),
        "intervention_required": intervention_required,
        "strategy": result.get("strategy"),
        "coupon_details": result.get("coupon_details"),
        "comparison_data": result.get("comparison_data"),
        "final_message": result.get("final_message")
        or "Risk dusuk oldugu icin CartCoach kullaniciyi rahatsiz etmedi.",
        "workflow_events": workflow_events,
    }


def run_demo():
    print("--- CartCoach Multi-Agent Demo Basliyor ---")

    mock_user_data = {
        "user_id": "usr_9988",
        "idle_time_seconds": 95,
        "cart_items": [
            {"id": "p123", "name": "Apple Watch Series 9", "price": 14999},
            {"id": "p124", "name": "Apple Watch SE (2. Nesil)", "price": 9499},
        ],
        "cart_total": 24498,
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
