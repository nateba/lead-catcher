-- Affiliate landing pages.
--
-- Each affiliate gets a random slug (/a/<slug>) that serves the normal landing
-- with their own checkout links swapped in. Commission tracking stays with
-- Applyfy/Cakto: their links already carry the affiliate code, so all this
-- table does is remember which link belongs to whom.

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  -- Random, not the person's name: visitors should not be able to tell they
  -- are on an affiliate's page.
  slug text not null unique,
  name text not null,
  checkout_mensal text,
  checkout_vitalicio text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists affiliates_slug_active_idx
  on public.affiliates (slug) where active;

alter table public.affiliates enable row level security;

-- Admins manage these straight from the panel with their own session. A plain
-- table needs no service-role endpoint, which also keeps us under Vercel's
-- 12-function limit on Hobby.
drop policy if exists "admins manage affiliates" on public.affiliates;
create policy "admins manage affiliates" on public.affiliates
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Visitors never select from the table: that would let anyone dump every
-- affiliate and their links, which defeats the point of random slugs. They call
-- this instead, one slug at a time, and it returns nothing for unknown or
-- deactivated slugs so the page falls back to the owner's own checkout.
create or replace function public.affiliate_by_slug(p_slug text)
returns table (slug text, checkout_mensal text, checkout_vitalicio text)
language sql
security definer
stable
set search_path = public
as $$
  select a.slug, a.checkout_mensal, a.checkout_vitalicio
  from public.affiliates a
  where a.slug = p_slug
    and a.active
$$;

revoke all on function public.affiliate_by_slug(text) from public;
grant execute on function public.affiliate_by_slug(text) to anon, authenticated;
