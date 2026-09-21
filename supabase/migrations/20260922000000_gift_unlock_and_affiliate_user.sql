-- Two changes.
--
-- 1. When the gift opens is now stored explicitly instead of being derived from
--    when it was granted. The two are no longer the same: an admin handing it
--    out opens it immediately, while a purchase opens it six days later. Keeping
--    only gift_granted_at forced a choice between backdating it (a lie, and it
--    would re-lock if the waiting period ever changed) and losing the instant
--    case entirely.
--
-- 2. Affiliates can point at an existing account, so they are picked from the
--    user list rather than typed in by hand.

alter table public.profiles
  add column if not exists gift_unlocks_at timestamptz;

-- Anyone already holding a gift keeps exactly the schedule they had.
update public.profiles
set gift_unlocks_at = gift_granted_at + interval '6 days'
where gift_granted_at is not null
  and gift_unlocks_at is null;

alter table public.affiliates
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists affiliates_user_id_idx
  on public.affiliates (user_id);
