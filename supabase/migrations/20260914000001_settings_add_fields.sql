-- Add fields that existed in the old localStorage AppSettings but were missing from the
-- initial settings table: custom_gemini_key (optional per-user Gemini key override) and
-- user_name (consultant name, distinct from agency_name).
alter table public.settings
  add column if not exists custom_gemini_key text not null default '',
  add column if not exists user_name text not null default '';
