import { createClient } from '@supabase/supabase-js';

// Service-role client: bypasses RLS entirely. Only ever used server-side
// (webhooks, admin tasks) — this key must never reach the browser bundle.
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !serviceKey) {
    throw new Error('VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas no servidor.');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
