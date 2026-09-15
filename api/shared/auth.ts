import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY as string;

interface AuthedRequest {
  userId: string;
  supabase: SupabaseClient;
}

function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers['authorization'];
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;
  const match = value.match(/^Bearer (.+)$/i);
  return match ? match[1] : null;
}

// Validates the Supabase JWT sent by the client and returns a client scoped to that
// user's session (so RLS-protected queries like `subscriptions` work as that user).
export async function requireUser(req: VercelRequest, res: VercelResponse): Promise<AuthedRequest | null> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Não autenticado. Faça login novamente.' });
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
    return null;
  }

  return { userId: data.user.id, supabase };
}

// Same as requireUser, but also requires an active paid subscription for AI-cost endpoints.
export async function requireActiveSubscription(
  req: VercelRequest,
  res: VercelResponse
): Promise<AuthedRequest | null> {
  const auth = await requireUser(req, res);
  if (!auth) return null;

  const { data } = await auth.supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', auth.userId)
    .eq('status', 'active')
    .maybeSingle();

  if (!data) {
    res.status(403).json({
      error: 'Assinatura ativa necessária para usar a geração com IA. Assine um plano para continuar.',
    });
    return null;
  }

  return auth;
}
