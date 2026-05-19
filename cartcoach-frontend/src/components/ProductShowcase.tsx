'use client';

import { motion } from 'framer-motion';
import { Bot, Check, Plus, Search, Sparkles, Star } from 'lucide-react';
import type { CartItemData } from '@/types';

interface ProductShowcaseProps {
  products: CartItemData[];
  cartIds: string[];
  categories: string[];
  selectedCategory: string;
  rerankMessages?: Record<string, string>;
  onSelectCategory: (category: string) => void;
  onAddToCart: (product: CartItemData) => void;
  onAskAi: (product: CartItemData) => void | Promise<void>;
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString('tr-TR')} TL`;
}

export function ProductShowcase({
  products,
  cartIds,
  categories,
  selectedCategory,
  rerankMessages = {},
  onSelectCategory,
  onAddToCart,
  onAskAi,
}: ProductShowcaseProps) {
  return (
    <section id="buff-products" className="mb-14 scroll-mt-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase text-primary-700">
            BUFF curated tech · {products.length} urun
          </p>
          <h2 className="text-4xl font-black leading-none text-foreground md:text-6xl">
            Akilli cihaz vitrini.
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-neutral-600 shadow-xs backdrop-blur">
          <Search className="h-3.5 w-3.5 text-primary-700" />
          Moment search · compare · quick add
        </div>
      </div>

      <div className="mb-5 overflow-hidden rounded-full border border-neutral-950/10 bg-white/55 py-2 backdrop-blur">
        <div className="buff-marquee gap-3 px-3 text-sm font-black uppercase text-neutral-800">
          {[
            'Focused setup',
            'Creator desk',
            'Travel light',
            'Gaming night',
            'Deep work',
            'Premium audio',
            'AI bundle',
            'Focused setup',
            'Creator desk',
            'Travel light',
            'Gaming night',
            'Deep work',
            'Premium audio',
            'AI bundle',
          ].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-[#c0dbff]/70 px-4 py-2"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                active
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-950/10 bg-white/72 text-neutral-700 hover:border-primary-300 hover:bg-white'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product, index) => {
          const inCart = cartIds.includes(product.id);
          const featured = index === 0;

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.04 }}
              className={`product-spotlight group relative overflow-hidden rounded-[1.75rem] border bg-white/82 p-4 shadow-card backdrop-blur ${
                featured
                  ? 'border-primary-200 sm:col-span-2 xl:col-span-1'
                  : 'border-neutral-200'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/35 blur-3xl" />
                <div className="absolute -bottom-16 left-6 h-36 w-36 rounded-full bg-fuchsia-200/30 blur-3xl" />
              </div>

              <div className="relative">
                <div className="mb-4 overflow-hidden rounded-[1.35rem] bg-[#c0dbff]">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="editorial-product-image h-64 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>

                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-neutral-950/10 bg-[#fbf9eb] px-3 py-1 text-[10px] font-black uppercase text-neutral-800">
                    {product.badge ?? 'Premium pick'}
                  </span>
                  <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-black uppercase text-white">
                    {product.category ?? 'Tech'}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {product.rating?.toFixed(1) ?? '4.8'}
                  <span className="text-neutral-400">/ 5</span>
                </div>

                <h3 className="min-h-[3.25rem] text-xl font-black leading-snug text-foreground">
                  {product.name}
                </h3>
                <p className="mt-2 min-h-[3rem] text-sm leading-6 text-neutral-500">
                  {product.feature}
                </p>

                <div className="my-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase text-neutral-500">
                    <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                    AI hint
                  </div>
                  <p className="text-xs font-semibold leading-5 text-neutral-700">
                    {rerankMessages[product.id] ?? product.aiHint}
                  </p>
                </div>

                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-neutral-400">
                      {product.stockSignal ?? 'Stokta'}
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className={`inline-flex min-h-touch items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition active:scale-[0.98] ${
                      inCart
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-neutral-950 text-white hover:bg-primary-700'
                    }`}
                  >
                    {inCart ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {inCart ? 'Sepette' : 'Sepete ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void onAskAi(product)}
                    className="inline-flex min-h-touch w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 active:scale-[0.98]"
                    aria-label={`${product.name} icin AI oneri al`}
                  >
                    <Bot className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
