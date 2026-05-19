# BUFF Store Frontend

Next.js tabanli premium teknoloji e-ticaret demosu. Bu ekran, BUFF Store backend agent API'sinden gelen sepet terk riski analizini kullanarak juriye agentic karar akisini gosterir.

## Calistirma

```bash
npm install
npm run dev
```

Arayuz varsayilan olarak `http://localhost:3000` adresinde acilir.

Backend varsayilan adresi:

```env
NEXT_PUBLIC_BUFF_STORE_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CARTCOACH_API_URL=http://127.0.0.1:8000
```

## Onemli Ekranlar

- **BUFF Hero:** Awwwards ilhamli grid, scanline ve premium cihaz paneliyle ilk etkiyi kurar.
- **Product Showcase:** Teknoloji urun vitrini, sepete ekleme ve urun bazli AI analiz aksiyonlarini sunar.
- **Demo Scenario Bar:** Fiyat riski, kararsizlik, marj koruma ve dusuk risk senaryolarini tetikler.
- **Judge Mode Panel:** Telemetri, router karari, tool call listesi, Gemini live/fallback durumu, latency, guardrail, n8n ve ROI bilgisini gosterir.
- **Agent Popup:** Synthesizer agent'in musteriye gosterdigi nihai teklif mesajini, kuponu ve karar destek metnini sunar.
- **Telemetry Panel:** Idle davranisini ve risk tetiklenmesini canli gosterir.
- **Sade Mod:** Kullanici dikkatini odeme akisi uzerinde toplamak icin sade checkout deneyimi sunar.

## Demo Akisi

1. Backend'i proje kokunden baslatin:

```bash
python api_server.py
```

2. Frontend'i baslatin:

```bash
npm run dev
```

3. Juri demosunda sirasiyla su butonlari kullanin:

- `Dusuk risk`: Router akisi sonlandirir, gereksiz popup yoktur.
- `Kararsizlik`: Kiyaslama tool'u calisir.
- `Fiyat riski`: Dinamik kupon uretilir.
- `Marj koruma`: Indirim limiti asilirsa guardrail devreye girer.

4. Sayfayi sifirlayip 5 saniye bekleyin. Idle telemetry backend agent analizini otomatik tetikler.

## Build Kontrolu

```bash
npm run build
```

Bu komut TypeScript, lint ve production build kontrolu icin kullanilir.
