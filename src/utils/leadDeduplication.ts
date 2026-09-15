import { Lead } from '../types';
import { calculateDistanceKm } from './distanceUtils';
import { cleanPhoneDigits } from './phoneUtils';

/**
 * Normalizes a company name for comparison:
 * - Lowercase
 * - Strip accents and special characters
 * - Strip legal company suffixes (LTDA, ME, EPP, EIRELI, S/A, S.A., MEI, etc.)
 */
export function normalizeBusinessName(name?: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(ltda|me|epp|eireli|s\/a|s\.a\.|mei|me|sociedade limitada|ep)\b/gi, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates string similarity using Dice's Coefficient (bigram similarity).
 * Returns a value between 0.0 and 1.0.
 */
export function calculateNameSimilarity(str1: string, str2: string): number {
  const s1 = normalizeBusinessName(str1);
  const s2 = normalizeBusinessName(str2);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  if (s1.length < 2 || s2.length < 2) return s1 === s2 ? 1.0 : 0.0;

  // Check substring containment if long enough
  if ((s1.length >= 6 && s2.includes(s1)) || (s2.length >= 6 && s1.includes(s2))) {
    return 0.9;
  }

  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);

  let intersection = 0;
  bg1.forEach((b) => {
    if (bg2.has(b)) intersection++;
  });

  return (2.0 * intersection) / (bg1.size + bg2.size);
}

/**
 * Rates the data richness of a lead record so we keep the most complete one upon duplicate detection.
 */
function getLeadRichnessScore(lead: Lead): number {
  let score = 0;
  if (lead.phone) score += 30;
  if (lead.whatsappAvailable) score += 10;
  if (lead.street && lead.housenumber) score += 25;
  else if (lead.address) score += 15;
  if (lead.opening_hours) score += 15;
  if (lead.leadScore) score += lead.leadScore * 0.1;
  return score;
}

/**
 * Deduplicates an array of leads using multi-signal identification.
 * Ensures different businesses are preserved while eliminating true duplicates.
 */
export function deduplicateLeads(leads: Lead[]): Lead[] {
  if (!Array.isArray(leads) || leads.length <= 1) {
    return leads || [];
  }

  const result: Lead[] = [];
  const phoneMap = new Map<string, number>(); // cleanPhone -> index in result
  const osmIdMap = new Map<string, number>(); // osmId_type -> index in result

  for (const lead of leads) {
    const cleanPhone = cleanPhoneDigits(lead.phone);
    const osmKey = `${lead.osmType || 'node'}_${lead.osmId}`;

    let duplicateIndex = -1;

    // 1. Direct OSM ID Match
    if (lead.osmId && osmIdMap.has(osmKey)) {
      duplicateIndex = osmIdMap.get(osmKey)!;
    }

    // 2. Direct Phone Match (if phone has 10+ digits)
    if (duplicateIndex === -1 && cleanPhone && cleanPhone.length >= 10 && phoneMap.has(cleanPhone)) {
      duplicateIndex = phoneMap.get(cleanPhone)!;
    }

    // 3. Proximity (< 50 meters) + Name Similarity Match
    if (duplicateIndex === -1 && lead.lat && lead.lng) {
      for (let i = 0; i < result.length; i++) {
        const existing = result[i];
        if (!existing.lat || !existing.lng) continue;

        const distKm = calculateDistanceKm(lead.lat, lead.lng, existing.lat, existing.lng);
        // If within 50 meters (0.05 km)
        if (distKm <= 0.05) {
          const similarity = calculateNameSimilarity(lead.name, existing.name);
          if (similarity >= 0.75) {
            duplicateIndex = i;
            break;
          }
        } else if (distKm <= 0.3) {
          // If within 300 meters and exact normalized name
          const n1 = normalizeBusinessName(lead.name);
          const n2 = normalizeBusinessName(existing.name);
          if (n1 && n2 && n1 === n2) {
            duplicateIndex = i;
            break;
          }
        }
      }
    }

    // 4. Handle merge or insertion
    if (duplicateIndex !== -1) {
      const existing = result[duplicateIndex];
      const existingRichness = getLeadRichnessScore(existing);
      const currentRichness = getLeadRichnessScore(lead);

      if (currentRichness > existingRichness) {
        // Replace existing with more complete lead
        result[duplicateIndex] = {
          ...lead,
          // Preserve any extra details existing had that current doesn't
          phone: lead.phone || existing.phone,
          opening_hours: lead.opening_hours || existing.opening_hours,
          address: lead.address || existing.address,
        };
      }
    } else {
      const newIndex = result.length;
      result.push(lead);

      if (cleanPhone && cleanPhone.length >= 10) {
        phoneMap.set(cleanPhone, newIndex);
      }
      if (lead.osmId) {
        osmIdMap.set(osmKey, newIndex);
      }
    }
  }

  return result;
}
