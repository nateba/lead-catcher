import { supabase } from './supabaseClient';

// Attaches the current Supabase session's JWT so our /api/* serverless functions
// can identify the caller (and, for AI endpoints, check their subscription status).
export async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
