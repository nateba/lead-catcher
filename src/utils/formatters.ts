/**
 * Formatting and normalization utilities for phone numbers, URLs, dates, and UI presentation
 */

// Modern color palette for company avatars (Slack/Discord style)
export const AVATAR_COLORS = [
  '#4f46e5', // indigo-600
  '#7c3aed', // violet-600
  '#2563eb', // blue-600
  '#0d9488', // teal-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#ea580c', // orange-600
  '#e11d48', // rose-600
  '#db2777', // pink-600
  '#9333ea', // purple-600
  '#0284c7', // sky-600
  '#16a34a', // green-600
];

export function cleanPhoneForWhatsapp(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export function formatWhatsappUrl(phone?: string, text?: string): string {
  const cleanPhone = cleanPhoneForWhatsapp(phone);
  if (!cleanPhone) return '';
  const encodedText = text ? encodeURIComponent(text) : '';
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

export function getInitials(name: string): string {
  if (!name) return 'EP';
  const clean = name.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EP';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string): string {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getDaysSince(dateString?: string): number {
  if (!dateString) return 0;
  const d = new Date(dateString).getTime();
  if (isNaN(d)) return 0;
  const diffMs = Date.now() - d;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatOpeningHours(rawHours?: string): string {
  if (!rawHours) return 'Horário não informado';
  let formatted = rawHours;
  formatted = formatted.replace(/Mo/g, 'Seg');
  formatted = formatted.replace(/Tu/g, 'Ter');
  formatted = formatted.replace(/We/g, 'Qua');
  formatted = formatted.replace(/Th/g, 'Qui');
  formatted = formatted.replace(/Fr/g, 'Sex');
  formatted = formatted.replace(/Sa/g, 'Sáb');
  formatted = formatted.replace(/Su/g, 'Dom');
  formatted = formatted.replace(/PH/g, 'Feriados');
  formatted = formatted.replace(/off/gi, 'Fechado');
  formatted = formatted.replace(/open/gi, 'Aberto');
  return formatted;
}
