import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URLS, MARKET_PRICES_MOCK } from '@/config/api';
import type {
  ApiError,
  ExchangeRate,
  MarketPrice,
  RawExchangeRateResponse,
  RawMarketPrice,
} from '@/types/market';
import { mapRawExchangeRate, mapRawMarketPrice } from '@/utils/marketMapper';

const CACHE_TTL_MS = 30 * 60 * 1000;
export const CACHE_KEYS = {
  marketPrices: '@kosmate:market-prices',
  exchangeRates: '@kosmate:exchange-rates',
} as const;

export interface CachedData<T> {
  data: T;
  isOffline: boolean;
}

interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

// KONSEP #2: Error jaringan diseragamkan agar screen dapat menampilkan pesan yang mudah dipahami.
export function toApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message;
    const statusCode = 'statusCode' in error ? error.statusCode : undefined;

    if (typeof message === 'string') {
      return {
        message,
        ...(typeof statusCode === 'number' ? { statusCode } : {}),
      };
    }
  }

  return { message: 'Tidak dapat memuat data. Periksa koneksi internetmu.' };
}

/**
 * KONSEP #3: Custom Network Function dengan new Promise, resolve(), dan reject().
 * Secara nyata membatasi waktu tunggu request (network timeout) ke External API
 * agar aplikasi tidak hanging ketika koneksi buruk/edge.
 */
export function fetchWithTimeout<T>(url: string, timeoutMs = 8000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        reject({
          message: `Koneksi waktu habis (${timeoutMs / 1000}s). Server tidak merespons, coba periksa sinyalmu.`,
          statusCode: 408,
        } satisfies ApiError);
      }
    }, timeoutMs);

    // Memanggil pre-built async function fetch()
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw {
            message: `Server merespons dengan status error: ${response.status}`,
            statusCode: response.status,
          } satisfies ApiError;
        }
        return response.json() as Promise<T>;
      })
      .then((data) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve(data); // Memanggil resolve() saat data API valid
        }
      })
      .catch((err) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          reject(toApiError(err)); // Memanggil reject() saat terjadi error jaringan
        }
      });
  });
}

/**
 * KONSEP #1, #2, & #3:
 * Mengambil data live kurs dari external API open.er-api.com,
 * diproses melalui rantai .then() dan dipetakan ke Object ber-Interface ExchangeRate.
 */
export function fetchLiveExchangeRates(timeoutMs = 8000): Promise<ExchangeRate[]> {
  return fetchWithTimeout<RawExchangeRateResponse>(API_URLS.exchangeRates, timeoutMs)
    .then((raw) => {
      if (raw.result !== 'success' || !raw.rates) {
        throw {
          message: 'Format data kurs dari server tidak valid.',
        } satisfies ApiError;
      }
      // Memetakan ke interface ExchangeRate
      return ['USD', 'SGD', 'MYR'].map((currency) => mapRawExchangeRate(raw, currency));
    });
}

// KONSEP #2: Cache terpusat mencoba jaringan dan memakai data lokal jika permintaan gagal.
async function getCachedData<T>(
  key: string,
  loadFromApi: () => Promise<T>,
  forceRefresh: boolean
): Promise<CachedData<T>> {
  const rawCache = await AsyncStorage.getItem(key);
  let cached: CacheEntry<T> | null = null;

  if (rawCache) {
    try {
      cached = JSON.parse(rawCache) as CacheEntry<T>;
    } catch {
      await AsyncStorage.removeItem(key);
    }
  }

  // Jika cache masih baru (< 30 menit) dan tidak dipaksa refresh, gunakan cache sebagai data valid (bukan offline)
  if (cached && !forceRefresh && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    return { data: cached.data, isOffline: false };
  }

  try {
    const data = await loadFromApi();
    const entry: CacheEntry<T> = { data, savedAt: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
    return { data, isOffline: false };
  } catch (error: unknown) {
    // Jika panggilan API gagal tapi kita punya cache sebelumnya, fallback ke offline cache
    if (cached) return { data: cached.data, isOffline: true };
    throw toApiError(error);
  }
}

// KONSEP #2: Data harga katalog lokal disimpan dengan pola cache yang sama seperti API.
export async function getMarketPrices(forceRefresh = false): Promise<CachedData<MarketPrice[]>> {
  const mockPrices: RawMarketPrice[] = MARKET_PRICES_MOCK.map((item) => ({ ...item }));
  return getCachedData(
    CACHE_KEYS.marketPrices,
    async () => mockPrices.map(mapRawMarketPrice),
    forceRefresh
  );
}

// KONSEP #2: Mendukung backward-compatibility untuk komponen yang memanggil getExchangeRates
export async function getExchangeRates(forceRefresh = false): Promise<CachedData<ExchangeRate[]>> {
  return getCachedData(
    CACHE_KEYS.exchangeRates,
    () => fetchLiveExchangeRates(),
    forceRefresh
  );
}
