-- Gift access: set when an admin releases the bonus course for a user.
-- The Presente tab stays locked (blurred) until 6 days after this timestamp.
alter table public.profiles
  add column if not exists gift_granted_at timestamptz;
