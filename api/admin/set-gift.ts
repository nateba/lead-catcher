import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Inlined rather than imported from ../shared/*: Vercel's function bundler
// fails to resolve relative imports that cross up out of a nested api/
// subdirectory (same ERR_MODULE_NOT_FOUND issue hit by api/webhooks/applyfy.ts).
function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !serviceKey) {
    throw new Error('VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas no servidor.');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers['authorization'];
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return null;
  const match = value.match(/^Bearer (.+)$/i);
  return match ? match[1] : null;
}

async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse
): Promise<{ userId: string; supabase: SupabaseClient } | null> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Não autenticado. Faça login novamente.' });
    return null;
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL as string,
    process.env.VITE_SUPABASE_ANON_KEY as string,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    res.status(401).json({ error: 'Sessão inválida ou expirada. Faça login novamente.' });
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    res.status(403).json({ error: 'Acesso restrito a administradores.' });
    return null;
  }

  return { userId: userData.user.id, supabase };
}

// Releases (or revokes) the bonus course for one user.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireAdmin(req, res);
  if (!auth) return;

  const { userId, granted } = (req.body || {}) as { userId?: string; granted?: boolean };
  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório.' });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from('profiles')
    .update({ gift_granted_at: granted ? new Date().toISOString() : null })
    .eq('id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
