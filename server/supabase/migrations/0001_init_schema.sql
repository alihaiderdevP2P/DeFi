-- Initial Supabase schema for crowdfunding backend.
-- Safe to run multiple times (uses IF NOT EXISTS where possible).

begin;

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  created_at timestamptz not null default now(),
  constraint users_wallet_lowercase_chk
    check (wallet_address = lower(wallet_address))
);

create table if not exists public.campaigns (
  id bigint generated always as identity primary key,
  onchain_campaign_id bigint not null unique,
  owner_wallet text not null,
  title text not null,
  description text not null,
  goal_eth numeric not null check (goal_eth > 0),
  deadline timestamptz not null,
  image_url text,
  created_at timestamptz not null default now(),
  constraint campaigns_owner_wallet_fk
    foreign key (owner_wallet) references public.users(wallet_address)
    on update cascade
    on delete restrict
);

create table if not exists public.donations (
  id bigint generated always as identity primary key,
  campaign_id bigint not null references public.campaigns(id) on delete cascade,
  onchain_campaign_id bigint not null,
  donor_wallet text not null,
  amount_eth numeric not null check (amount_eth > 0),
  tx_hash text,
  created_at timestamptz not null default now(),
  constraint donations_donor_wallet_lowercase_chk
    check (donor_wallet = lower(donor_wallet))
);

create index if not exists campaigns_owner_wallet_idx
  on public.campaigns(owner_wallet);

create index if not exists campaigns_created_at_idx
  on public.campaigns(created_at desc);

create index if not exists donations_campaign_id_idx
  on public.donations(campaign_id);

create index if not exists donations_onchain_campaign_id_idx
  on public.donations(onchain_campaign_id);

create unique index if not exists donations_tx_hash_unique_idx
  on public.donations(tx_hash)
  where tx_hash is not null;

-- Ensure storage bucket exists for campaign images.
insert into storage.buckets (id, name, public)
values ('campaign-images', 'campaign-images', true)
on conflict (id) do update set public = excluded.public;

commit;
