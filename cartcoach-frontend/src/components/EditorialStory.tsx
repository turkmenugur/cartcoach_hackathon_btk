'use client';

import { motion } from 'framer-motion';
import { Bot, MousePointerClick, Search, ShieldCheck } from 'lucide-react';

export function EditorialStory() {
  return (
    <section className="mb-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="overflow-hidden rounded-[2rem] border border-neutral-950/10 bg-neutral-950 text-white shadow-card"
      >
        <div className="grid min-h-[420px]">
          <div className="p-7 md:p-9">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-cyan-100">
              <Bot className="h-3.5 w-3.5" />
              BUFF AI Coach
            </p>
            <h2 className="text-4xl font-black leading-none md:text-6xl">
              Bu sistem ne yapıyor?
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              BUFF Store normal bir teknoloji magazasi gibi calisir. Fark su:
              kullanici sepette kararsiz kalirsa, fiyat nedeniyle cikacak gibi
              olursa veya benzer urunler arasinda takilirsa Gemini destekli
              ajanlar devreye girer.
            </p>
            <div className="mt-7 grid gap-3">
              {[
                'Risk dusukse kullanici rahatsiz edilmez.',
                'Risk yuksekse uygun kupon, karsilastirma veya bundle onerisi uretilir.',
                'Indirim her zaman marj koruma limitiyle sinirlanir.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-neutral-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {[
          {
            icon: Search,
            title: '1. Urun kesfi',
            text: 'Kullanici teknoloji urunlerini kategori, ihtiyac ve butceye gore inceler.',
          },
          {
            icon: MousePointerClick,
            title: '2. Davranis sinyali',
            text: 'Idle sure, sepet tutari, cikis niyeti ve urun benzerligi takip edilir.',
          },
          {
            icon: Bot,
            title: '3. Gemini agent karari',
            text: 'Analyst risk skorunu uretir; Strategist teklif veya karsilastirma secer.',
          },
          {
            icon: ShieldCheck,
            title: '4. Guvenli teklif',
            text: 'Synthesizer kullaniciya kisa teklif yazar; marj limiti asilmadan gosterilir.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-[1.5rem] border border-neutral-950/10 bg-white/76 p-5 shadow-card backdrop-blur"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#c0dbff] text-neutral-950">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
          </article>
        ))}
      </motion.div>
    </section>
  );
}
