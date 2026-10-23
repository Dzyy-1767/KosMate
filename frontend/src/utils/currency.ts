/**
 * Format angka menjadi format Rupiah Indonesia.
 *
 * Contoh:
 *   formatRupiah(25000)  → "Rp25.000"
 *   formatRupiah(2500000) → "Rp2.500.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
