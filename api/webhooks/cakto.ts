import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'crypto';

// NOTE: `export const config = { api: { bodyParser: false } }` is a Next.js
// convention; Vercel Functions ignore it and still attach the body helpers, so
// the raw stream may already be drained by the time this runs. The handler
// therefore reads the raw bytes when it can and falls back to the parsed
// `req.body`, verifying by Cakto's body `secret` in that case — HMAC needs the
// exact bytes and a re-serialized object would not reproduce them.

// Inlined rather than imported from ../shared/*: Vercel's function bundler
// fails to resolve relative imports that cross up out of this nested
// api/webhooks/ directory (ERR_MODULE_NOT_FOUND at runtime).
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

// Assigned to accounts auto-created on first payment so the buyer can log in
// immediately; they're expected to change it from Configurações afterwards.
const DEFAULT_PASSWORD = 'hypeleads123';

/**
 * Cakto's event catalog, matched exactly rather than by substring.
 *
 * Substring matching is what makes the Applyfy handler fragile here:
 * "subscription_renewal_refused" and "purchase_refused" both contain "refus"
 * but mean very different things, and "subscription_late_recovered" contains no
 * approval hint at all despite restoring access.
 */
const GRANTS = new Set([
  'purchase_approved',
  'subscription_created',
  'subscription_renewed',
  'subscription_resumed',
  'subscription_late_recovered',
]);

const REVOKES = new Set([
  'refund',
  'chargeback',
  'subscription_canceled',
  'subscription_renewal_refused',
  'subscription_paused',
]);

/**
 * Logged and acknowledged, but they change nothing.
 *
 * `purchase_refused` is deliberately here: a declined attempt never granted
 * anything, and revoking on it would cancel a plan the buyer already owns if
 * some later, unrelated purchase of theirs fails.
 *
 * `subscription_late` is a transient state that `subscription_late_recovered`
 * clears, so it is a grace period, not a cancellation.
 */
const NO_ACTION = new Set([
  'checkout_abandonment',
  'purchase_refused',
  'subscription_late',
  'pix_gerado',
  'boleto_gerado',
  'picpay_gerado',
  'openfinance_nubank_gerado',
]);

/**
 * Raw bytes if the stream is still readable, else '' — the platform may have
 * consumed it already to populate `req.body`.
 */
function readRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve) => {
    if ((req as any).readableEnded || (req as any).complete) return resolve('');
    const chunks: Buffer[] = [];
    // A drained stream never emits 'end', so never hang the function on it.
    const done = setTimeout(() => resolve(''), 1500);
    req.on('data', (c: Buffer) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => {
      clearTimeout(done);
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', () => {
      clearTimeout(done);
      resolve('');
    });
  });
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Header signature is `v1=<hex hmac of "{timestamp}.{raw body}">`. */
function signatureMatches(raw: string, timestamp: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  const received = signature.startsWith('v1=') ? signature.slice(3) : signature;
  return safeEqual(expected, received);
}

function firstString(...candidates: any[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return undefined;
}

/** Offer ids that mean "lifetime", as a comma-separated env var. */
function offerIdsFrom(name: string): string[] {
  return (process.env[name] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'CAKTO_WEBHOOK_SECRET não configurada no servidor.' });
  }

  const raw = await readRawBody(req);

  let body: any;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: 'Corpo não é JSON válido.' });
    }
  } else {
    // Stream already drained by the platform helpers — use what they parsed.
    body = typeof req.body === 'string' ? safeJson(req.body) : req.body;
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Corpo ausente ou não é JSON.' });
  }

  // Cakto offers two verifications. Prefer the signed headers; fall back to the
  // secret carried in the body, which is its documented alternative over HTTPS.
  const sigHeader = firstString(
    Array.isArray(req.headers['x-cakto-signature']) ? req.headers['x-cakto-signature'][0] : req.headers['x-cakto-signature']
  );
  const tsHeader = firstString(
    Array.isArray(req.headers['x-cakto-timestamp']) ? req.headers['x-cakto-timestamp'][0] : req.headers['x-cakto-timestamp']
  );

  // Only attempt HMAC when the exact bytes are in hand. Without them, fall
  // through to the body secret rather than rejecting a legitimate event.
  let verifiedBy: string;
  if (raw && sigHeader && tsHeader) {
    if (!signatureMatches(raw, tsHeader, sigHeader, secret)) {
      return res.status(401).json({ error: 'Assinatura inválida.' });
    }
    verifiedBy = 'assinatura';
  } else if (typeof body?.secret === 'string' && safeEqual(body.secret, secret)) {
    verifiedBy = 'secret no corpo';
  } else {
    return res.status(401).json({ error: 'Token inválido.' });
  }

  const admin = getSupabaseAdmin();

  // Always log the raw payload first — the source of truth for refining field
  // extraction once real Cakto traffic has been seen.
  const { data: eventRow } = await admin
    .from('webhook_events')
    .insert({ provider: 'cakto', raw: body })
    .select('id')
    .single();

  const note = async (processed: boolean, text: string) => {
    await admin
      .from('webhook_events')
      .update({ processed, processing_note: text })
      .eq('id', eventRow?.id);
  };

  try {
    const event = String(body?.event || '').toLowerCase();
    const data = body?.data || {};

    if (NO_ACTION.has(event)) {
      await note(true, `evento ${event} registrado, sem ação (via ${verifiedBy})`);
      return res.status(200).json({ received: true, action: 'none' });
    }

    const grants = GRANTS.has(event);
    const revokes = REVOKES.has(event);
    if (!grants && !revokes) {
      await note(false, `evento desconhecido: "${event}" — nenhuma ação tomada`);
      return res.status(200).json({ received: true, action: 'unknown' });
    }

    const email = firstString(data?.customer?.email, data?.customerEmail, body?.email);
    if (!email) {
      await note(false, `evento ${event} sem e-mail identificável no payload`);
      return res.status(200).json({ received: true, matched: false });
    }

    // One row per Cakto transaction. provider_sale_id is UNIQUE, so Cakto's
    // retries (up to 5) collapse onto the same subscription instead of stacking.
    const saleId = firstString(data?.id, data?.refId);

    const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const users = usersPage?.users || [];
    let user = users.find((u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user && grants) {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
      });
      if (createError) {
        await note(false, `falha ao criar conta para ${email}: ${createError.message}`);
        return res.status(200).json({ received: true, error: true });
      }
      user = created.user;
    }

    if (!user) {
      await note(false, `nenhum usuário encontrado para ${email} (evento ${event})`);
      return res.status(200).json({ received: true, matched: false });
    }

    if (grants) {
      // Plan resolution, in order of confidence:
      //   1. the offer id, against ids listed in env vars;
      //   2. whether Cakto attached a subscription block — recurring means
      //      mensal, a one-off charge means vitalicio.
      // Never a blind default: a wrong guess silently sells the wrong product.
      const offerId = firstString(data?.offer?.id, data?.offer_id, data?.offerId);
      const lifetime = offerIdsFrom('CAKTO_OFFER_VITALICIO');
      const monthly = offerIdsFrom('CAKTO_OFFER_MENSAL');

      let plan: 'mensal' | 'vitalicio';
      let how: string;
      if (offerId && lifetime.includes(offerId)) {
        plan = 'vitalicio';
        how = 'offer id';
      } else if (offerId && monthly.includes(offerId)) {
        plan = 'mensal';
        how = 'offer id';
      } else {
        plan = data?.subscription ? 'mensal' : 'vitalicio';
        how = `heurística (subscription ${data?.subscription ? 'presente' : 'ausente'})`;
      }

      const unmapped = how !== 'offer id'
        ? ` ATENÇÃO: offer "${offerId || 'sem id'}" não está em CAKTO_OFFER_VITALICIO/CAKTO_OFFER_MENSAL.`
        : '';

      const { error: subError } = await admin.from('subscriptions').upsert(
        {
          user_id: user.id,
          plan,
          status: 'active',
          provider: 'cakto',
          provider_sale_id: saleId || `cakto_${user.id}_${Date.now()}`,
        },
        { onConflict: 'provider_sale_id' }
      );
      if (subError) {
        await note(false, `evento ${event} para ${email}: falha ao gravar assinatura — ${subError.message}`);
        return res.status(200).json({ received: true, error: true });
      }

      await note(true, `email=${email} event=${event} plan=${plan} (${how}) sale=${saleId || 'n/a'} via ${verifiedBy}.${unmapped}`);
      return res.status(200).json({ received: true, action: 'granted', plan });
    }

    // Revoke the specific sale when Cakto tells us which one. Only fall back to
    // "this user's active Cakto plans" — never touch another provider's row.
    let query = admin
      .from('subscriptions')
      .update({ status: 'canceled', updated_at: new Date().toISOString() });

    query = saleId
      ? query.eq('provider_sale_id', saleId)
      : query.eq('user_id', user.id).eq('provider', 'cakto').eq('status', 'active');

    const { error: revokeError } = await query;
    if (revokeError) {
      await note(false, `evento ${event} para ${email}: falha ao cancelar — ${revokeError.message}`);
      return res.status(200).json({ received: true, error: true });
    }

    await note(true, `email=${email} event=${event} acesso revogado sale=${saleId || 'todos os ativos cakto'} via ${verifiedBy}`);
    return res.status(200).json({ received: true, action: 'revoked' });
  } catch (err: any) {
    await note(false, `erro: ${err?.message || err}`);
    // Still 2xx — Cakto retries on non-2xx, and our own parsing bug should not
    // trigger five redeliveries of an event we will fail on every time.
    return res.status(200).json({ received: true, error: true });
  }
}
