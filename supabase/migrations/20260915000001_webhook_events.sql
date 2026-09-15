-- Durable log of every raw webhook payload received (Applyfy, and future providers).
-- Lets us inspect real payload shapes after a live test fire, and re-process if needed.
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  raw jsonb not null,
  processed boolean not null default false,
  processing_note text,
  created_at timestamptz not null default now()
);

create index if not exists webhook_events_provider_idx on public.webhook_events(provider, created_at desc);

alter table public.webhook_events enable row level security;
-- No policies: only the service role (used by the webhook function) can read/write this table.
