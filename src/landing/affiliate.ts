import { CHECKOUT_URLS, type PlanId } from '../data/checkout';

/**
 * Affiliate resolution for the landing page.
 *
 * Deliberately uses plain fetch against Supabase's REST endpoint instead of
 * @supabase/supabase-js: the landing bundle is ~78KB and the SDK would more
 * than double it, on the one page where load time costs sales.
 *
 * The lookup starts at module load rather than inside a React effect, so it is
 * already in flight before the first render and the CTA is far less likely to
 * still hold the default link when someone clicks it.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** `/a/<slug>` — the `/a/` prefix keeps the rewrite from ever shadowing /app or /api. */
export const AFFILIATE_PATH_PREFIX = '/a/';

export function slugFromLocation(pathname = window.location.pathname): string | null {
  if (!pathname.startsWith(AFFILIATE_PATH_PREFIX)) return null;
  const raw = pathname.slice(AFFILIATE_PATH_PREFIX.length).split('/')[0];
  const slug = decodeURIComponent(raw || '').trim().toLowerCase();
  // Cheap sanity filter so junk paths never become a network call.
  return /^[a-z0-9]{4,32}$/.test(slug) ? slug : null;
}

export interface AffiliateCheckout {
  slug: string;
  urls: Record<PlanId, string>;
}

async function lookup(slug: string): Promise<AffiliateCheckout | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/affiliate_by_slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_slug: slug }),
    });
    if (!res.ok) return null;

    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;

    // Partial rows are fine: an affiliate may only sell one of the plans, and
    // the other falls back to ours rather than becoming a dead button.
    return {
      slug,
      urls: {
        mensal: row.checkout_mensal || CHECKOUT_URLS.mensal,
        vitalicio: row.checkout_vitalicio || CHECKOUT_URLS.vitalicio,
      },
    };
  } catch {
    // Network or Supabase trouble must never break the page — the visitor just
    // gets the owner's own checkout.
    return null;
  }
}

/**
 * Params the payment platforms and ad tools use to attribute a sale.
 *
 * `code` is Cakto's affiliate parameter: their affiliate links redirect to the
 * product's sales page with it appended, and it has to survive the hop to the
 * checkout or the commission is lost. Nothing errors when it is dropped, which
 * is exactly why it is worth forwarding explicitly.
 */
const TRACKING_PARAMS = [
  'code',
  'ref',
  'aff',
  'affiliate',
  'src',
  'sck',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

/**
 * Copies the tracking params from the current page onto a checkout URL.
 *
 * Never overwrites one the checkout URL already carries: an affiliate's own
 * link, stored via /a/<slug>, already has their code and must win over whatever
 * happens to be in the address bar.
 */
export function withTrackingParams(checkoutUrl: string, search = window.location.search): string {
  try {
    const incoming = new URLSearchParams(search);
    const target = new URL(checkoutUrl);

    for (const key of TRACKING_PARAMS) {
      const value = incoming.get(key);
      if (value && !target.searchParams.has(key)) {
        target.searchParams.set(key, value);
      }
    }
    return target.toString();
  } catch {
    return checkoutUrl;
  }
}

const initialSlug = typeof window !== 'undefined' ? slugFromLocation() : null;

/** Resolves to null on a normal visit, or when the slug is unknown/inactive. */
export const affiliatePromise: Promise<AffiliateCheckout | null> = initialSlug
  ? lookup(initialSlug)
  : Promise.resolve(null);

export const hasAffiliateSlug = initialSlug !== null;
