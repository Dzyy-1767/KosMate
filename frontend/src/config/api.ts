// KONSEP #1: Semua alamat sumber data disimpan terpusat supaya mudah dirawat dan diganti.
export const API_URLS = {
  exchangeRates: 'https://open.er-api.com/v6/latest/IDR',
} as const;

// KONSEP #1: Data harga pangan mock lokal tidak membutuhkan endpoint jaringan.
export const MARKET_PRICES_MOCK = [
  { id: 'beras', name: 'Beras Premium', unit: 'kg', price: 15500, updated_at: '2026-11-01' },
  { id: 'telur', name: 'Telur Ayam Ras', unit: 'kg', price: 28500, updated_at: '2026-11-01' },
  { id: 'minyak', name: 'Minyak Goreng Sawit', unit: 'liter', price: 17500, updated_at: '2026-11-01' },
  { id: 'mie', name: 'Mie Instan (Dus isi 40)', unit: 'dus', price: 118000, updated_at: '2026-11-01' },
  { id: 'ayam', name: 'Daging Ayam Broiler', unit: 'kg', price: 35000, updated_at: '2026-11-01' },
  { id: 'tempe', name: 'Tempe & Tahu Segar', unit: 'porsi', price: 8000, updated_at: '2026-11-01' },
  { id: 'galon', name: 'Air Galon Isi Ulang', unit: 'galon', price: 6000, updated_at: '2026-11-01' },
  { id: 'gas', name: 'Gas Elpiji 3kg (Refill)', unit: 'tabung', price: 22000, updated_at: '2026-11-01' },
] as const;
