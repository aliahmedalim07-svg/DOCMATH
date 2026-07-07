import { parsePhoneNumber, type CountryCode } from "libphonenumber-js";

const DEFAULT_COUNTRY = "EG" as CountryCode;

function hasPlusPrefix(input: string): boolean {
  return input.trim().startsWith("+");
}

export function parseAndFormatPhone(input: string): string | null {
  try {
    const parsed = parsePhoneNumber(input, DEFAULT_COUNTRY);
    if (!parsed || !parsed.isValid()) return null;
    if (!hasPlusPrefix(input) && parsed.country !== "EG") return null;
    return parsed.number;
  } catch {
    return null;
  }
}

export function validatePhone(input: string): { valid: boolean; displayNumber: string | null; apiNumber: string | null } {
  try {
    const parsed = parsePhoneNumber(input, DEFAULT_COUNTRY);
    if (!parsed || !parsed.isValid()) {
      return { valid: false, displayNumber: null, apiNumber: null };
    }
    if (!hasPlusPrefix(input) && parsed.country !== "EG") {
      return { valid: false, displayNumber: null, apiNumber: null };
    }
    const full = parsed.number;
    return { valid: true, displayNumber: full, apiNumber: full.replace("+", "") };
  } catch {
    return { valid: false, displayNumber: null, apiNumber: null };
  }
}

export function toApiPhone(input: string): string {
  const result = validatePhone(input);
  return result.apiNumber ?? input.replace(/[^\d]/g, "");
}

export function formatPhoneForDisplay(input: string): string {
  try {
    const parsed = parsePhoneNumber(input, DEFAULT_COUNTRY);
    if (parsed && parsed.isValid()) {
      return parsed.formatInternational();
    }
  } catch {}
  return input;
}
