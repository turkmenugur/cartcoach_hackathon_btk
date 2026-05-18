import json
from typing import Any, Dict, List, Optional, TypedDict

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from tools import (
    generate_dynamic_coupon,
    get_product_comparison_details,
    get_user_abandonment_history,
)


class AgentState(TypedDict, total=False):
    user_data: Dict[str, Any]
    user_id: Optional[str]
    risk_score: Optional[int]
    user_profile: Optional[str]
    strategy: Optional[str]
    coupon_details: Optional[Dict[str, Any]]
    comparison_data: Optional[Dict[str, Any]]
    final_message: Optional[str]
    workflow_events: List[str]


def append_event(state: AgentState, event: str) -> List[str]:
    events = list(state.get("workflow_events") or [])
    events.append(event)
    return events


def clamp_risk_score(value: Any) -> int:
    try:
        score = int(value)
    except (TypeError, ValueError):
        score = 50
    return max(0, min(100, score))


def calculate_fallback_risk(
    user_data: Dict[str, Any],
    history: Dict[str, Any],
) -> Dict[str, Any]:
    score = 10
    idle_seconds = int(user_data.get("idle_time_seconds") or 0)
    cart_items = user_data.get("cart_items") or []
    abandonment_rate = float(history.get("abandonment_rate") or 0)

    if idle_seconds >= 60:
        score += 40
    elif idle_seconds >= 20:
        score += 20

    if abandonment_rate >= 50:
        score += 25

    if len(cart_items) >= 2:
        score += 15

    if user_data.get("exit_intent"):
        score += 20

    profile = "kararsiz" if len(cart_items) >= 2 else "fiyat duyarli"
    if abandonment_rate < 25 and idle_seconds < 20:
        profile = "odaklanmis"

    return {
        "risk_score": clamp_risk_score(score),
        "user_profile": profile,
    }


def get_llm(temperature: float = 0.4) -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=temperature,
        max_retries=2,
    )


def analyst_agent(state: AgentState) -> AgentState:
    print("\n[Analyst Agent] Musteri verileri ve hareketleri analiz ediliyor...")

    user_data = state.get("user_data", {})
    user_id = user_data.get("user_id", "usr_demo")
    history = get_user_abandonment_history(user_id)

    llm = get_llm(temperature=0.4)
    parser = JsonOutputParser()
    prompt = ChatPromptTemplate.from_template(
        "Sen e-ticaret siteleri icin calisan analitik bir uzmansin.\n"
        "Anlik kullanici davranisini ve gecmis alisveris/terk gecmisini incele.\n"
        "Sepet terk etme risk skorunu 0-100 arasinda uret ve kullanici profilini belirle.\n"
        "Profil etiketlerinden birini kullan: fiyat duyarli, kararsiz, sadik, odaklanmis.\n\n"
        "Anlik Kullanici Davranisi:\n{user_data}\n\n"
        "Kullanici Gecmisi:\n{user_history}\n\n"
        "Yalnizca su JSON formatinda cevap ver:\n"
        "{{\n  \"risk_score\": 85,\n  \"user_profile\": \"fiyat duyarli\"\n}}"
    )

    chain = prompt | llm | parser

    try:
        result = chain.invoke(
            {
                "user_data": json.dumps(user_data, ensure_ascii=False),
                "user_history": json.dumps(history, ensure_ascii=False),
            }
        )
        risk_score = clamp_risk_score(result.get("risk_score", 0))
        user_profile = str(result.get("user_profile") or "bilinmiyor")
        event = f"Analyst calculated risk: {risk_score}/100 ({user_profile})"
    except Exception as exc:
        print(f"[Analyst Error]: {exc}")
        fallback = calculate_fallback_risk(user_data, history)
        risk_score = fallback["risk_score"]
        user_profile = fallback["user_profile"]
        event = f"Analyst fallback risk: {risk_score}/100 ({user_profile})"

    return {
        "user_id": user_id,
        "risk_score": risk_score,
        "user_profile": user_profile,
        "workflow_events": append_event(state, event),
    }


def strategist_agent(state: AgentState) -> AgentState:
    print("\n[Strategist Agent] Ikna ve kupon stratejisi belirleniyor...")

    user_profile = (state.get("user_profile") or "").lower()
    risk_score = clamp_risk_score(state.get("risk_score"))
    user_data = state.get("user_data", {})
    cart_total = float(user_data.get("cart_total") or 0)
    cart_items = user_data.get("cart_items") or []
    product_ids = [item.get("id") for item in cart_items if item.get("id")]

    coupon_details = None
    comparison_data = None

    if "karars" in user_profile and len(product_ids) >= 2:
        comparison_data = get_product_comparison_details(product_ids)

    if "fiyat" in user_profile or risk_score > 70:
        discount_ratio = 0.10 if risk_score <= 85 else 0.15
        if risk_score > 95:
            discount_ratio = 0.25
        coupon_details = generate_dynamic_coupon(
            cart_total,
            discount_ratio,
            "CartAbandonmentPrevention",
        )

    llm = get_llm(temperature=0.7)
    prompt = ChatPromptTemplate.from_template(
        "Sen CartCoach sisteminin otonom kampanya ve satis stratejistisin.\n"
        "Kullanici sepeti terk etmek uzere. Ona akillica bir teklif veya bilgi sunarak ikna etmeliyiz.\n\n"
        "Veriler:\n"
        "- Musteri Profili: {user_profile}\n"
        "- Terk Etme Riski: {risk_score}/100\n"
        "- Sepet Toplami: {cart_total} TL\n"
        "- Uretilen Kupon: {coupon_details}\n"
        "- Urun Kiyaslamasi: {comparison_data}\n\n"
        "Gorevin: Kisa ve uygulanabilir bir ikna stratejisi yaz. "
        "Kupon varsa kodu ve indirimi dahil et. Kiyaslama varsa karar felcini azaltacak detayi dahil et."
    )

    coupon_code = coupon_details.get("coupon_code", "YOK") if coupon_details else "YOK"
    chain = prompt | llm | StrOutputParser()

    try:
        strategy_result = chain.invoke(
            {
                "user_profile": user_profile,
                "risk_score": risk_score,
                "cart_total": cart_total,
                "coupon_details": json.dumps(coupon_details, ensure_ascii=False)
                if coupon_details
                else "Yok",
                "comparison_data": json.dumps(comparison_data, ensure_ascii=False)
                if comparison_data
                else "Yok",
            }
        )
    except Exception as exc:
        print(f"[Strategist Error]: {exc}")
        if coupon_details:
            strategy_result = (
                f"{coupon_code} kupon kodunu ve {coupon_details['discount_amount']} TL indirimi "
                "15 dakika gecerli kisisel teklif olarak sun."
            )
        elif comparison_data:
            strategy_result = (
                "Kullaniciya iki urun arasindaki temel farki kisa ve tarafsiz bicimde ozetle."
            )
        else:
            strategy_result = (
                "Kullaniciya sepetini tamamlamasi icin nazik, baskisiz ve kisa bir destek mesaji sun."
            )

    event_parts = ["Strategist selected intervention"]
    if coupon_details:
        event_parts.append(f"coupon {coupon_details['coupon_code']}")
    if comparison_data:
        event_parts.append("comparison")

    return {
        "strategy": strategy_result,
        "coupon_details": coupon_details,
        "comparison_data": comparison_data,
        "workflow_events": append_event(state, " + ".join(event_parts)),
    }


def synthesizer_agent(state: AgentState) -> AgentState:
    print("\n[Synthesizer Agent] Son pop-up teklif mesaji hazirlaniyor...")

    user_profile = state.get("user_profile")
    strategy = state.get("strategy")
    coupon_details = state.get("coupon_details")
    comparison_data = state.get("comparison_data")
    coupon_code = coupon_details.get("coupon_code", "") if coupon_details else ""

    llm = get_llm(temperature=0.8)
    prompt = ChatPromptTemplate.from_template(
        "Sen bir e-ticaret sitesinde musterinin karsisina cikan zeki, samimi ve ikna edici bir asistansin.\n"
        "Asagidaki stratejiyi kisa, etkili ve eyleme geciren bir pop-up mesajina donustur.\n\n"
        "Musteri Profili: {user_profile}\n"
        "Strateji: {strategy}\n"
        "Kupon Bilgisi: {coupon_details}\n"
        "Urun Kiyaslama: {comparison_data}\n\n"
        "Kurallar:\n"
        "1. Dogrudan musteriye hitap et.\n"
        "2. Maksimum 3 cumle yaz.\n"
        "3. Kupon varsa kodu ve 15 dakika gecerli oldugunu belirt.\n"
        "4. Teknik log veya ic sistem detayi yazma."
    )

    chain = prompt | llm | StrOutputParser()

    try:
        message = chain.invoke(
            {
                "user_profile": user_profile,
                "strategy": strategy,
                "coupon_details": json.dumps(coupon_details, ensure_ascii=False)
                if coupon_details
                else "Yok",
                "comparison_data": json.dumps(comparison_data, ensure_ascii=False)
                if comparison_data
                else "Yok",
            }
        )
    except Exception as exc:
        print(f"[Synthesizer Error]: {exc}")
        if coupon_code:
            minutes = coupon_details.get("expires_in_minutes", 15) if coupon_details else 15
            message = (
                f"Sepetiniz icin size ozel {coupon_code} kodunu hazirladik. "
                f"Bu teklif {minutes} dakika gecerli. Hazirsaniz sepetinizi birlikte tamamlayalim."
            )
        else:
            message = (
                "Sepetinizdeki urunler icin size yardimci olacak kisa bir oneri hazirladik. "
                "Isterseniz karar vermenizi kolaylastiracak karsilastirmayi gosterebiliriz."
            )

    return {
        "final_message": message,
        "workflow_events": append_event(state, "Synthesizer prepared popup message"),
    }
