/**
 * Centralized Institutional Currency and Pricing Service for AITI
 * 
 * Rules:
 * 1. Default institutional currency is Nigerian Naira (NGN / ₦).
 * 2. Foreign students taking online courses pay in USD ($).
 * 3. Never auto-convert NGN prices to USD via live exchange rates.
 * 4. Separate local and international pricing storage and rendering.
 */

export type SupportedCurrency = 'NGN' | 'USD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸'
  }
};

/**
 * Format an amount with the correct institutional currency symbol and options.
 * Defaults strictly to NGN (₦).
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currency: SupportedCurrency | string = 'NGN',
  options: {
    showCode?: boolean;
    decimals?: boolean;
    compact?: boolean;
  } = {}
): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  const curr = (currency || 'NGN').toUpperCase() === 'USD' ? 'USD' : 'NGN';
  const symbol = curr === 'USD' ? '$' : '₦';

  let formattedNumber: string;
  if (options.compact && num >= 1000000) {
    formattedNumber = (num / 1000000).toFixed(1) + 'M';
  } else if (options.compact && num >= 1000) {
    formattedNumber = (num / 1000).toFixed(0) + 'k';
  } else {
    formattedNumber = num.toLocaleString('en-US', {
      minimumFractionDigits: options.decimals ? 2 : 0,
      maximumFractionDigits: options.decimals ? 2 : 0
    });
  }

  const base = `${symbol}${formattedNumber}`;
  if (options.showCode) {
    return `${base} ${curr}`;
  }
  return base;
}

/**
 * Determine dynamic course pricing based on student location and study mode.
 */
export function calculateStudentPricing(course: {
  fee?: number;
  localPhysicalPrice?: number;
  localOnlinePrice?: number;
  internationalOnlinePrice?: number;
  promotionalPriceNGN?: number;
  promotionalPriceUSD?: number;
  isFree?: boolean;
}, location: 'Nigeria' | 'Outside Nigeria', studyMode: 'Physical' | 'Online' | 'Hybrid') {
  if (course.isFree) {
    return {
      currency: location === 'Nigeria' ? 'NGN' : 'USD' as SupportedCurrency,
      amount: 0,
      regularAmount: 0,
      isFree: true,
      label: 'Free Course',
      canEnrollDirectly: true,
      requiresContact: false
    };
  }

  const isNigeria = location === 'Nigeria';

  if (isNigeria) {
    // Local Nigerian Student
    if (studyMode === 'Online') {
      const regular = course.localOnlinePrice || course.fee || 40000;
      const promo = course.promotionalPriceNGN;
      return {
        currency: 'NGN' as SupportedCurrency,
        amount: promo && promo < regular ? promo : regular,
        regularAmount: regular,
        hasPromo: !!promo && promo < regular,
        isFree: false,
        label: 'Local Online Tuition (Nigeria)',
        canEnrollDirectly: true,
        requiresContact: false
      };
    } else {
      // Physical / Hybrid
      const regular = course.localPhysicalPrice || course.fee || 50000;
      const promo = course.promotionalPriceNGN;
      return {
        currency: 'NGN' as SupportedCurrency,
        amount: promo && promo < regular ? promo : regular,
        regularAmount: regular,
        hasPromo: !!promo && promo < regular,
        isFree: false,
        label: 'Physical Lab Tuition (Tanke Campus, Ilorin)',
        canEnrollDirectly: true,
        requiresContact: false
      };
    }
  } else {
    // International Student (Outside Nigeria)
    if (studyMode === 'Online') {
      const regular = course.internationalOnlinePrice || 100;
      const promo = course.promotionalPriceUSD;
      return {
        currency: 'USD' as SupportedCurrency,
        amount: promo && promo < regular ? promo : regular,
        regularAmount: regular,
        hasPromo: !!promo && promo < regular,
        isFree: false,
        label: 'International Online Tuition (Worldwide)',
        canEnrollDirectly: true,
        requiresContact: false
      };
    } else {
      // International student requesting physical attendance
      return {
        currency: 'USD' as SupportedCurrency,
        amount: course.internationalOnlinePrice || 100,
        regularAmount: course.internationalOnlinePrice || 100,
        isFree: false,
        label: 'International In-Person Arrangements',
        canEnrollDirectly: false,
        requiresContact: true,
        notice: 'Please contact AITI regarding physical/international enrollment and campus visa/accommodation arrangements.'
      };
    }
  }
}

/**
 * List of countries with phone codes and regions for the international student application pathway.
 */
export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  timezone: string;
  isLocal: boolean;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', timezone: 'Africa/Lagos (WAT, UTC+1)', isLocal: true },
  { code: 'GH', name: 'Ghana', dialCode: '+233', timezone: 'Africa/Accra (GMT, UTC+0)', isLocal: false },
  { code: 'KE', name: 'Kenya', dialCode: '+254', timezone: 'Africa/Nairobi (EAT, UTC+3)', isLocal: false },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', timezone: 'Africa/Johannesburg (SAST, UTC+2)', isLocal: false },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', timezone: 'Africa/Kigali (CAT, UTC+2)', isLocal: false },
  { code: 'EG', name: 'Egypt', dialCode: '+20', timezone: 'Africa/Cairo (EEST, UTC+3)', isLocal: false },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', timezone: 'Europe/London (BST/GMT, UTC+1)', isLocal: false },
  { code: 'US', name: 'United States', dialCode: '+1', timezone: 'America/New_York (EST, UTC-5)', isLocal: false },
  { code: 'CA', name: 'Canada', dialCode: '+1', timezone: 'America/Toronto (EST, UTC-5)', isLocal: false },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', timezone: 'Asia/Dubai (GST, UTC+4)', isLocal: false },
  { code: 'DE', name: 'Germany', dialCode: '+49', timezone: 'Europe/Berlin (CEST, UTC+2)', isLocal: false },
  { code: 'IN', name: 'India', dialCode: '+91', timezone: 'Asia/Kolkata (IST, UTC+5:30)', isLocal: false },
  { code: 'AU', name: 'Australia', dialCode: '+61', timezone: 'Australia/Sydney (AEST, UTC+10)', isLocal: false },
  { code: 'OTHER', name: 'Other International Location', dialCode: '+', timezone: 'UTC', isLocal: false }
];
