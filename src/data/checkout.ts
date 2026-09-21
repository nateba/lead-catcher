/**
 * The owner's own checkout links, and the rules for accepting an affiliate's.
 *
 * Single source for both Vite entries — these used to be typed out separately
 * in src/constants/index.ts and src/landing/App.tsx, with a comment asking
 * whoever changed one to remember the other.
 */

export type PlanId = 'mensal' | 'vitalicio';

export const CHECKOUT_URLS: Record<PlanId, string> = {
  mensal: 'https://checkout.applyfy.com.br/checkout/cmu2vbt1y0jqv01pwpekeuyx2?offer=YKR5ZRD',
  vitalicio: 'https://checkout.applyfy.com.br/checkout/cmu2wb7u50l9201oh3jbdn2dn?offer=SPN02ZK',
};

/**
 * Affiliate links are pasted by hand in the admin panel. A wrong paste would
 * send buyers somewhere else from a page carrying HypeLeads branding, so only
 * the payment providers are accepted.
 */
const ALLOWED_CHECKOUT_DOMAINS = ['applyfy.com.br', 'cakto.com.br'];

export function checkoutUrlProblem(raw: string): string | null {
  const value = raw.trim();
  if (!value) return 'Informe o link.';

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'Link inválido. Cole a URL completa, começando com https://';
  }

  if (url.protocol !== 'https:') return 'O link precisa ser https.';

  const host = url.hostname.toLowerCase();
  const ok = ALLOWED_CHECKOUT_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  if (!ok) {
    return `Domínio não permitido (${host}). Use um link da Applyfy ou da Cakto.`;
  }

  return null;
}

/** Slug alphabet without 0/O and 1/l/I, so a slug read aloud is unambiguous. */
const SLUG_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

export function randomSlug(length = 7): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => SLUG_ALPHABET[b % SLUG_ALPHABET.length]).join('');
}
