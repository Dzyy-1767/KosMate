// KONSEP #1: Interface ini menjadi bentuk data konsisten yang dipakai oleh antarmuka aplikasi.
export interface MarketPrice {
  id: string;
  name: string;
  unit: string;
  price: number;
  currency: 'IDR';
  updatedAt: string;
}

// KONSEP #1: Kurs menyimpan mata uang asal, tujuan, nilai, dan waktu pembaruan.
export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  inverseRate: number;
  updatedAt: string;
}

// KONSEP #1: ApiError menormalkan informasi gagal agar screen tidak bergantung format API.
export interface ApiError {
  message: string;
  statusCode?: number;
}

// KONSEP #1: Bentuk respons kurs mentah dari open.er-api.com.
export interface RawExchangeRateResponse {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

// KONSEP #1: Bentuk item katalog harga lokal sebelum dipetakan ke MarketPrice.
export interface RawMarketPrice {
  id: string;
  name: string;
  unit: string;
  price: number;
  updated_at: string;
}
