-- BUFF Store customer memory migration
-- Run this in Supabase SQL Editor if the main schema was already created.

create table if not exists buff_customer_memory (
  user_id text primary key references buff_user_profiles(user_id) on delete cascade,
  preferred_categories jsonb not null default '[]'::jsonb,
  price_sensitivity numeric not null default 0.5,
  coupon_affinity numeric not null default 0.5,
  payment_preference text not null default 'card',
  delivery_preference text not null default 'standard',
  brand_affinity text not null default 'balanced',
  purchase_cadence_days integer not null default 30,
  recent_purchases jsonb not null default '[]'::jsonb,
  behavior_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into buff_customer_memory (
  user_id,
  preferred_categories,
  price_sensitivity,
  coupon_affinity,
  payment_preference,
  delivery_preference,
  brand_affinity,
  purchase_cadence_days,
  recent_purchases,
  behavior_tags
) values
  (
    'usr_9988',
    '["Wearable", "Audio", "Accessory"]'::jsonb,
    0.82,
    0.76,
    'installment',
    'fast',
    'premium-but-deal-driven',
    28,
    '[{"product_id":"p110","name":"BUFF AirCharge Stand","price":3999},{"product_id":"p113","name":"BUFF SonicBuds Lite","price":5499}]'::jsonb,
    '["kararsiz", "kuponla doner", "wellness odakli"]'::jsonb
  ),
  (
    'usr_1234',
    '["Desk", "Laptop", "Camera"]'::jsonb,
    0.32,
    0.18,
    'card',
    'standard',
    'premium-first',
    18,
    '[{"product_id":"p123","name":"BUFF StudioLight Pro","price":6499},{"product_id":"p126","name":"BUFF Router Mesh","price":6999}]'::jsonb,
    '["sadik", "creator desk", "premium tercih"]'::jsonb
  )
on conflict (user_id) do update set
  preferred_categories = excluded.preferred_categories,
  price_sensitivity = excluded.price_sensitivity,
  coupon_affinity = excluded.coupon_affinity,
  payment_preference = excluded.payment_preference,
  delivery_preference = excluded.delivery_preference,
  brand_affinity = excluded.brand_affinity,
  purchase_cadence_days = excluded.purchase_cadence_days,
  recent_purchases = excluded.recent_purchases,
  behavior_tags = excluded.behavior_tags,
  updated_at = now();
