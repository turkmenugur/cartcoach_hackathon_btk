import random
from typing import Dict, Any, List

def get_user_abandonment_history(user_id: str) -> Dict[str, Any]:
    """
    Kullanıcının geçmiş sepet terk etme geçmişini ve sadakat bilgilerini sorgular.
    Bu araç, Analyst ajanının risk skorunu daha doğru belirlemesi için kullanılır.
    """
    print(f"\n[Tool Use] get_user_abandonment_history çalıştırılıyor (Parametre: user_id={user_id})")
    
    # Gerçekçi mock veri havuzu
    mock_db = {
        "usr_9988": {
            "past_purchases": 5,
            "abandoned_carts_count": 8,
            "abandonment_rate": 61.5,
            "loyalty_segment": "Silver",
            "preferred_category": "Electronics"
        },
        "usr_1234": {
            "past_purchases": 12,
            "abandoned_carts_count": 2,
            "abandonment_rate": 14.2,
            "loyalty_segment": "Gold",
            "preferred_category": "Home Decor"
        }
    }
    
    # Eğer kullanıcı DB'de yoksa rastgele gerçekçi bir değer ata
    return mock_db.get(user_id, {
        "past_purchases": random.randint(0, 3),
        "abandoned_carts_count": random.randint(2, 6),
        "abandonment_rate": round(random.uniform(40.0, 80.0), 1),
        "loyalty_segment": "Bronze",
        "preferred_category": "General"
    })

def generate_dynamic_coupon(cart_total: float, discount_ratio: float, strategy_type: str) -> Dict[str, Any]:
    """
    Kullanıcının sepet toplamına ve seçilen stratejiye göre marj korumalı dinamik kupon üretir.
    Bu araç, Strategist ajanının teklifi kişiselleştirmesi için kullanılır.
    """
    print(f"\n[Tool Use] generate_dynamic_coupon çalıştırılıyor (Parametreler: total={cart_total}, ratio={discount_ratio}, strategy={strategy_type})")
    
    # Marj Koruma Kontrolü: İndirim oranı %20'den fazlaysa güvenlik nedeniyle %20'ye sınırla
    actual_ratio = min(discount_ratio, 0.20)
    discount_amount = round(cart_total * actual_ratio, 2)
    new_total = round(cart_total - discount_amount, 2)
    
    coupon_code = f"CART{int(actual_ratio * 100)}{random.randint(10, 99)}"
    
    return {
        "success": True,
        "coupon_code": coupon_code,
        "discount_ratio": actual_ratio,
        "discount_amount": discount_amount,
        "new_total": new_total,
        "expires_in_minutes": 15,
        "margin_protection_triggered": discount_ratio > 0.20
    }

def get_product_comparison_details(product_ids: List[str]) -> Dict[str, Any]:
    """
    Sepetteki ürünlerin teknik özelliklerini ve fiyat kıyaslamalarını getirir.
    Bu araç, kararsız kullanıcılara Dilemma Resolver (Kararsızlık Savar) stratejisi sunmak için kullanılır.
    """
    print(f"\n[Tool Use] get_product_comparison_details çalıştırılıyor (Parametre: product_ids={product_ids})")
    
    # Mock ürün veritabanı
    product_db = {
        "p123": {
            "name": "Apple Watch Series 9",
            "price": 14999,
            "specs": {
                "Ekran": "Her Zaman Açık Retina (2000 nit)",
                "İşlemci": "S9 SiP",
                "Batarya Ömrü": "18 saat normal, 36 saat düşük güç modu",
                "Öne Çıkan Özellik": "Çift Dokunuş Hareketi (Double Tap)"
            }
        },
        "p124": {
            "name": "Apple Watch SE (2. Nesil)",
            "price": 9499,
            "specs": {
                "Ekran": "Retina Ekran (1000 nit)",
                "İşlemci": "S8 SiP",
                "Batarya Ömrü": "18 saat normal",
                "Öne Çıkan Özellik": "Fiyat/Performans Odaklı"
            }
        }
    }
    
    comparison = {}
    for pid in product_ids:
        if pid in product_db:
            comparison[product_db[pid]["name"]] = product_db[pid]
            
    return {
        "comparison_found": len(comparison) > 0,
        "products": comparison,
        "verdict": "Series 9, her zaman açık ekran ve gelişmiş sağlık sensörleri (EKG, Kanda Oksijen) arayanlar için idealdir. SE ise temel akıllı saat özelliklerini bütçe dostu sunar."
    }
