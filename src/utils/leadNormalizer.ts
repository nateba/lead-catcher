import { Lead, OsmType, WebsiteStatus } from '../types';
import { calculateDistanceKm, formatDistance } from './distanceUtils';
import {
  cleanPhoneDigits,
  formatBrazilianPhone,
  isBrazilianMobile,
  isValidBrazilianPhone,
} from './phoneUtils';
import { calculateLeadScore } from './leadScoring';
import { getInitials, getAvatarColor } from './formatters';

export interface RawOsmElement {
  type: string;
  id: number | string;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}

export interface NormalizeOptions {
  categoryKey: string;
  categoryLabel: string;
  searchCity: string;
  searchState: string;
  centerLat: number;
  centerLng: number;
}

/**
 * Validates a website URL string to see if it's a real web link.
 */
export function isValidWebsite(raw?: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (trimmed.length < 4) return false;
  if (trimmed.toLowerCase() === 'no' || trimmed.toLowerCase() === 'none' || trimmed.toLowerCase() === 'na') {
    return false;
  }
  return true;
}

/**
 * Normalizes a raw OpenStreetMap element into a uniform, robust Lead entity.
 * Handles missing fields gracefully with safe fallbacks and zero undefined/null string artifacts.
 */
export function normalizeOsmElement(
  el: RawOsmElement,
  options: NormalizeOptions
): Lead | null {
  if (!el || !el.id) return null;

  const tags = el.tags || {};
  const rawName = tags.name || tags['name:pt'] || tags['name:en'] || tags['brand'] || tags['operator'];

  // Skip elements with no registered name as they cannot be prospected or have websites generated
  if (!rawName || !rawName.trim()) {
    return null;
  }

  const name = rawName.trim();

  // Coordinates
  const lat = typeof el.lat === 'number' ? el.lat : el.center?.lat ?? options.centerLat;
  const lng = typeof el.lon === 'number' ? el.lon : el.center?.lon ?? options.centerLng;

  const distanceKm = calculateDistanceKm(options.centerLat, options.centerLng, lat, lng);
  const distanceFormatted = formatDistance(distanceKm);

  // Phone extraction
  const rawPhone =
    tags.phone ||
    tags['contact:phone'] ||
    tags['contact:mobile'] ||
    tags['contact:whatsapp'] ||
    tags['phone:whatsapp'] ||
    tags['mobile'] ||
    '';

  const cleanDigits = cleanPhoneDigits(rawPhone);
  const hasValidPhone = Boolean(rawPhone && rawPhone.trim().length >= 8);
  const isWhatsapp = isBrazilianMobile(cleanDigits) || tags['contact:whatsapp'] !== undefined || tags['phone:whatsapp'] !== undefined;
  const formattedPhone = hasValidPhone ? formatBrazilianPhone(rawPhone.trim()) : '';

  // Website extraction
  const rawWebsite =
    tags.website ||
    tags['contact:website'] ||
    tags['url'] ||
    tags['contact:url'] ||
    '';

  const hasWebsite = isValidWebsite(rawWebsite);
  const websiteStatus: WebsiteStatus = hasWebsite ? 'HAS_WEBSITE' : 'NO_WEBSITE_IDENTIFIED';

  // Address assembly
  const street = (tags['addr:street'] || tags['addr:place'] || '').trim();
  const housenumber = (tags['addr:housenumber'] || '').trim();
  const neighbourhood = (
    tags['addr:suburb'] ||
    tags['addr:neighbourhood'] ||
    tags['addr:district'] ||
    ''
  ).trim();
  const city = (tags['addr:city'] || options.searchCity || '').trim();
  const state = (tags['addr:state'] || options.searchState || '').trim();
  const postcode = (tags['addr:postcode'] || '').trim();

  const addressSegments: string[] = [];
  if (street) {
    addressSegments.push(housenumber ? `${street}, ${housenumber}` : street);
  }
  if (neighbourhood) {
    addressSegments.push(neighbourhood);
  }
  if (city) {
    addressSegments.push(state ? `${city} - ${state}` : city);
  }
  if (postcode) {
    addressSegments.push(`CEP ${postcode}`);
  }

  const fullAddress = addressSegments.join(' • ');

  // Opening hours
  const opening_hours = (tags.opening_hours || tags['contact:opening_hours'] || '').trim();

  // Closed / Disused status
  const isClosed = Boolean(
    tags.disused === 'yes' ||
    tags.abandoned === 'yes' ||
    tags['disused:shop'] ||
    tags['disused:amenity'] ||
    tags.end_date !== undefined
  );

  // Compute Lead Score strictly on real attributes
  const scoreResult = calculateLeadScore({
    hasWebsite,
    hasPhone: hasValidPhone,
    isWhatsapp,
    hasStreet: Boolean(street),
    hasHouseNumber: Boolean(housenumber),
    hasOpeningHours: Boolean(opening_hours),
    hasSpecificCategory: options.categoryKey !== 'personalizado',
    distanceKm,
    isClosed,
  });

  const lead: Lead = {
    id: `${el.type || 'node'}_${el.id}`,
    name,
    category: options.categoryKey,
    categoryLabel: options.categoryLabel,
    city: city || options.searchCity,
    state: state || options.searchState,
    address: fullAddress,
    street: street || undefined,
    housenumber: housenumber || undefined,
    neighbourhood: neighbourhood || undefined,
    postcode: postcode || undefined,
    phone: formattedPhone,
    cleanPhone: cleanDigits || undefined,
    whatsappAvailable: isWhatsapp && isValidBrazilianPhone(cleanDigits),
    website: hasWebsite ? rawWebsite.trim() : undefined,
    hasWebsite,
    websiteStatus,
    opening_hours: opening_hours || undefined,
    lat,
    lng,
    distanceKm,
    distanceFormatted,
    osmType: (el.type as OsmType) || 'node',
    osmId: el.id,
    initials: getInitials(name),
    avatarBg: getAvatarColor(name),
    closed: isClosed,
    tags,
    source: 'openstreetmap',
    leadScore: scoreResult.score,
    leadQuality: scoreResult.tier,
    leadQualityLabel: scoreResult.label,
    scoreBreakdown: scoreResult.breakdown,
    dataCompleteness: scoreResult.completenessPercentage,
  };

  return lead;
}
