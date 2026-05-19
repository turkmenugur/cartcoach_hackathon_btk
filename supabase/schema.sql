-- BUFF Store clean Supabase setup
-- Paste this whole file into Supabase SQL Editor and run once.
-- Warning: this resets only BUFF Store demo tables.

drop table if exists buff_automation_outbox cascade;
drop table if exists buff_agent_events cascade;
drop table if exists buff_coupons cascade;
drop table if exists buff_bundle_rules cascade;
drop table if exists buff_product_review_summaries cascade;
drop table if exists buff_offer_policies cascade;
drop table if exists buff_products cascade;
drop table if exists buff_user_profiles cascade;

create table buff_user_profiles (
  user_id text primary key,
  past_purchases integer not null default 0,
  abandoned_carts_count integer not null default 0,
  abandonment_rate numeric not null default 0,
  loyalty_segment text not null default 'Bronze',
  preferred_category text not null default 'General',
  average_order_value numeric not null default 0,
  return_rate numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table buff_products (
  product_id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  margin_ratio numeric not null default 0.25,
  inventory_count integer not null default 0,
  specs jsonb not null default '{}'::jsonb,
  image_url text,
  icon_key text,
  badge text,
  feature text,
  rating numeric,
  stock_signal text,
  ai_hint text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table buff_product_review_summaries (
  id bigserial primary key,
  product_id text not null references buff_products(product_id) on delete cascade,
  quality_score numeric not null default 0,
  sentiment_score numeric not null default 0,
  top_praise text,
  top_complaint text,
  review_summary text,
  created_at timestamptz not null default now()
);

create table buff_offer_policies (
  id bigserial primary key,
  strategy_type text not null unique,
  max_discount_ratio numeric not null default 0.20,
  expires_in_minutes integer not null default 15,
  coupon_prefix text not null default 'BUFF',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table buff_bundle_rules (
  id bigserial primary key,
  trigger_product_id text not null references buff_products(product_id) on delete cascade,
  bundle_name text not null,
  recommendation text not null,
  expected_lift_ratio numeric not null default 0.08,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table buff_coupons (
  id bigserial primary key,
  user_id text,
  coupon_code text not null,
  discount_ratio numeric not null,
  requested_discount_ratio numeric,
  discount_amount numeric not null,
  new_total numeric not null,
  expires_in_minutes integer not null default 15,
  margin_protection_triggered boolean not null default false,
  source text not null default 'supabase',
  created_at timestamptz not null default now()
);

create table buff_agent_events (
  id bigserial primary key,
  user_id text,
  risk_score integer,
  user_profile text,
  intervention_required boolean,
  source_status text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table buff_automation_outbox (
  id bigserial primary key,
  event_type text not null,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_buff_agent_events_created_at
  on buff_agent_events(created_at desc);

create index idx_buff_outbox_status_created_at
  on buff_automation_outbox(status, created_at);

insert into buff_user_profiles (
  user_id,
  past_purchases,
  abandoned_carts_count,
  abandonment_rate,
  loyalty_segment,
  preferred_category,
  average_order_value,
  return_rate
) values
  ('usr_9988', 5, 8, 61.5, 'Silver', 'Wearable', 18950, 6.8),
  ('usr_1234', 12, 2, 14.2, 'Gold', 'Desk', 24990, 2.1);

insert into buff_offer_policies (
  strategy_type,
  max_discount_ratio,
  expires_in_minutes,
  coupon_prefix,
  is_active
) values
  ('CartAbandonmentPrevention', 0.20, 15, 'BUFF', true),
  ('HighIntentBundle', 0.12, 20, 'BUNDLE', true);

insert into buff_products (
  product_id,
  name,
  category,
  price,
  margin_ratio,
  inventory_count,
  specs,
  image_url,
  icon_key,
  badge,
  feature,
  rating,
  stock_signal,
  ai_hint
) values
  (
    'p101',
    'BUFF Aura Watch Pro',
    'Wearable',
    18999,
    0.34,
    8,
    '{"Ekran":"microLED","Batarya":"36 saat","Odak":"Premium saglik sensorleri"}'::jsonb,
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
    'watch-series',
    'Son 8 urun',
    'Titanyum kasa, microLED ekran ve gelismis saglik sensorleri',
    4.8,
    'Sinirli stok',
    'Karsilastirma, yorum ozeti ve marj korumali kuponla karar verir.'
  ),
  (
    'p102',
    'BUFF Pulse Watch Air',
    'Wearable',
    10999,
    0.29,
    24,
    '{"Ekran":"AMOLED","Batarya":"7 gun","Odak":"Fiyat performans"}'::jsonb,
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80',
    'watch-se',
    'Hizli teslimat',
    'Hafif govde, 7 gun pil hedefi ve fiyat performans odakli akilli saat',
    4.6,
    'Premium stok',
    'Fiyat hassasiyeti olan kullanici icin alternatif olarak onerilir.'
  ),
  (
    'p103',
    'BUFF NeonBook Pro X',
    'Laptop',
    62999,
    0.22,
    5,
    '{"Ekran":"16 inc OLED","Islemci":"AI NPU","Batarya":"18 saat"}'::jsonb,
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    'laptop-pro',
    'Studio bundle',
    'OLED ekran, AI hizlandiricili NPU ve 18 saat pil omru',
    4.7,
    'Sinirli stok',
    'Yuksek sepet tutarinda taksit, bundle ve guven sinyali kullanilir.'
  ),
  (
    'p104',
    'BUFF SonicPods Max',
    'Audio',
    14999,
    0.38,
    18,
    '{"Ses":"Adaptif ANC","Batarya":"42 saat","Odak":"Premium audio"}'::jsonb,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    'audio-max',
    'Yeni seri',
    'Adaptif ANC, kayipsiz ses profili ve 42 saat pil',
    4.7,
    'Bugun kargoda',
    'Laptop ve telefon sepetlerinde tamamlayici urun olarak calisir.'
  ),
  (
    'p106',
    'BUFF Titan Phone Ultra',
    'Phone',
    48999,
    0.34,
    10,
    '{"Kamera":"Periskop kamera","Baglanti":"Uydu baglantisi","Odak":"Cihaz ici AI fotograf motoru"}'::jsonb,
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    'smartphone',
    'Trade-in uygun',
    'Periskop kamera, uydu baglantisi ve cihaz ici AI fotograf motoru',
    4.8,
    'Premium stok',
    'Yuksek fiyatli telefon sepetinde trade-in ve bundle stratejisi kullanilir.'
  );

insert into buff_product_review_summaries (
  product_id,
  quality_score,
  sentiment_score,
  top_praise,
  top_complaint,
  review_summary
) values
  ('p101', 9.2, 0.88, 'Premium malzeme ve sensor kalitesi', 'Fiyat yuksek algilaniyor', 'Premium saat isteyenler memnun; fiyat itirazi kuponla azalir.'),
  ('p102', 8.7, 0.84, 'Hafiflik ve pil omru', 'Premium sensor eksigi', 'Fiyat performans kullanicilari icin guclu alternatif.'),
  ('p103', 9.1, 0.86, 'OLED ekran ve performans', 'Yuksek sepet tutari', 'Taksit ve bundle onerisiyle ikna sansi artar.'),
  ('p104', 8.9, 0.82, 'ANC ve pil omru', 'Kulak pedleri pahali', 'Laptop ve telefon sepetlerinde tamamlayici teklif olarak iyi calisir.'),
  ('p106', 9.0, 0.85, 'Kamera ve ekran kalitesi', 'Fiyat bariyeri', 'Trade-in ve aksesuar bundle ile karar vermesi kolaylasir.');

insert into buff_bundle_rules (
  trigger_product_id,
  bundle_name,
  recommendation,
  expected_lift_ratio
) values
  ('p103', 'Creator Desk Boost', 'NeonBook Pro X yanina SonicPods Max ve StudioLight Pro oner.', 0.14),
  ('p106', 'Mobile Pro Kit', 'Titan Phone Ultra yanina AirCharge Stand ve SonicBuds Lite oner.', 0.11),
  ('p101', 'Wellness Kit', 'Aura Watch Pro yanina AirCharge Stand ve Aura Ring oner.', 0.09);
