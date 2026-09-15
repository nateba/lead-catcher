-- LeadSite AI SaaS foundation: profiles, subscriptions, leads, recent_searches, settings
-- All user-owned tables use Row Level Security scoped to auth.uid().

-- 1. profiles -----------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_name text not null default '',
  agency_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, user_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'user_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. subscriptions --------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('mensal', 'vitalicio')),
  status text not null check (status in ('active', 'canceled', 'refunded')),
  provider text not null default 'kirvano',
  provider_sale_id text unique,
  next_charge_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;

-- Users can only READ their own subscription rows.
-- Writes happen exclusively via the Kirvano webhook function using the service role key,
-- which bypasses RLS entirely - no insert/update/delete policy is granted to regular users.
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 3. leads (replaces localStorage SavedLead[]) -----------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead jsonb not null,
  site_data jsonb,
  custom_colors jsonb,
  status text not null default 'NOVO',
  deal_value numeric,
  lost_reason text,
  meeting_info jsonb,
  outreach_message text,
  notes text default '',
  notes_list jsonb not null default '[]'::jsonb,
  activities jsonb not null default '[]'::jsonb,
  follow_up jsonb,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  lost_at timestamptz
);

create index if not exists leads_user_id_idx on public.leads(user_id);

alter table public.leads enable row level security;

create policy "leads_select_own"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "leads_insert_own"
  on public.leads for insert
  with check (auth.uid() = user_id);

create policy "leads_update_own"
  on public.leads for update
  using (auth.uid() = user_id);

create policy "leads_delete_own"
  on public.leads for delete
  using (auth.uid() = user_id);

-- 4. recent_searches --------------------------------------------------------
create table if not exists public.recent_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  state text not null,
  category_key text not null,
  category_label text not null,
  radius_km numeric not null,
  "limit" integer not null,
  created_at timestamptz not null default now()
);

create index if not exists recent_searches_user_id_idx on public.recent_searches(user_id);

alter table public.recent_searches enable row level security;

create policy "recent_searches_select_own"
  on public.recent_searches for select
  using (auth.uid() = user_id);

create policy "recent_searches_insert_own"
  on public.recent_searches for insert
  with check (auth.uid() = user_id);

create policy "recent_searches_delete_own"
  on public.recent_searches for delete
  using (auth.uid() = user_id);

-- 5. settings -----------------------------------------------------------
create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  overpass_server text not null default 'auto',
  dark_mode boolean not null default false,
  onboarding_completed boolean not null default false,
  agency_name text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings_select_own"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "settings_insert_own"
  on public.settings for insert
  with check (auth.uid() = user_id);

create policy "settings_update_own"
  on public.settings for update
  using (auth.uid() = user_id);
