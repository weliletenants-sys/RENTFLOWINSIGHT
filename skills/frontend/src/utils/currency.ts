/**
 * currency.ts
 * Detects the user's local currency via IP geolocation (ipapi.co).
 * Falls back to UGX (platform base currency) while the request loads or on error.
 */
import { useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;   // ISO 4217 e.g. "UGX"
  symbol: string; // Display symbol e.g. "UGX", "KES", "$"
  name: string;   // e.g. "Ugandan Shilling"
  locale: string; // e.g. "en-UG"
}

/** ISO currency code → display symbol */
const CURRENCY_SYMBOLS: Record<string, string> = {
  UGX: 'UGX', KES: 'KES', TZS: 'TZS', RWF: 'RWF', BIF: 'BIF',
  ETB: 'ETB', SOS: 'SOS', NGN: '₦',   GHS: 'GH₵', XOF: 'CFA',
  ZAR: 'R',   ZMW: 'ZK',  MWK: 'MK',  BWP: 'P',   NAD: 'N$',
  EGP: 'E£',  MAD: 'MAD', USD: '$',   CAD: 'CA$', GBP: '£',
  EUR: '€',   AED: 'AED', SAR: 'SR',  INR: '₹',   CNY: '¥',
  JPY: '¥',   SGD: 'S$',  AUD: 'A$',  NZD: 'NZ$', BRL: 'R$',
  MXN: 'MX$', ZWL: 'Z$',  MZN: 'MT',  DZD: 'DA',  TND: 'DT',
  LYD: 'LD',  SDG: 'SDG', ERN: 'ERN', DJF: 'DJF', GNF: 'GNF',
  SLL: 'Le',  LRD: 'L$',
};

/** Country code → locale */
const COUNTRY_LOCALE: Record<string, string> = {
  UG: 'en-UG', KE: 'en-KE', TZ: 'sw-TZ', RW: 'en-RW', BI: 'fr-BI',
  ET: 'am-ET', SO: 'so-SO', NG: 'en-NG', GH: 'en-GH', CI: 'fr-CI',
  ZA: 'en-ZA', ZM: 'en-ZM', MW: 'en-MW', BW: 'en-BW', NA: 'en-NA',
  EG: 'ar-EG', MA: 'ar-MA', US: 'en-US', CA: 'en-CA', GB: 'en-GB',
  DE: 'de-DE', FR: 'fr-FR', AE: 'ar-AE', SA: 'ar-SA', IN: 'en-IN',
  CN: 'zh-CN', JP: 'ja-JP', SG: 'en-SG', AU: 'en-AU', NZ: 'en-NZ',
  BR: 'pt-BR', MX: 'es-MX', ZW: 'en-ZW', MZ: 'pt-MZ',
};

const FALLBACK: CurrencyInfo = {
  code: 'UGX', symbol: 'UGX', name: 'Ugandan Shilling', locale: 'en-UG',
};

function buildCurrencyInfo(code: string, name: string, country: string): CurrencyInfo {
  return {
    code,
    symbol: CURRENCY_SYMBOLS[code] ?? code,
    name,
    locale: COUNTRY_LOCALE[country] ?? 'en-UG',
  };
}

const SESSION_KEY = 'welile_currency';

/**
 * React hook — detects the user's currency via IP geolocation (ipapi.co).
 * Shows UGX immediately and silently updates once the lookup resolves.
 * Result is cached in sessionStorage (one fetch per browser session).
 */
export function useCurrency(): CurrencyInfo {
  const [currency, setCurrency] = useState<CurrencyInfo>(() => {
    try {
      const cached = sessionStorage.getItem(SESSION_KEY);
      if (cached) return JSON.parse(cached) as CurrencyInfo;
    } catch (_) { /* ignore */ }
    return FALLBACK;
  });

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return; // already cached

    const controller = new AbortController();

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(res => res.json())
      .then((data: { currency?: string; currency_name?: string; country_code?: string }) => {
        if (data.currency && data.currency_name && data.country_code) {
          const info = buildCurrencyInfo(data.currency, data.currency_name, data.country_code);
          setCurrency(info);
          try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(info)); } catch (_) { /* ignore */ }
        }
      })
      .catch(() => { /* network unavailable — keep fallback */ });

    return () => controller.abort();
  }, []);

  return currency;
}

/**
 * Compact currency formatter.
 * e.g. formatCurrencyCompact(5_350_250, ugx) → "UGX 5.35M"
 */
export function formatCurrencyCompact(amount: number, currency: CurrencyInfo): string {
  const sym = currency.symbol;
  if (amount >= 1_000_000) return `${sym} ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000)     return `${sym} ${(amount / 1_000).toFixed(0)}K`;
  return `${sym} ${Math.round(amount).toLocaleString()}`;
}
