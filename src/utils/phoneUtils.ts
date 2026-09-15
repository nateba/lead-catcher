/**
 * Phone formatting and WhatsApp utilities for Brazilian numbers.
 */

/**
 * Extracts digits from a phone string.
 */
export function cleanPhoneDigits(raw?: string): string {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}

/**
 * Checks if a string contains a valid Brazilian phone number (landline or mobile).
 * Valid numbers in Brazil have:
 * - 10 digits: 2-digit DDD + 8-digit number (e.g. 11 3234-5678)
 * - 11 digits: 2-digit DDD + 9-digit mobile (e.g. 11 98765-4321)
 * - Or prefixed with country code 55: 12 or 13 digits (e.g. 55 11 98765-4321)
 */
export function isValidBrazilianPhone(raw?: string): boolean {
  const digits = cleanPhoneDigits(raw);
  if (!digits) return false;

  // With country code 55
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    const ddd = parseInt(digits.substring(2, 4), 10);
    return ddd >= 11 && ddd <= 99;
  }

  // Without country code (DDD + number)
  if (digits.length === 10 || digits.length === 11) {
    const ddd = parseInt(digits.substring(0, 2), 10);
    return ddd >= 11 && ddd <= 99;
  }

  return false;
}

/**
 * Checks if a phone is specifically a Brazilian mobile phone (starts with 9 or 8/7 in older formats).
 */
export function isBrazilianMobile(raw?: string): boolean {
  const digits = cleanPhoneDigits(raw);
  if (!digits) return false;

  let localDigits = digits;
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    localDigits = digits.substring(2);
  }

  if (localDigits.length === 11) {
    const ddd = parseInt(localDigits.substring(0, 2), 10);
    const firstDigit = localDigits.charAt(2);
    return ddd >= 11 && ddd <= 99 && firstDigit === '9';
  }

  return false;
}

/**
 * Formats a Brazilian phone number nicely for display.
 * Example: (11) 98765-4321 or (11) 3456-7890
 */
export function formatBrazilianPhone(raw?: string): string {
  if (!raw) return '';
  const digits = cleanPhoneDigits(raw);
  if (!digits) return raw;

  let num = digits;
  if (num.startsWith('55') && (num.length === 12 || num.length === 13)) {
    num = num.substring(2);
  }

  if (num.length === 11) {
    return `(${num.substring(0, 2)}) ${num.substring(2, 7)}-${num.substring(7)}`;
  }

  if (num.length === 10) {
    return `(${num.substring(0, 2)}) ${num.substring(2, 6)}-${num.substring(6)}`;
  }

  if (num.length === 9) {
    return `${num.substring(0, 5)}-${num.substring(5)}`;
  }

  if (num.length === 8) {
    return `${num.substring(0, 4)}-${num.substring(4)}`;
  }

  return raw;
}

/**
 * Returns a standardized international phone number with country code 55 for WhatsApp.
 * Returns null if the number is not a valid Brazilian number.
 */
export function getWhatsappNumber(raw?: string): string | null {
  if (!raw) return null;
  const digits = cleanPhoneDigits(raw);
  if (!digits) return null;

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    const ddd = parseInt(digits.substring(2, 4), 10);
    if (ddd >= 11 && ddd <= 99) {
      return digits;
    }
  }

  if (digits.length === 10 || digits.length === 11) {
    const ddd = parseInt(digits.substring(0, 2), 10);
    if (ddd >= 11 && ddd <= 99) {
      return `55${digits}`;
    }
  }

  return null;
}

/**
 * Generates an active WhatsApp URL if a valid number is detected.
 */
export function getWhatsappUrl(raw?: string, businessName?: string, customMessage?: string): string | null {
  const waNumber = getWhatsappNumber(raw);
  if (!waNumber) return null;

  const msg = customMessage || (businessName
    ? `Olá! Localizei a empresa ${businessName} no OpenStreetMap e gostaria de conversar.`
    : `Olá! Localizei sua empresa no OpenStreetMap e gostaria de conversar.`);

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}
