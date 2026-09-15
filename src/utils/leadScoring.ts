import { LeadQualityTier, LeadScoreBreakdown } from '../types';

/**
 * Centralized Lead Score weights for qualification based solely on verified real OSM data.
 */
export const SCORING_WEIGHTS = {
  NO_WEBSITE_IDENTIFIED: 30, // Primary qualification factor: prime lead to sell a website
  PHONE_AVAILABLE: 25,       // Essential for immediate contact/outreach
  WHATSAPP_IDENTIFIED: 10,   // Mobile number allows WhatsApp prospecting
  FULL_ADDRESS: 15,          // Street + number available (+8 if partial)
  OPENING_HOURS: 10,         // Active business indicator
  CATEGORY_SPECIFIC: 5,      // Standardized local business niche
  CLOSE_PROXIMITY: 5,        // Within 5km of search center
  CLOSED_PENALTY: 60,        // Penalty if flagged as disused or abandoned
} as const;

export interface RawScoringInputs {
  hasWebsite: boolean;
  hasPhone: boolean;
  isWhatsapp: boolean;
  hasStreet: boolean;
  hasHouseNumber: boolean;
  hasOpeningHours: boolean;
  hasSpecificCategory: boolean;
  distanceKm: number;
  isClosed?: boolean;
}

export interface ScoreCalculationResult {
  score: number;
  tier: LeadQualityTier;
  label: string;
  badgeClass: string;
  breakdown: LeadScoreBreakdown;
  completenessPercentage: number;
}

/**
 * Calculates a lead's qualification score from 0 to 100 based strictly on verified OSM attributes.
 */
export function calculateLeadScore(inputs: RawScoringInputs): ScoreCalculationResult {
  let phoneScore = 0;
  if (inputs.hasPhone) {
    phoneScore += SCORING_WEIGHTS.PHONE_AVAILABLE;
  }

  let whatsappScore = 0;
  if (inputs.isWhatsapp) {
    whatsappScore += SCORING_WEIGHTS.WHATSAPP_IDENTIFIED;
  }

  let noWebsiteScore = 0;
  if (!inputs.hasWebsite) {
    noWebsiteScore += SCORING_WEIGHTS.NO_WEBSITE_IDENTIFIED;
  }

  let addressScore = 0;
  if (inputs.hasStreet && inputs.hasHouseNumber) {
    addressScore += SCORING_WEIGHTS.FULL_ADDRESS;
  } else if (inputs.hasStreet) {
    addressScore += Math.round(SCORING_WEIGHTS.FULL_ADDRESS * 0.5);
  }

  let openingHoursScore = 0;
  if (inputs.hasOpeningHours) {
    openingHoursScore += SCORING_WEIGHTS.OPENING_HOURS;
  }

  let categoryScore = 0;
  if (inputs.hasSpecificCategory) {
    categoryScore += SCORING_WEIGHTS.CATEGORY_SPECIFIC;
  }

  let distanceScore = 0;
  if (inputs.distanceKm >= 0 && inputs.distanceKm <= 5) {
    distanceScore += SCORING_WEIGHTS.CLOSE_PROXIMITY;
  } else if (inputs.distanceKm <= 10) {
    distanceScore += Math.round(SCORING_WEIGHTS.CLOSE_PROXIMITY * 0.6);
  }

  let penaltyClosed = 0;
  if (inputs.isClosed) {
    penaltyClosed += SCORING_WEIGHTS.CLOSED_PENALTY;
  }

  const rawTotal =
    phoneScore +
    whatsappScore +
    noWebsiteScore +
    addressScore +
    openingHoursScore +
    categoryScore +
    distanceScore -
    penaltyClosed;

  const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));

  // Data completeness calculation (how many profile fields are filled out of key 6 fields)
  let filledFields = 0;
  const totalFields = 6;
  if (inputs.hasPhone) filledFields++;
  if (inputs.hasStreet) filledFields++;
  if (inputs.hasHouseNumber) filledFields++;
  if (inputs.hasOpeningHours) filledFields++;
  if (inputs.hasSpecificCategory) filledFields++;
  if (inputs.isWhatsapp) filledFields++;

  const completenessPercentage = Math.round((filledFields / totalFields) * 100);

  // Quality Tier Classification
  let tier: LeadQualityTier = 'LOW';
  let label = 'Poucos dados';
  let badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

  if (totalScore >= 80) {
    tier = 'EXCELLENT';
    label = 'Excelente oportunidade';
    badgeClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (totalScore >= 60) {
    tier = 'GOOD';
    label = 'Boa oportunidade';
    badgeClass = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
  } else if (totalScore >= 40) {
    tier = 'MEDIUM';
    label = 'Oportunidade média';
    badgeClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  const breakdown: LeadScoreBreakdown = {
    phoneScore,
    whatsappScore,
    noWebsiteScore,
    addressScore,
    openingHoursScore,
    categoryScore,
    distanceScore,
    completenessScore: completenessPercentage,
    penaltyClosed,
    totalScore,
  };

  return {
    score: totalScore,
    tier,
    label,
    badgeClass,
    breakdown,
    completenessPercentage,
  };
}
