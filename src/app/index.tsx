import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';
import { useKosMate } from '../context/KosMateContext';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortRupiah(amount: number): string {
  return `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(`${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return dateStr;
  }
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { transactions, monthlyBudget, profile } = useKosMate();

  const expenses = transactions.filter((item) => item.type === 'expense');
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = monthlyBudget - spent;
  const ratio = monthlyBudget > 0 ? remaining / monthlyBudget : 0;
  const progressPercent = monthlyBudget > 0 ? Math.min(100, Math.round((spent / monthlyBudget) * 100)) : 0;

  // Insight calculation
  const insight =
    ratio > 0.45
      ? {
          status: 'Aman',
          color: COLORS.success,
          bgColor: '#EAF4EE',
          borderColor: '#D8EADF',
          title: 'Keuanganmu masih terkendali',
          text: 'Pengeluaranmu masih dalam batas sehat. Pertahankan ritme ini sampai akhir bulan.',
        }
      : ratio > 0.2
        ? {
            status: 'Kurang Aman',
            color: COLORS.warning,
            bgColor: '#FFF6E9',
            borderColor: '#F1DFC8',
            title: 'Saatnya lebih berhati-hati',
            text: 'Kurangi pengeluaran tidak penting agar anggaranmu cukup sampai akhir bulan.',
          }
        : {
            status: 'Tidak Aman',
            color: COLORS.error,
            bgColor: '#FFEBEA',
            borderColor: '#FFCDD2',
            title: 'Anggaranmu hampir habis',
            text: 'Prioritaskan kebutuhan utama dan hentikan pengeluaran impulsif untuk sementara.',
          };

  // Top 3 expense categories
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Recent 3 transactions
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 3);

  // Profile initials
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const getCategoryIcon = (category: string): keyof typeof Feather.glyphMap => {
    switch (category) {
      case 'Makanan':
        return 'coffee';
      case 'Transportasi':
        return 'navigation';
      case 'Kos':
        return 'home';
      case 'Tagihan':
        return 'zap';
      case 'Belanja':
        return 'shopping-bag';
      case 'Pendidikan':
        return 'book';
      case 'Keluarga':
        return 'users';
      case 'Freelance':
        return 'briefcase';
      default:
        return 'tag';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header: Greeting & Profile Avatar ─────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingTitle}>Hai, {profile.name.split(' ')[0]}!</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarButton}
          activeOpacity={0.8}
          onPress={() => router.push('/budget')}
          accessibilityLabel="Buka profil"
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Budget Card ─────────────────────────────────────────── */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetTop}>
          <View>
            <Text style={styles.budgetSubtitle}>Anggaran bulan ini</Text>
            <Text style={styles.budgetAmount}>{formatRupiah(monthlyBudget)}</Text>
          </View>
          <View style={styles.monthPill}>
            <Text style={styles.monthPillText}>Juni 2025</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[COLORS.peach, COLORS.coral]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressPercent}%` as `${number}%` }]}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.budgetStatsRow}>
          <View>
            <Text style={styles.statLabel}>Terpakai</Text>
            <Text style={styles.statValueSpent}>{formatShortRupiah(spent)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View>
            <Text style={styles.statLabel}>Sisa anggaran</Text>
            <Text style={styles.statValueRemaining}>{formatShortRupiah(remaining)}</Text>
          </View>
        </View>
      </View>

      {/* ─── Insight Card ─────────────────────────────────────────── */}
      <View
        style={[
          styles.insightCard,
          { backgroundColor: insight.bgColor, borderColor: insight.borderColor },
        ]}
      >
        <View style={styles.insightBadge}>
          <View style={[styles.insightDot, { backgroundColor: insight.color }]} />
          <Text style={[styles.insightBadgeText, { color: insight.color }]}>
            {insight.status}
          </Text>
        </View>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDesc}>{insight.text}</Text>
      </View>

      {/* ─── Pengeluaran Terbesar ──────────────────────────────────── */}
      {sortedCategories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengeluaran terbesar</Text>
          <View style={styles.categoryTilesRow}>
            {sortedCategories.map(([catName, catAmount], idx) => {
              const iconName = getCategoryIcon(catName);
              const percent = spent > 0 ? Math.round((catAmount / spent) * 100) : 0;
              const toneBg = idx === 0 ? '#FAF0E6' : idx === 1 ? '#F0F4FA' : '#F5F0FA';
              const iconColor = idx === 0 ? '#E06D53' : idx === 1 ? '#3F51B5' : '#7E57C2';

              return (
                <View key={catName} style={styles.categoryTile}>
                  <View style={[styles.catIconWrap, { backgroundColor: toneBg }]}>
                    <Feather name={iconName} size={20} color={iconColor} />
                  </View>
                  <Text style={styles.catPercentBadge}>{percent}%</Text>
                  <Text style={styles.catName} numberOfLines={1}>{catName}</Text>
                  <Text style={styles.catAmount}>{formatShortRupiah(catAmount)}</Text>
                  <Text style={styles.catNote}>dari pengeluaran</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* ─── Transaksi Terbaru ───────────────────────────────────── */}
      <View style={[styles.section, { marginTop: 24 }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Transaksi terbaru</Text>
          <TouchableOpacity onPress={() => router.push('/expenses')}>
            <Text style={styles.actionText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>Belum ada transaksi bulan ini.</Text>
            </View>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const iconName = isIncome ? 'arrow-down-left' : getCategoryIcon(tx.category);

              return (
                <View key={tx.id} style={styles.txRow}>
                  <View
                    style={[
                      styles.txIconBox,
                      isIncome ? styles.txIconIncome : styles.txIconExpense,
                    ]}
                  >
                    <Feather
                      name={iconName}
                      size={18}
                      color={isIncome ? COLORS.success : COLORS.secondary}
                    />
                  </View>

                  <View style={styles.txMain}>
                    <Text style={styles.txNote} numberOfLines={1}>
                      {tx.note}
                    </Text>
                    <Text style={styles.txSub}>
                      {tx.category} · {formatDate(tx.date)}
                    </Text>
                  </View>

                  <Text style={isIncome ? styles.txAmountIncome : styles.txAmountExpense}>
                    {isIncome ? '+' : '-'}
                    {formatShortRupiah(tx.amount)}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  budgetCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  budgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetSubtitle: {
    fontSize: 13,
    color: '#B9B5C2',
    fontWeight: '500',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  monthPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  monthPillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B9B5C2',
    marginBottom: 3,
  },
  statValueSpent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statValueRemaining: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.peach,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  insightCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  insightDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  insightBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  categoryTilesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    alignItems: 'flex-start',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catPercentBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  catAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  catNote: {
    fontSize: 10,
    color: '#8E8A99',
    marginTop: 2,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    overflow: 'hidden',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F3F0',
  },
  txIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  txIconIncome: {
    backgroundColor: '#EAF4EE',
  },
  txIconExpense: {
    backgroundColor: '#F3F0F7',
  },
  txMain: {
    flex: 1,
    marginRight: 10,
  },
  txNote: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  txSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  txAmountIncome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  txAmountExpense: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E06D53',
  },
  emptyList: {
    padding: 24,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
