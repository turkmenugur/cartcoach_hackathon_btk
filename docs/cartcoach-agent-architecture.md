# CartCoach Agent Architecture

Bu doküman CartCoach'un agentic mimarisini ve sistem tasarımını detaylandırır. Amaç, projenin basit bir chatbot değil; telemetriye göre karar alan, araç kullanan, maliyet kontrollü ve durum tabanlı bir multi-agent sistem olduğunu açıklamaktır.

Uygulama seviyesindeki node geçişleri, handoff payloadları, fallback davranışları ve demo senaryoları için tamamlayıcı doküman: [`cartcoach-workflow-contract.md`](cartcoach-workflow-contract.md)

## Mimari Desen

CartCoach için en uygun desen **router kontrollü sequential pipeline** modelidir.

1. **Analyst Agent** kullanıcı davranışını ve geçmişini analiz eder.
2. **Risk Router** risk düşükse akışı sonlandırır, risk yüksekse müdahale başlatır.
3. **Strategist Agent** kupon, pazarlık veya ürün kıyaslama stratejisini seçer.
4. **Synthesizer Agent** seçilen stratejiyi kısa, anlaşılır ve kullanıcı dostu pop-up mesajına çevirir.

Bu desen hackathon için idealdir çünkü hem agentic yapı açıkça görünür hem de gereksiz model çağrılarını engelleyerek performans ve maliyet optimizasyonu gösterir.

## Ajan Rolleri

### Analyst Agent

**Kimlik:** Davranış analisti ve terk riski sınıflandırıcısı.

**Girdi:** Idle süresi, sepet toplamı, ürünler, imleç/scroll davranışı, geçmiş terk oranı.

**Çıktı:**

```json
{
  "risk_score": 85,
  "user_profile": "fiyat duyarlı"
}
```

**Başarı kriteri:** Risk skorunu 0-100 arasında üretir ve kullanıcı profilini karar verilebilir bir etikete indirger: `fiyat duyarlı`, `kararsız`, `sadık`, `odaklanmış`, `analiz edilemedi`.

**Tool erişimi:** `get_user_abandonment_history`.

### Risk Router

**Kimlik:** Maliyet ve müdahale kontrol noktası.

**Kural:** `risk_score > 60` ise Strategist çalışır. Aksi halde akış biter.

**Tasarım Değeri:** Her ziyaretçiye pahalı AI üretimi yapılmaz. CartCoach önce risk sinyali arar, sonra sadece gerekli anda müdahale eder.

### Strategist Agent

**Kimlik:** Otonom kampanya ve satış stratejisti.

**Girdi:** Risk skoru, kullanıcı profili, sepet toplamı, ürün listesi.

**Kararlar:**

- Kullanıcı fiyat duyarlıysa dinamik kupon üretir.
- Kullanıcı kararsızsa ürün karşılaştırma aracını çalıştırır.
- Risk çok yüksekse daha güçlü teklif üretir.
- Marj koruma sınırına takılan indirimleri güvenli seviyeye indirir.

**Tool erişimi:** `generate_dynamic_coupon`, `get_product_comparison_details`.

**Başarı kriteri:** Strateji kullanıcı profiliyle uyumludur, işletmenin marj limitini aşmaz, teklif gerekçesini açıklayabilir.

### Synthesizer Agent

**Kimlik:** Marka tonuna uygun iletişim ajanı.

**Girdi:** Strategist raporu, kupon bilgisi, ürün kıyaslama verisi.

**Çıktı:** Kullanıcıya gösterilecek kısa pop-up mesajı.

**Başarı kriteri:** Mesaj 3-4 cümleyi aşmaz, CTA nettir, kupon varsa kod ve süre görünür, kararsızlık varsa kıyaslama sonucu anlaşılırdır.

## Paylaşılan State Sözleşmesi

Mevcut `AgentState` doğru yönde kurulmuş. Hackathon demosu için state alanları şöyle anlatılmalı:

| Alan | Amaç |
| --- | --- |
| `user_data` | Frontend telemetri ve sepet verisi |
| `user_id` | Geçmiş davranış sorgusu |
| `risk_score` | Sepet terk riski |
| `user_profile` | Kullanıcı niyeti / davranış segmenti |
| `strategy` | Ajanın seçtiği ikna planı |
| `coupon_details` | Marj korumalı dinamik teklif |
| `comparison_data` | Kararsızlık savar ürün kıyaslaması |
| `final_message` | Pop-up'ta gösterilecek nihai mesaj |

## Araç Tasarımı

### `get_user_abandonment_history`

Risk skoruna bağlam ekler. Demo için mock veri yeterli, ancak README'de bunun gerçek sistemde CRM/CDP veya e-ticaret veritabanına bağlanacağı belirtilmeli.

### `generate_dynamic_coupon`

İş değerini en iyi gösteren araçtır. Mutlaka demo sırasında görünür olmalı:

- Sepet toplamı
- İndirim oranı
- Yeni toplam
- Kupon kodu
- Marj koruma tetiklendi mi?

### `get_product_comparison_details`

Yenilikçilik puanını güçlendirir. CartCoach sadece indirim dağıtan bir sistem değil, karar felcini çözen alışveriş koçu gibi konumlanır.

## Guardrail Tasarımı

Hackathon için minimum güvenlik ve kalite sınırları:

- İndirim oranı işletme marj limitini aşamaz.
- Model çıktısı JSON beklenen yerde JSON olarak doğrulanır.
- API hatasında demo çökmek yerine fallback mesaj gösterilir.
- Pop-up rahatsız edici sıklıkta gösterilmez.
- Kullanıcı verisi demo ortamında anonim tutulur.
- Gemini ana model olarak net biçimde kullanılır.

## Başarı Metrikleri

Sistemin başarısını ölçen temel kriterler ve doğrulamalar:

| Değerlendirme Kriteri | CartCoach Uygulaması |
| --- | --- |
| Kullanıcı Değeri | Sepet terk riskini erken yakalar, gelir kurtarma sağlar |
| Teknik Yetkinlik | LangGraph state machine, router, typed state, tool calls |
| Performans ve Doğruluk | Risk düşükse akış biter, gereksiz Gemini çağrısı engellenir |
| Ajan Yapıları | 3 ajan + router + tool kullanımı |
| Yenilikçilik | Dinamik pazarlık + kararsızlık savar + sade mod |
| Kullanıcı Dostu Çalışma | Pop-up, sade mod, net ödeme akışı |
| İzlenebilirlik | Telemetri paneli ve ajan karar günlüğü |

## Demo Hikayesi

1. Kullanıcı iki ürünü sepette inceler.
2. Telemetri paneli idle süresinin arttığını gösterir.
3. Analyst risk skorunu üretir.
4. Router risk yüksek olduğu için Strategist'i çağırır.
5. Strategist kararsızlık ve fiyat hassasiyeti sinyallerine göre kupon ve kıyaslama üretir.
6. Synthesizer kullanıcıya kısa, kişisel ve süreli teklif mesajı gösterir.
7. Dashboard tarafında kurtarılan sepet ve tahmini ROI görünür.

## Mevcut Eksikler

1. Frontend pop-up şu an backend agent çıktısına bağlı değil; mock mesaj gösteriyor.
2. Backend yalnızca terminal demosu olarak çalışıyor; frontend için API endpoint yok.
3. Agent karar günlüğü UI'da görünmüyor.
4. Düşük risk senaryosu, yüksek risk senaryosu ve kararsız kullanıcı senaryosu ayrı demo akışları olarak paketlenmemiş.
5. Fallback davranışı kodda sınırlı; Gemini hatasında kullanıcı dostu demo çıktısı garanti edilmeli.
6. README teknik anlatımı güçlü ama teslim checklist'i ve demo senaryosu daha net olmalı.

## Öncelikli Uygulama Planı

1. Backend'i frontend'in çağırabileceği `/analyze-cart` tarzı bir endpoint'e dönüştür.
2. Frontend pop-up mesajını mock metin yerine agent sonucundan besle.
3. Demo paneline risk skoru, profil, çağrılan araçlar, kupon ve final mesaj alanlarını ekle.
4. Üç hazır demo persona oluştur: fiyat duyarlı, kararsız, düşük risk.
5. Gemini hatası için deterministic fallback ekle.
6. README'e "Agentic Architecture" ve "1 Dakikalık Demo Akışı" bölümü ekle.
