import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../shared/auth';
import { getSupabaseAdmin } from '../shared/supabaseAdmin';

const VALID_STATUSES = ['active', 'canceled', 'refunded'];
const VALID_PLANS = ['mensal', 'vitalicio'];

// Manual override for when a payment webhook fails, a refund needs recording,
// or an account is being comped — used exclusively by the admin panel.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireAdmin(req, res);
  if (!auth) return;

  const { userId, status, plan } = (req.body || {}) as {
    userId?: string;
    status?: string;
    plan?: string;
  };

  if (!userId || !status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'userId e status válido (active/canceled/refunded) são obrigatórios.' });
  }
  if (plan && !VALID_PLANS.includes(plan)) {
    return res.status(400).json({ error: 'plano inválido (mensal/vitalicio).' });
  }

  const admin = getSupabaseAdmin();

  const { data: existing, error: findError } = await admin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    return res.status(500).json({ error: findError.message });
  }

  if (existing) {
    const { error } = await admin
      .from('subscriptions')
      .update({ status, ...(plan ? { plan } : {}), updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) return res.status(500).json({ error: error.message });
  } else {
    const { error } = await admin.from('subscriptions').insert({
      user_id: userId,
      plan: plan || 'mensal',
      status,
      provider: 'manual',
      provider_sale_id: `manual_${userId}_${Date.now()}`,
    });
    if (error) return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
