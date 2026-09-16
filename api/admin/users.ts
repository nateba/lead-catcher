import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../shared/auth';
import { getSupabaseAdmin } from '../shared/supabaseAdmin';

interface SubscriptionRow {
  user_id: string;
  plan: string;
  status: string;
  provider: string;
  updated_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const auth = await requireAdmin(req, res);
  if (!auth) return;

  const admin = getSupabaseAdmin();

  const { data: usersPage, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (usersError) {
    return res.status(500).json({ error: usersError.message });
  }

  const { data: subscriptions, error: subsError } = await admin
    .from('subscriptions')
    .select('user_id, plan, status, provider, updated_at')
    .order('updated_at', { ascending: false });
  if (subsError) {
    return res.status(500).json({ error: subsError.message });
  }

  const { data: profiles } = await admin.from('profiles').select('id, is_admin');
  const adminIds = new Set((profiles || []).filter((p: any) => p.is_admin).map((p: any) => p.id));

  const subsByUser = new Map<string, SubscriptionRow[]>();
  for (const sub of (subscriptions || []) as SubscriptionRow[]) {
    const list = subsByUser.get(sub.user_id) || [];
    list.push(sub);
    subsByUser.set(sub.user_id, list);
  }

  const users = (usersPage?.users || [])
    .map((u) => {
      const subs = subsByUser.get(u.id) || [];
      const activeSub = subs.find((s) => s.status === 'active');
      const latestSub = subs[0];
      return {
        id: u.id,
        email: u.email || '',
        createdAt: u.created_at,
        isAdmin: adminIds.has(u.id),
        subscriptionStatus: activeSub?.status || latestSub?.status || null,
        plan: activeSub?.plan || latestSub?.plan || null,
        provider: activeSub?.provider || latestSub?.provider || null,
      };
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return res.status(200).json({ users });
}
