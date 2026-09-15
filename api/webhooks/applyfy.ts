import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

// Maps the two known Applyfy offer codes to our internal plan ids.
const OFFER_TO_PLAN: Record<string, 'mensal' | 'vitalicio'> = {
  YKR5ZRD: 'mensal',
  SPN02ZK: 'vitalicio',
  cmu2vbt1y0jqv01pwpekeuyx2: 'mensal',
  cmu2wb7u50l9201oh3jbdn2dn: 'vitalicio',
};

const APPROVED_HINTS = ['aprov', 'approved', 'paid', 'pago', 'completed', 'confirmad'];
const REVOKE_HINTS = ['reembols', 'refund', 'chargeback', 'estorn', 'cancel', 'recus', 'refused', 'expired', 'expirad'];

function firstString(...candidates: any[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return undefined;
}

function deepFind(obj: any, keys: string[], depth = 0): any {
  if (!obj || typeof obj !== 'object' || depth > 4) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = deepFind(value, keys, depth + 1);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const token = req.query.token;
  if (!token || token !== process.env.APPLYFY_WEBHOOK_TOKEN) {
    return res.status(401).json({ error: 'Token inválido.' });
  }

  let body: any = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = { raw: body };
    }
  }

  const admin = getSupabaseAdmin();

  // 1. Always log the raw payload first — this is our source of truth to refine
  // field extraction once we've seen real Applyfy traffic.
  const { data: eventRow } = await admin
    .from('webhook_events')
    .insert({ provider: 'applyfy', raw: body })
    .select('id')
    .single();

  try {
    const email = firstString(
      deepFind(body, ['email', 'customer_email', 'buyer_email'])
    );
    const eventLabel = (
      firstString(deepFind(body, ['event', 'type', 'event_type', 'status', 'transaction_status'])) || ''
    ).toLowerCase();
    const offerCode = firstString(
      deepFind(body, ['offer_code', 'offer', 'offerId', 'offer_id', 'product_id', 'productId'])
    );
    const saleId = firstString(
      deepFind(body, ['id', 'order_id', 'sale_id', 'transaction_id', 'orderId', 'saleId'])
    );

    const isApproved = APPROVED_HINTS.some((h) => eventLabel.includes(h));
    const isRevoked = REVOKE_HINTS.some((h) => eventLabel.includes(h));
    const plan = offerCode ? OFFER_TO_PLAN[offerCode] : undefined;

    if (!email) {
      await admin
        .from('webhook_events')
        .update({ processed: false, processing_note: 'sem e-mail identificável no payload' })
        .eq('id', eventRow?.id);
      return res.status(200).json({ received: true, matched: false });
    }

    // Find the Supabase auth user by email (small user base — paginate if this grows).
    const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const users = usersPage?.users || [];
    const user = users.find((u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      await admin
        .from('webhook_events')
        .update({ processed: false, processing_note: `nenhum usuário encontrado para ${email}` })
        .eq('id', eventRow?.id);
      return res.status(200).json({ received: true, matched: false });
    }

    if (isApproved) {
      await admin.from('subscriptions').upsert(
        {
          user_id: user.id,
          plan: plan || 'mensal',
          status: 'active',
          provider: 'applyfy',
          provider_sale_id: saleId || `applyfy_${user.id}_${Date.now()}`,
        },
        { onConflict: 'provider_sale_id' }
      );
    } else if (isRevoked) {
      await admin
        .from('subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    await admin
      .from('webhook_events')
      .update({
        processed: true,
        processing_note: `email=${email} event=${eventLabel || 'desconhecido'} plan=${plan || 'n/a'} approved=${isApproved} revoked=${isRevoked}`,
      })
      .eq('id', eventRow?.id);

    return res.status(200).json({ received: true, matched: true });
  } catch (err: any) {
    await admin
      .from('webhook_events')
      .update({ processed: false, processing_note: `erro: ${err?.message || err}` })
      .eq('id', eventRow?.id);
    // Still 200 — we don't want Applyfy disabling the webhook over our own parsing bugs.
    return res.status(200).json({ received: true, error: true });
  }
}
