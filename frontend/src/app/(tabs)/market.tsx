import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { fetchLiveExchangeRates } from '@/services/marketApi';
import type { ApiError, ExchangeRate } from '@/types/market';

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string';
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatForeign(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    SGD: 'S$',
    MYR: 'RM',
  };
  const symbol = symbols[currency] || `${currency} `;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Data daftar langganan digital populer anak muda dalam USD
const DIGITAL_SUBSCRIPTIONS = [
  { id: 'chatgpt', name: 'ChatGPT Plus', icon: 'cpu', usdPrice: 20.0, category: 'AI & Produktivitas' },
  { id: 'netflix', name: 'Netflix Standar', icon: 'film', usdPrice: 3.99, category: 'Hiburan' },
  { id: 'spotify', name: 'Spotify Individual', icon: 'music', usdPrice: 2.99, category: 'Musik' },
  { id: 'youtube', name: 'YouTube Premium', icon: 'play-circle', usdPrice: 4.5, category: 'Video' },
  { id: 'gdrive', name: 'Google One (100GB)', icon: 'cloud', usdPrice: 1.99, category: 'Penyimpanan' },
] as const;

export default function MarketScreen() {
  const insets = useSafeAreaInsets();

  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Fitur 1: Kalkulator Valas
  const [calcInput, setCalcInput] = useState('100000');

  // State Fitur 2: Simulasi Frekuensi Transfer per Bulan
  const [transferFrequency, setTransferFrequency] = useState<number>(6);

  /**
   * KONSEP #2 & #3:
   * Mengambil data external API menggunakan rantai .then(), .catch(), dan .finally().
   * Custom function fetchLiveExchangeRates() mengembalikan Promise nyata dengan proteksi timeout (resolve/reject).
   */
  const loadData = useCallback(() => {
    setErrorMessage(null);

    fetchLiveExchangeRates()
      .then((rates) => {
        setExchangeRates(rates);
        setIsOffline(false);
      })
      .catch((error: unknown) => {
        setErrorMessage(isApiError(error) ? error.message : 'Gagal memuat kurs mata uang.');
        setIsOffline(true);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const parsedCalcAmount = parseFloat(calcInput.replace(/[^0-9]/g, '')) || 0;
  const usdRateObj = exchangeRates.find((r) => r.targetCurrency === 'USD');
  const usdToIdr = usdRateObj && usdRateObj.inverseRate > 0 ? usdRateObj.inverseRate : 16200;

  // Hitungan Penghematan Biaya Admin per Tahun
  // Transfer biasa: Rp 6.500 vs BI-FAST: Rp 2.500 (selisih Rp 4.000)
  // vs Bebas Biaya (Flip/Bank Digital): selisih Rp 6.500
  const yearlySavingsBiFast = transferFrequency * 4000 * 12;
  const yearlySavingsFree = transferFrequency * 6500 * 12;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 18 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ─── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Info Finansial</Text>
        <Text style={styles.subtitle}>Kurs valas live, biaya langganan digital & panduan hemat</Text>
      </View>

      {/* ─── Offline Banner ────────────────────────────────────── */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Feather name="wifi-off" size={16} color={COLORS.warning} />
          <Text style={styles.offlineText}>Koneksi API terganggu — mencoba memuat kembali.</Text>
        </View>
      )}

      {loading && exchangeRates.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.stateText}>Menghubungkan ke API kurs live...</Text>
        </View>
      ) : errorMessage && exchangeRates.length === 0 ? (
        <View style={styles.centerState}>
          <Feather name="alert-circle" size={32} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════
              FITUR 1: Kurs Valas Live & Kalkulator Langganan Digital
          ══════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.iconBubble}>
                <Feather name="globe" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Kurs Valuta Asing</Text>
                <Text style={styles.sectionSubtitle}>Data live dari Open Exchange API</Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>LIVE API</Text>
              </View>
            </View>

            {/* List Kurs */}
            {exchangeRates.map((item) => (
              <View key={item.targetCurrency} style={styles.dataRow}>
                <View>
                  <Text style={styles.dataName}>1 {item.targetCurrency}</Text>
                  <Text style={styles.dataMeta}>
                    1 IDR = {item.rate.toFixed(6)} {item.targetCurrency}
                  </Text>
                </View>
                <Text style={styles.dataValue}>
                  {formatRupiah(Math.round(item.inverseRate))}
                </Text>
              </View>
            ))}

            {/* Kalkulator Valas Interaktif */}
            <View style={styles.calcBox}>
              <Text style={styles.calcLabel}>Kalkulator Konversi Kurs</Text>
              <View style={styles.calcInputWrapper}>
                <Text style={styles.calcInputPrefix}>Rp</Text>
                <TextInput
                  style={styles.calcInput}
                  keyboardType="numeric"
                  value={calcInput}
                  onChangeText={setCalcInput}
                  placeholder="Nominal rupiah"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>

              <View style={styles.chipsRow}>
                {[50000, 100000, 250000, 500000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.chip,
                      parsedCalcAmount === amt && styles.chipActive,
                    ]}
                    onPress={() => setCalcInput(amt.toString())}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        parsedCalcAmount === amt && styles.chipTextActive,
                      ]}
                    >
                      Rp{amt / 1000}rb
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.calcResultsBox}>
                {exchangeRates.map((item) => {
                  const converted = parsedCalcAmount * item.rate;
                  return (
                    <View key={item.targetCurrency} style={styles.calcResultRow}>
                      <Text style={styles.calcResultCurrency}>{item.targetCurrency}</Text>
                      <Text style={styles.calcResultValue}>
                        {formatForeign(converted, item.targetCurrency)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* ══════════════════════════════════════════════════════════
              FITUR 1B: Estimasi Biaya Langganan Digital (USD -> IDR)
          ══════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.iconBubble}>
                <Feather name="tv" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Estimasi Langganan Digital</Text>
                <Text style={styles.sectionSubtitle}>Dikonversi otomatis ke kurs USD hari ini</Text>
              </View>
            </View>

            {DIGITAL_SUBSCRIPTIONS.map((sub) => {
              const estimatedIdr = Math.round(sub.usdPrice * usdToIdr);
              return (
                <View key={sub.id} style={styles.dataRow}>
                  <View style={styles.subLeft}>
                    <View style={styles.subIconWrap}>
                      <Feather name={sub.icon as any} size={16} color={COLORS.secondary} />
                    </View>
                    <View>
                      <Text style={styles.dataName}>{sub.name}</Text>
                      <Text style={styles.dataMeta}>
                        ${sub.usdPrice.toFixed(2)}/bln · {sub.category}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dataValue}>{formatRupiah(estimatedIdr)}</Text>
                </View>
              );
            })}

            <View style={styles.infoTipBox}>
              <Feather name="info" size={14} color={COLORS.secondary} />
              <Text style={styles.infoTipText}>
                Tips: Gunakan paket <Text style={{ fontWeight: '700' }}>Student Plan</Text> atau patungan <Text style={{ fontWeight: '700' }}>Family Plan</Text> dengan teman kos untuk hemat hingga 60%.
              </Text>
            </View>
          </View>

          {/* ══════════════════════════════════════════════════════════
              FITUR 2: Panduan & Penghemat Biaya Transfer / Top-Up
          ══════════════════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.iconBubble}>
                <Feather name="credit-card" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Panduan Hemat Biaya Transfer</Text>
                <Text style={styles.sectionSubtitle}>Hindari bocor halus biaya admin bank</Text>
              </View>
            </View>

            {/* Perbandingan Metode Transfer */}
            <View style={styles.transferComparison}>
              <View style={styles.transferRow}>
                <Text style={styles.transferName}>Transfer Online Biasa</Text>
                <Text style={styles.transferFeeBad}>Rp 6.500</Text>
              </View>
              <View style={styles.transferRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.transferName}>BI-FAST</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>REKOMENDASI</Text>
                  </View>
                </View>
                <Text style={styles.transferFeeGood}>Rp 2.500</Text>
              </View>
              <View style={styles.transferRow}>
                <Text style={styles.transferName}>Top-Up E-Wallet (BCA/BRI)</Text>
                <Text style={styles.transferFeeNeutral}>Rp 1.000 – 2.000</Text>
              </View>
              <View style={[styles.transferRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.transferName}>Aplikasi Gratis (Flip / Jago)</Text>
                <Text style={styles.transferFeeFree}>Rp 0 (Gratis)</Text>
              </View>
            </View>

            {/* Simulasi Penghematan Setahun */}
            <View style={styles.savingsBox}>
              <Text style={styles.savingsTitle}>Simulasi Penghematan Anak Kos</Text>
              <Text style={styles.savingsSubtitle}>
                Berapa kali kamu transfer atau top-up dalam sebulan?
              </Text>

              <View style={styles.chipsRow}>
                {[4, 6, 8, 12].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.chip,
                      transferFrequency === freq && styles.chipActive,
                    ]}
                    onPress={() => setTransferFrequency(freq)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        transferFrequency === freq && styles.chipTextActive,
                      ]}
                    >
                      {freq}x / bln
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.savingsResultCard}>
                <View style={styles.savingsResultRow}>
                  <Text style={styles.savingsLabel}>Hemat pakai BI-FAST:</Text>
                  <Text style={styles.savingsHighlight}>{formatRupiah(yearlySavingsBiFast)} / thn</Text>
                </View>
                <View style={styles.savingsResultRow}>
                  <Text style={styles.savingsLabel}>Hemat pakai Flip/Gratis:</Text>
                  <Text style={styles.savingsHighlightFree}>{formatRupiah(yearlySavingsFree)} / thn</Text>
                </View>
                <Text style={styles.savingsNote}>
                  💡 Uang Rp{Math.round(yearlySavingsFree / 1000)}rb ini bisa untuk 15–20 kali makan siang di warteg!
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { marginBottom: 20 },
  title: { color: COLORS.primary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },

  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF6E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  offlineText: { color: COLORS.warning, fontSize: 12, fontWeight: '600', flex: 1 },

  centerState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 70, gap: 14 },
  stateText: { color: COLORS.textSecondary, fontSize: 14 },
  errorText: { color: COLORS.error, fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
  retryButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 12 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },

  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0F7',
  },
  sectionTitle: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  sectionSubtitle: { color: COLORS.textSecondary, fontSize: 11, marginTop: 1 },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF4EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  liveBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.success },

  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1EEF2',
  },
  dataName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  dataMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  dataValue: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },

  // Kalkulator valas
  calcBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECE8E3',
  },
  calcLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  calcInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E6E2EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 10,
  },
  calcInputPrefix: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginRight: 6 },
  calcInput: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F3F0F7',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 11, fontWeight: '700', color: COLORS.secondary },
  chipTextActive: { color: '#FFFFFF' },

  calcResultsBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  calcResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  calcResultCurrency: { fontSize: 13, fontWeight: '700', color: COLORS.secondary },
  calcResultValue: { fontSize: 14, fontWeight: '800', color: COLORS.primary },

  // Langganan Digital
  subLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  subIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3F0F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F0F7',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  infoTipText: { flex: 1, fontSize: 11, color: COLORS.text, lineHeight: 16 },

  // Transfer & E-Wallet
  transferComparison: {
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8E3',
  },
  transferName: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  transferFeeBad: { fontSize: 13, color: COLORS.error, fontWeight: '700' },
  transferFeeGood: { fontSize: 13, color: '#2E7D32', fontWeight: '700' },
  transferFeeNeutral: { fontSize: 13, color: COLORS.warning, fontWeight: '700' },
  transferFeeFree: { fontSize: 13, color: COLORS.success, fontWeight: '800' },

  recommendedBadge: {
    backgroundColor: '#EAF4EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedBadgeText: { fontSize: 8, fontWeight: '800', color: COLORS.success },

  savingsBox: {
    paddingTop: 10,
  },
  savingsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  savingsSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 10 },
  savingsResultCard: {
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: COLORS.peach,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  savingsResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  savingsHighlight: { fontSize: 13, color: '#D97706', fontWeight: '800' },
  savingsHighlightFree: { fontSize: 13, color: COLORS.success, fontWeight: '800' },
  savingsNote: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, lineHeight: 16 },
});
