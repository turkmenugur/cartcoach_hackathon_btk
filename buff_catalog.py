from typing import Any, Dict, List


PRODUCT_IMAGE_URLS: Dict[str, str] = {
    "p101": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80",
    "p102": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80",
    "p103": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    "p104": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    "p105": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
    "p106": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    "p107": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    "p108": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    "p109": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "p110": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
    "p111": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    "p112": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    "p113": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=80",
    "p114": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    "p115": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80",
    "p116": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=80",
    "p117": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    "p118": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80",
    "p119": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    "p120": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
    "p121": "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=900&q=80",
    "p122": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    "p123": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    "p124": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    "p125": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
    "p126": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    "p127": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    "p128": "https://images.unsplash.com/photo-1603539444875-76e7684265f6?auto=format&fit=crop&w=900&q=80",
    "p129": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    "p130": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
    "p131": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=900&q=80",
    "p132": "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=900&q=80",
    "p133": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
    "p134": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    "p135": "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
    "p136": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
}


PRODUCT_SEEDS = [
    ("p101", "BUFF Aura Watch Pro", 18999, "Wearable", "watch-series", "Son 8 urun", "Titanyum kasa, microLED ekran ve gelismis saglik sensorleri"),
    ("p102", "BUFF Pulse Watch Air", 10999, "Wearable", "watch-se", "Hizli teslimat", "Hafif govde, 7 gun pil hedefi ve fiyat/performans odakli akilli saat"),
    ("p103", "BUFF NeonBook Pro X", 62999, "Laptop", "laptop-pro", "Studio bundle", "OLED ekran, AI hizlandiricili NPU ve 18 saat pil omru"),
    ("p104", "BUFF SonicPods Max", 14999, "Audio", "audio-max", "Yeni seri", "Adaptif ANC, kayipsiz ses profili ve 42 saat pil"),
    ("p105", "BUFF PlayDock 5", 25999, "Gaming", "console", "Game pass hediyeli", "4K cloud gaming dock ve dusuk gecikme modu"),
    ("p106", "BUFF Titan Phone Ultra", 48999, "Phone", "smartphone", "Trade-in uygun", "Periskop kamera, uydu baglantisi ve cihaz ici AI fotograf motoru"),
    ("p107", "BUFF FrameCam Creator", 32999, "Camera", "camera-pro", "Creator pick", "4K video, renk profilleri ve yapay zeka netleme"),
    ("p108", "BUFF Keys Studio", 5999, "Accessory", "laptop-pro", "Sessiz switch", "Aluminyum mekanik klavye ve premium masa hissi"),
    ("p109", "BUFF DeskHub 12", 7999, "Desk", "laptop-pro", "USB-C hub", "12 port dock, 8K cikis ve hizli sarj destegi"),
    ("p110", "BUFF AirCharge Stand", 3999, "Accessory", "smartphone", "3 cihaz", "Telefon, saat ve kulaklik icin tek manyetik sarj standi"),
    ("p111", "BUFF MiniBook Air", 38999, "Laptop", "laptop-pro", "Travel light", "1 kg altinda hafif kasa ve tum gun pil"),
    ("p112", "BUFF WorkPad OLED", 22999, "Desk", "smartphone", "Not alma", "OLED tablet, kalem destegi ve kreatif is akisi"),
    ("p113", "BUFF SonicBuds Lite", 5499, "Audio", "audio-max", "Gunluk", "Hafif ANC kulaklik ve uzun pil omru"),
    ("p114", "BUFF SonicBar Mini", 8999, "Audio", "audio-max", "Ev sinema", "Kompakt soundbar ve dusuk gecikmeli oyun modu"),
    ("p115", "BUFF GamePad Elite", 4299, "Gaming", "console", "Pro kontrol", "Hall effect analoglar ve ayarlanabilir tetikler"),
    ("p116", "BUFF CloudStick", 6999, "Gaming", "console", "Mobil oyun", "Bulut oyun icin elde tasinir kontrol cihazi"),
    ("p117", "BUFF Titan Phone Mini", 32999, "Phone", "smartphone", "Kompakt", "Kucuk govde, amiral gemisi kamera ve hizli sarj"),
    ("p118", "BUFF Titan Fold", 71999, "Phone", "smartphone", "Katlanabilir", "Buyuk ekranli katlanabilir telefon ve multitasking modu"),
    ("p119", "BUFF Aura Ring", 7999, "Wearable", "watch-series", "Wellness", "Uyku, nabiz ve stres takibi icin minimal akilli yuzuk"),
    ("p120", "BUFF Trail Watch", 16999, "Wearable", "watch-se", "Outdoor", "GPS, pusula ve 10 ATM dayaniklilik"),
    ("p121", "BUFF FrameCam Pocket", 18999, "Camera", "camera-pro", "Vlog", "Kompakt kamera, flip ekran ve hizli transfer"),
    ("p122", "BUFF LensKit Creator", 11999, "Camera", "camera-pro", "Lens pack", "Mobil ve kamera cekimleri icin kreatif lens seti"),
    ("p123", "BUFF StudioLight Pro", 6499, "Desk", "camera-pro", "Creator desk", "Ayarlanabilir renk isisi ve masaustu yayin isigi"),
    ("p124", "BUFF FocusLamp", 2999, "Desk", "laptop-pro", "Deep work", "Parlama azaltan masa lambasi ve odak modu"),
    ("p125", "BUFF SecureCam 2K", 4999, "Camera", "camera-pro", "Home tech", "2K guvenlik kamerasi ve akilli hareket algilama"),
    ("p126", "BUFF Router Mesh", 6999, "Desk", "laptop-pro", "Wi-Fi 7", "Mesh ag, dusuk gecikme ve akilli cihaz onceligi"),
    ("p127", "BUFF PowerBank Graphene", 3499, "Accessory", "smartphone", "Travel", "Hizli sarj, dusuk isi ve kompakt govde"),
    ("p128", "BUFF CableKit Pro", 1999, "Accessory", "smartphone", "Organizer", "USB-C kablo seti ve manyetik tasima kutusu"),
    ("p129", "BUFF Monitor 5K", 44999, "Desk", "laptop-pro", "5K studio", "5K ekran, renk dogrulugu ve USB-C tek kablo baglanti"),
    ("p130", "BUFF ErgoChair Flow", 18999, "Desk", "laptop-pro", "Ergonomi", "Uzun calisma icin nefes alan premium ofis koltugu"),
    ("p131", "BUFF VR Lens", 27999, "Gaming", "console", "Immersive", "Yuksek cozunurluklu VR deneyimi ve el takibi"),
    ("p132", "BUFF StreamDeck Nano", 4999, "Gaming", "console", "Yayin", "Kisayol tuslari, sahne kontrolu ve kreatif makrolar"),
    ("p133", "BUFF StudioMic X", 8999, "Audio", "audio-max", "Podcast", "USB-C mikrofon, temiz vokal ve masustu stand"),
    ("p134", "BUFF SleepBuds Calm", 4499, "Audio", "audio-max", "Uyku", "Gece kullanimi icin hafif kulaklik ve pasif izolasyon"),
    ("p135", "BUFF HomePod Mini X", 6999, "Audio", "audio-max", "Akilli ev", "Oda dolusu ses ve akilli ev kontrolu"),
    ("p136", "BUFF Creator Backpack", 5999, "Accessory", "laptop-pro", "Carry", "Laptop, kamera ve aksesuarlar icin premium sirt cantasi"),
]


def _specs_for(category: str, feature: str) -> Dict[str, str]:
    return {
        "Kategori": category,
        "Odak": feature,
        "AI sinyali": "Sepet davranisi, fiyat hassasiyeti, stok ve yorum ozetiyle karar verir.",
    }


def get_catalog_products() -> List[Dict[str, Any]]:
    products: List[Dict[str, Any]] = []
    for index, (product_id, name, price, category, icon, badge, feature) in enumerate(PRODUCT_SEEDS):
        products.append(
            {
                "product_id": product_id,
                "name": name,
                "category": category,
                "price": price,
                "margin_ratio": round(0.22 + ((index % 6) * 0.025), 3),
                "inventory_count": 4 + ((index * 7) % 29),
                "specs": _specs_for(category, feature),
                "image_url": PRODUCT_IMAGE_URLS[product_id],
                "icon_key": icon,
                "badge": badge,
                "feature": feature,
                "rating": round(4.5 + ((index % 5) * 0.1), 1),
                "stock_signal": "Sinirli stok"
                if index % 4 == 0
                else "Bugun kargoda"
                if index % 3 == 0
                else "Premium stok",
                "ai_hint": "Yuksek tutarda taksit, bundle ve marj korumali teklif stratejisi uretilir."
                if category == "Laptop" or price > 30000
                else "Kullanici niyetine gore karsilastirma, alternatif veya tamamlayici urun onerilir.",
                "is_active": True,
            }
        )
    return products


CATALOG_PRODUCTS = get_catalog_products()
CATALOG_BY_ID = {product["product_id"]: product for product in CATALOG_PRODUCTS}
