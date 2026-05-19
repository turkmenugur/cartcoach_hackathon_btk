# BUFF Store Supabase AI Data Layer

Bu proje artik Supabase varsa gercek veriye, yoksa deterministic fallback veriye gore calisir.

## Neden Supabase?

- Kullanici gecmisi daha tutarli olur.
- Urun ozellikleri ve review ozetleri tek yerden okunur.
- Kuponlar ve agent karar loglari kaydedilir.
- n8n kullanmadan da automation outbox mantigi kurulabilir.

## Ortam Degiskenleri

Backend kok dizindeki `.env` icine:

```env
SUPABASE_URL=https://egshytpkqjgxupoxzunz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Sadece okuma yapmak istersen:

```env
SUPABASE_ANON_KEY=...
```

Yazma islemleri icin `SUPABASE_SERVICE_ROLE_KEY` gerekir. Bu key frontend'e konmamalidir.

## Tablolar

SQL dosyasi:

```text
supabase/schema.sql
```

Ana tablolar:

- `buff_user_profiles`: kullanici gecmisi ve segment.
- `buff_products`: urun katalog/spec/marj/stok.
- `buff_product_review_summaries`: review/sentiment/kalite ozetleri.
- `buff_offer_policies`: maksimum indirim ve kupon kurallari.
- `buff_bundle_rules`: tamamlayici urun onerileri.
- `buff_coupons`: uretilen kupon loglari.
- `buff_agent_events`: her agent analizinin tam kaydi.
- `buff_automation_outbox`: n8n olmadan otomasyon kuyrugu.

## Agent Tool Akisi

1. `get_user_abandonment_history`
   - Supabase'den kullanici gecmisi okur.
   - Yoksa stabil fallback kullanir.

2. `get_product_comparison_details`
   - Urun spec ve fiyat farklarini getirir.

3. `summarize_product_reviews`
   - Review ozetlerini Strategist agent'a verir.

4. `get_bundle_recommendations`
   - Sepetteki urunlere gore tamamlayici bundle onerir.

5. `generate_dynamic_coupon`
   - `buff_offer_policies` ile max indirim uygular.
   - Kuponu `buff_coupons` tablosuna yazar.

6. `log_agent_analysis`
   - Agent sonucunu `buff_agent_events` tablosuna kaydeder.

7. `enqueue_automation_event`
   - `buff_automation_outbox` tablosuna pending event yazar.
   - Bu tabloyu ileride n8n, Supabase Edge Function veya cron okuyabilir.

## Demo Kontrolu

Backend calisirken:

```bash
curl http://127.0.0.1:8000/health
```

Beklenen:

```json
{
  "ok": true,
  "service": "buff-store-agent-api",
  "supabase_configured": true
}
```

Ek endpointler:

```bash
curl http://127.0.0.1:8000/products
curl http://127.0.0.1:8000/agent-events
curl http://127.0.0.1:8000/automation-outbox
curl -X POST http://127.0.0.1:8000/process-automation
```

`/products` Supabase'de urun bulursa onu kullanir. Supabase urunleri eksikse backend eksik kayitlari kendi 36 urunluk demo katalogundan tamamlar; bu nedenle vitrin ve agent akisi yarim seed yuzunden bozulmaz.

## 36 Urunluk Katalog Seed

Supabase'e 36 urunluk katalogu basmak icin:

```bash
python3 scripts/seed_supabase_catalog.py
```

Beklenen cikti:

```text
seeded_products=36
```

Bu islemden sonra `/products` cevabinda `source: "supabase"` ve 36 urun beklenir.

## Automation Processor

`buff_automation_outbox` icindeki `pending` kayitlari islemek icin:

```bash
curl -X POST http://127.0.0.1:8000/process-automation
```

Bu demo processor kayitlari `processed` durumuna alir ve `processed_at` alanini doldurur. Ileride ayni mantik Supabase Edge Function, n8n veya cron job olarak tasinabilir.
