import type {
  ExchangeRate,
  MarketPrice,
  RawExchangeRateResponse,
  RawMarketPrice,
} from '@/types/market';

// KONSEP #1: Mapper menjaga screen menerima format seragam walau bentuk respons API berbeda.
export function mapRawMarketPrice(raw: RawMarketPrice): MarketPrice {
  return {
    id: raw.id,
    name: raw.name,
    unit: raw.unit,
    price: raw.price,
    currency: 'IDR',
    updatedAt: raw.updated_at,
  };
}

// KONSEP #1: Mapper memilih kurs target dari koleksi rates dan menjaga hasil bertipe.
export function mapRawExchangeRate(
  raw: RawExchangeRateResponse,
  targetCurrency: string
): ExchangeRate {
  const rate = raw.rates[targetCurrency];

  if (raw.result !== 'success' || typeof rate !== 'number') {
    throw new Error(`Kurs ${targetCurrency} tidak tersedia.`);
  }

  return {
    baseCurrency: raw.base_code,
    targetCurrency,
    rate,
    inverseRate: rate > 0 ? 1 / rate : 0,
    updatedAt: raw.time_last_update_utc,
  };
}
