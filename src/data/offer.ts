/**
 * The live offer, in one place.
 *
 * The landing and the in-app paywall both sell the same thing, so the anchor
 * price, the discount and the remaining-slot count live here rather than being
 * typed into each screen. A visitor who sees one anchor on the landing and a
 * different one after logging in stops believing either number.
 *
 * Amounts are numbers, not pre-formatted strings, so the discount badges are
 * derived and cannot go stale when a price changes.
 */

export const brl = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/** Rounded down, so the badge never promises more than the price delivers. */
export const discountPercent = (anchor: number, price: number): number =>
  Math.floor((1 - price / anchor) * 100);

export interface OfferPlan {
  /** The struck-through "de R$ X" price. */
  anchor: number;
  price: number;
}

export const OFFER = {
  /** Headline reason for the discount. */
  campaign: 'Super desconto de 1 ano — aniversário da plataforma',
  /** How long it lasts. Deliberately vague: there is no countdown to contradict. */
  window: 'Só enquanto durar o aniversário',

  /** Shown on the lifetime plan. Update as they sell. */
  lifetimeSlotsLeft: 3,

  mensal: {
    anchor: 297,
    price: 169.9,
    period: '/ mês',
  } satisfies OfferPlan & { period: string },

  vitalicio: {
    anchor: 597,
    price: 249.9,
    period: 'à vista no Pix',
    installments: [
      { count: 12, value: 26.63 },
      { count: 6, value: 47.91 },
    ],
  } satisfies OfferPlan & { period: string; installments: { count: number; value: number }[] },
} as const;

export const MENSAL_OFF = discountPercent(OFFER.mensal.anchor, OFFER.mensal.price);
export const VITALICIO_OFF = discountPercent(OFFER.vitalicio.anchor, OFFER.vitalicio.price);
