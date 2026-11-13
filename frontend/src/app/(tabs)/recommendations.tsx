import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { useKosMate } from '@/context/KosMateContext';
import type { ShoppingItem, ShoppingPriority } from '@/types/need';
import { getCurrentMonthKey, getMonthlyFinanceSummary } from '@/utils/monthlyBudget';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ShoppingPlan {
  pendingItems: ShoppingItem[];
  recommendedItems: ShoppingItem[];
  deferredItems: ShoppingItem[];
  currentMonthSpending: number;
  remainingBudget: number;
  plannedTotal: number;
  recommendedTotal: number;
  deferredTotal: number;
  monthlyIncome: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PRIORITY_ORDER: Record<ShoppingPriority, number> = {
  Tinggi: 0,
  Sedang: 1,
  Rendah: 2,
};

const PRIORITY_COLOR: Record<ShoppingPriority, string> = {
  Tinggi: '#E06D53',
  Sedang: '#E9A23B',
  Rendah: '#7E57C2',
};

// Tips berdasarkan kategori pengeluaran terbesar
const CATEGORY_TIPS: Record<string, string> = {
  Makanan: 'Coba masak sendiri 2–3 kali seminggu. Bisa hemat hingga 40% dari biaya makan di luar.',
  Transportasi: 'Gabungkan beberapa keperluan dalam satu perjalanan untuk menghemat ongkos transport.',
  Belanja: 'Buat daftar belanja sebelum ke toko dan patuhi daftar tersebut agar tidak impulsif.',
  Tagihan: 'Cabut charger dan matikan lampu saat tidak dipakai untuk mengurangi tagihan listrik.',
  Kos: 'Bayar kos tepat waktu untuk menghindari denda keterlambatan.',
  Pendidikan: 'Manfaatkan perpustakaan kampus atau e-book gratis sebelum membeli buku baru.',
  Lainnya: 'Tinjau kembali pengeluaran "Lainnya" setiap minggu — sering ada biaya kecil yang bisa dipangkas.',
};

const DEFAULT_TIPS = [
  'Catat setiap pengeluaran sekecil apapun agar tidak ada yang terlewat di akhir bulan.',
  'Pisahkan tabungan di awal bulan sebelum mulai belanja kebutuhan.',
  'Bandingkan harga di beberapa tempat sebelum membeli barang yang harganya di atas Rp 50.000.',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return dateStr;
  }
}

function getPersonalizedTips(
  transactions: ReturnType<typeof useKosMate>['transactions'],
  count = 3
): string[] {
  const currentMonth = getCurrentMonthKey();
  const expenses = transactions.filter(
    (tx) => tx.type === 'expense' && tx.date.startsWith(currentMonth)
  );

  if (expenses.length === 0) return DEFAULT_TIPS.slice(0, count);

  // Hitung total per kategori
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  // Ambil kategori terbesar
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  const tips: string[] = [];
  for (const cat of topCategories) {
    if (tips.length >= count) break;
    if (CATEGORY_TIPS[cat]) tips.push(CATEGORY_TIPS[cat]);
  }

  // Isi dengan tips default jika kurang
  for (const tip of DEFAULT_TIPS) {
    if (tips.length >= count) break;
    if (!tips.includes(tip)) tips.push(tip);
  }

  return tips.slice(0, count);
}

function createShoppingPlan(
  items: ShoppingItem[],
  transactions: ReturnType<typeof useKosMate>['transactions']
): ShoppingPlan {
  const { income: monthlyIncome, spent: currentMonthSpending, remaining } =
    getMonthlyFinanceSummary(transactions);
  const remainingBudget = Math.max(0, remaining);

  const pendingItems = items
    .filter((item) => !item.purchased)
    .sort(
      (first, second) =>
        PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority] ||
        first.targetDate.localeCompare(second.targetDate)
    );

  const plannedTotal = pendingItems.reduce((total, item) => total + item.price, 0);
  const recommendedItems: ShoppingItem[] = [];
  let remainingAfterRecommendations = remainingBudget;

  for (const item of pendingItems) {
    if (item.price <= remainingAfterRecommendations) {
      recommendedItems.push(item);
      remainingAfterRecommendations -= item.price;
    }
  }

  const recommendedIds = new Set(recommendedItems.map((i) => i.id));
  const deferredItems = pendingItems.filter((item) => !recommendedIds.has(item.id));

  return {
    pendingItems,
    recommendedItems,
    deferredItems,
    currentMonthSpending,
    remainingBudget: remaining,
    plannedTotal,
    recommendedTotal: recommendedItems.reduce((total, item) => total + item.price, 0),
    deferredTotal: deferredItems.reduce((total, item) => total + item.price, 0),
    monthlyIncome,
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RecommendationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shoppingItems, transactions } = useKosMate();

  const plan = useMemo(
    () => createShoppingPlan(shoppingItems, transactions),
    [shoppingItems, transactions]
  );

  const tips = useMemo(() => getPersonalizedTips(transactions), [transactions]);

  // Kalkulator Dana Darurat
  const defaultMonthlyNeed = plan.currentMonthSpending > 0
    ? plan.currentMonthSpending
    : plan.monthlyIncome > 0
      ? plan.monthlyIncome
      : 1500000;
  const [monthlyExpenseInput, setMonthlyExpenseInput] = useState(defaultMonthlyNeed.toString());
  const currentMonthlyExpense = parseFloat(monthlyExpenseInput.replace(/[^0-9]/g, '')) || 0;
  const emergencyTier1 = currentMonthlyExpense * 1;
  const emergencyTier3 = currentMonthlyExpense * 3;

  const recommendationMessage =
    plan.pendingItems.length === 0
      ? 'Daftar kebutuhanmu sudah terpenuhi. Tambahkan kebutuhan baru dari tab List.'
      : plan.plannedTotal <= plan.remainingBudget
        ? 'Semua kebutuhan yang belum dibeli masih sesuai dengan sisa anggaran bulan ini.'
        : plan.recommendedItems.length > 0
          ? 'Mulai dari barang prioritas yang muat dalam sisa anggaran. Barang lain dijadwalkan berikutnya.'
          : 'Sisa anggaran belum cukup untuk estimasi barang mana pun. Coba atur ulang prioritas atau estimasi harga.';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Belanja Hemat</Text>
        <Text style={styles.subtitle}>Rencana belanja sesuai sisa anggaranmu</Text>
      </View>

      {/* ─── Budget Card ───────────────────────────────────────────── */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetIcon}>
          <Feather name="pie-chart" size={19} color={COLORS.primary} />
        </View>
        <Text style={styles.eyebrow}>SISA ANGGARAN BULAN INI</Text>
        <Text style={styles.budgetAmount}>{formatRupiah(plan.remainingBudget)}</Text>
        <View style={styles.budgetDivider} />
        <View style={styles.budgetStats}>
          <View style={styles.budgetStat}>
            <Text style={styles.statLabel}>Estimasi kebutuhan</Text>
            <Text style={styles.statValue}>{formatRupiah(plan.plannedTotal)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.budgetStat}>
            <Text style={styles.statLabel}>Pengeluaran bulan ini</Text>
            <Text style={styles.statValue}>{formatRupiah(plan.currentMonthSpending)}</Text>
          </View>
        </View>
      </View>

      {/* ─── Saran Belanja Card ────────────────────────────────────── */}
      <View style={styles.planCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.iconBubble}>
            <Feather name="shopping-cart" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>Saran belanja</Text>
        </View>
        <Text style={styles.recommendationText}>{recommendationMessage}</Text>

        {/* ✅ Bisa dibeli sekarang */}
        {plan.recommendedItems.length > 0 && (
          <View style={styles.itemGroup}>
            <View style={styles.groupHeader}>
              <View style={[styles.groupDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.groupLabel}>Bisa dibeli sekarang</Text>
              <Text style={styles.groupTotal}>{formatRupiah(plan.recommendedTotal)}</Text>
            </View>
            {plan.recommendedItems.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  idx === 0 && styles.itemRowFirst,
                ]}
              >
                <View style={styles.itemMain}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLOR[item.priority] + '20' }]}>
                      <Text style={[styles.priorityText, { color: PRIORITY_COLOR[item.priority] }]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.itemMeta}>
                    Target {formatDate(item.targetDate)} · {item.category}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ⏳ Harus ditunda */}
        {plan.deferredItems.length > 0 && (
          <View style={[styles.itemGroup, styles.itemGroupDeferred]}>
            <View style={styles.groupHeader}>
              <View style={[styles.groupDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.groupLabel}>Tunda dulu</Text>
              <Text style={styles.groupTotal}>{formatRupiah(plan.deferredTotal)}</Text>
            </View>
            <Text style={styles.deferredNote}>
              Barang berikut belum muat di sisa anggaran bulan ini. Jadwalkan ke bulan depan.
            </Text>
            {plan.deferredItems.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  styles.itemRowDeferred,
                  idx === 0 && styles.itemRowFirst,
                ]}
              >
                <View style={styles.itemMain}>
                  <View style={styles.itemNameRow}>
                    <Text style={[styles.itemName, styles.itemNameDeferred]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLOR[item.priority] + '20' }]}>
                      <Text style={[styles.priorityText, { color: PRIORITY_COLOR[item.priority] }]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.itemMeta}>
                    Target {formatDate(item.targetDate)} · {item.category}
                  </Text>
                </View>
                <Text style={styles.itemPriceDeferred}>{formatRupiah(item.price)}</Text>
              </View>
            ))}

            {/* Kekurangan anggaran */}
            {plan.remainingBudget < plan.plannedTotal && (
              <View style={styles.shortfallRow}>
                <Feather name="alert-circle" size={13} color={COLORS.warning} />
                <Text style={styles.shortfallText}>
                  Kekurangan anggaran:{' '}
                  <Text style={styles.shortfallAmount}>
                    {formatRupiah(plan.plannedTotal - Math.max(0, plan.remainingBudget))}
                  </Text>
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Empty state: semua sudah terpenuhi */}
        {plan.pendingItems.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={32} color={COLORS.success} />
            <Text style={styles.emptyTitle}>Semua kebutuhan terpenuhi!</Text>
            <Text style={styles.emptyText}>Tambahkan kebutuhan baru jika ada yang perlu dibeli.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.listButton} onPress={() => router.push('/needs')}>
          <Text style={styles.listButtonText}>Atur daftar kebutuhan</Text>
          <Feather name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ─── Kalkulator Dana Darurat Anak Kos ──────────────────────── */}
      <View style={styles.emergencyCardContainer}>
        <View style={styles.sectionHeading}>
          <View style={styles.iconBubble}>
            <Feather name="shield" size={18} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Kalkulator Dana Darurat</Text>
            <Text style={styles.sectionSubtitle}>Target tabungan siaga anak kos</Text>
          </View>
        </View>

        <Text style={styles.calcDesc}>
          Berapa estimasi kebutuhan hidupmu per bulan?
        </Text>

        <View style={styles.calcInputWrapper}>
          <Text style={styles.calcInputPrefix}>Rp</Text>
          <TextInput
            style={styles.calcInput}
            keyboardType="numeric"
            value={monthlyExpenseInput}
            onChangeText={setMonthlyExpenseInput}
            placeholder="Pengeluaran per bulan"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Target Cards Grid */}
        <View style={styles.emergencyGrid}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyCardTop}>
              <Text style={styles.emergencyTier}>Level 1: Siaga</Text>
              <Text style={styles.emergencyMonths}>1 Bulan</Text>
            </View>
            <Text style={styles.emergencyAmount}>{formatRupiah(emergencyTier1)}</Text>
            <Text style={styles.emergencyHelp}>
              Untuk insiden darurat mendadak (obat/sakit, ban bocor, servis laptop).
            </Text>
          </View>

          <View style={[styles.emergencyCard, styles.emergencyCardSafe]}>
            <View style={styles.emergencyCardTop}>
              <Text style={[styles.emergencyTier, { color: COLORS.success }]}>Level 2: Aman</Text>
              <Text style={styles.emergencyMonths}>3 Bulan</Text>
            </View>
            <Text style={[styles.emergencyAmount, { color: COLORS.success }]}>{formatRupiah(emergencyTier3)}</Text>
            <Text style={styles.emergencyHelp}>
              Cadangan aman jika kiriman bulanan terlambat atau pemasukan seret.
            </Text>
          </View>
        </View>

        <View style={styles.stepTipBox}>
          <Feather name="check-circle" size={14} color="#1B5E20" />
          <Text style={styles.stepTipText}>
            Langkah hemat: Sisihkan <Text style={{ fontWeight: '700' }}>Rp 5.000 – Rp 10.000 per hari</Text> dari sisa uang makan di kantong terpisah.
          </Text>
        </View>
      </View>

      {/* ─── Tips Hemat Personal ───────────────────────────────────── */}
      <View style={styles.tipsCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.iconBubble}>
            <Feather name="zap" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.sectionTitle}>Tips hemat untukmu</Text>
        </View>

        {plan.monthlyIncome > 0 ? (
          <Text style={styles.tipsSubtitle}>
            Berdasarkan pengeluaran terbesarmu bulan ini:
          </Text>
        ) : (
          <Text style={styles.tipsSubtitle}>
            Tips umum untuk anak kos yang hemat:
          </Text>
        )}

        <View style={styles.tipsList}>
          {tips.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <View style={styles.tipNumberBadge}>
                <Text style={styles.tipNumber}>{idx + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 18, paddingBottom: 120 },

  // Header
  header: { marginBottom: 18 },
  title: { color: COLORS.primary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 },

  // Budget Card
  budgetCard: {
    backgroundColor: '#F3F0F7',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  budgetIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  eyebrow: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  budgetAmount: {
    color: COLORS.primary,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 5,
  },
  budgetDivider: {
    height: 1,
    backgroundColor: '#DED9E8',
    marginVertical: 16,
  },
  budgetStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  budgetStat: { flex: 1 },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, marginBottom: 5 },
  statValue: { color: COLORS.text, fontSize: 12, fontWeight: '700' },
  statDivider: { width: 1, height: 34, backgroundColor: '#DED9E8' },

  // Plan Card (Saran Belanja)
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Section Heading shared
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 12,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F0F7',
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  // Recommendation message
  recommendationText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },

  // Item Groups (Bisa dibeli & Tunda)
  itemGroup: {
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FAFAF9',
    borderWidth: 1,
    borderColor: '#ECE8E3',
  },
  itemGroupDeferred: {
    backgroundColor: '#FFFBF5',
    borderColor: '#F1DFC8',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8E3',
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  groupLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  groupTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  deferredNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },

  // Item Rows
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1EEF2',
  },
  itemRowFirst: {
    borderTopWidth: 0,
  },
  itemRowDeferred: {
    opacity: 0.75,
  },
  itemMain: { flex: 1, marginRight: 10 },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    flexShrink: 1,
  },
  itemNameDeferred: {
    color: COLORS.textSecondary,
  },
  itemMeta: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemPriceDeferred: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },

  // Priority Badge
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
  },

  // Shortfall
  shortfallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1DFC8',
    backgroundColor: '#FFF6E9',
  },
  shortfallText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  shortfallAmount: {
    fontWeight: '700',
    color: COLORS.warning,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Action button
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Tips
  tipsSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  tipsList: { gap: 12 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F0F7',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  tipNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },

  // Dana Darurat
  emergencyCardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  calcDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    marginBottom: 12,
  },
  calcInputPrefix: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginRight: 6 },
  calcInput: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },

  emergencyGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  emergencyCard: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECE8E3',
    borderRadius: 14,
    padding: 12,
  },
  emergencyCardSafe: {
    backgroundColor: '#F2F8F4',
    borderColor: '#C8E6C9',
  },
  emergencyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  emergencyTier: { fontSize: 11, fontWeight: '700', color: COLORS.secondary },
  emergencyMonths: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  emergencyAmount: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  emergencyHelp: { fontSize: 10, color: COLORS.textSecondary, lineHeight: 14 },

  stepTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF4EE',
    padding: 12,
    borderRadius: 12,
  },
  stepTipText: { flex: 1, fontSize: 11, color: '#1B5E20', lineHeight: 16 },

  bottomSpace: { height: 20 },
});
