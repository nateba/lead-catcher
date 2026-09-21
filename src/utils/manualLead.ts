import { Lead } from '../types';
import {
  cleanPhoneDigits,
  formatBrazilianPhone,
  isBrazilianMobile,
  isValidBrazilianPhone,
} from './phoneUtils';
import { calculateLeadScore } from './leadScoring';
import { getInitials, getAvatarColor } from './formatters';
import { isValidWebsite } from './leadNormalizer';

export interface ManualLeadInput {
  name: string;
  phone?: string;
  street?: string;
  housenumber?: string;
  neighbourhood?: string;
  website?: string;
  openingHours?: string;
  city: string;
  state: string;
  categoryKey: string;
  categoryLabel: string;
}

/**
 * Builds a Lead from fields typed by hand, for businesses found in Google Maps
 * that the OpenStreetMap search does not cover.
 *
 * Runs the same scoring and formatting as the automatic pipeline, so a manual
 * lead sorts, scores and generates a site exactly like a scraped one. The only
 * honest differences: `source` says 'manual', and there are no coordinates —
 * nothing measured a distance, so claiming one would be inventing data.
 */
export function buildManualLead(input: ManualLeadInput): Lead {
  const name = input.name.trim();

  const cleanDigits = cleanPhoneDigits(input.phone);
  const hasValidPhone = isValidBrazilianPhone(cleanDigits);
  const isWhatsapp = hasValidPhone && isBrazilianMobile(cleanDigits);
  const formattedPhone = hasValidPhone ? formatBrazilianPhone(cleanDigits) : '';

  const rawWebsite = (input.website || '').trim();
  const hasWebsite = isValidWebsite(rawWebsite);

  const street = (input.street || '').trim();
  const housenumber = (input.housenumber || '').trim();
  const neighbourhood = (input.neighbourhood || '').trim();
  const openingHours = (input.openingHours || '').trim();

  const addressParts = [
    [street, housenumber].filter(Boolean).join(', '),
    neighbourhood,
    input.city,
  ].filter(Boolean);
  const fullAddress = addressParts.join(' - ') || 'Endereço não informado';

  const scoreResult = calculateLeadScore({
    hasWebsite,
    hasPhone: hasValidPhone,
    isWhatsapp,
    hasStreet: Boolean(street),
    hasHouseNumber: Boolean(housenumber),
    hasOpeningHours: Boolean(openingHours),
    hasSpecificCategory: input.categoryKey !== 'personalizado',
    // No coordinates were captured, so distance contributes nothing rather than
    // pretending the business sits at the centre of the search.
    distanceKm: 0,
    isClosed: false,
  });

  return {
    id: `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    category: input.categoryKey,
    categoryLabel: input.categoryLabel,
    city: input.city,
    state: input.state,
    address: fullAddress,
    street: street || undefined,
    housenumber: housenumber || undefined,
    neighbourhood: neighbourhood || undefined,
    phone: formattedPhone,
    cleanPhone: cleanDigits || undefined,
    whatsappAvailable: isWhatsapp,
    website: hasWebsite ? rawWebsite : undefined,
    hasWebsite,
    websiteStatus: hasWebsite ? 'HAS_WEBSITE' : 'NO_WEBSITE_IDENTIFIED',
    opening_hours: openingHours || undefined,
    lat: 0,
    lng: 0,
    distanceKm: 0,
    distanceFormatted: '—',
    osmType: 'node',
    osmId: `manual_${Date.now()}`,
    initials: getInitials(name),
    avatarBg: getAvatarColor(name),
    closed: false,
    tags: {},
    source: 'manual',
    leadScore: scoreResult.score,
    leadQuality: scoreResult.tier,
    leadQualityLabel: scoreResult.label,
    scoreBreakdown: scoreResult.breakdown,
    dataCompleteness: scoreResult.completenessPercentage,
  };
}
