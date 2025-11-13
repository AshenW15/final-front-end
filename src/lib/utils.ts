import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Sri Lankan Rupees with "Rs" symbol consistently
export function formatPriceLKR(value: number | undefined | null, options?: Intl.NumberFormatOptions) {
  if (typeof value !== 'number') return '';
  try {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', currencyDisplay: 'narrowSymbol', ...options }).format(value);
  } catch {
    // Fallback: manual Rs prefix with locale formatting
    return `Rs ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Parse a price that may be a string like "LKR 2,450.00", "Rs.2450", "2450" into a number
// Returns null if it cannot be parsed.
export function parsePriceToNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  // Keep digits, dots, commas and minus signs; remove currency letters/symbols, then drop commas.
  const cleaned = raw.replace(/[^\d.,-]/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? null : num;
}
