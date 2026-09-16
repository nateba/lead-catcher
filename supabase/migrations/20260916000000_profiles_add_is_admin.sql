-- Admin flag for the internal admin panel: lets staff view/override user
-- subscriptions (e.g. when a webhook fails to activate a paid account).
alter table public.profiles
  add column if not exists is_admin boolean not null default false;
