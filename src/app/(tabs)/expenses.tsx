import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { useKosMate } from '@/context/KosMateContext';
import type { Transaction } from '@/types/expense';

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

export default function FinanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { transactions } = useKosMate();

  const [expandedSection, setExpandedSection] = useState<'income' | 'expense' | null>(null);

  const incomeList = transactions
    .filter((t) => t.type === 'income')
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const expenseList = transactions
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);
  const actualBalance = totalIncome - totalExpense;

  const displayedIncome =
    expandedSection === 'income' ? incomeList : incomeList.slice(0, 3);
  const displayedExpense =
    expandedSection === 'expense' ? expenseList : expenseList.slice(0, 3);

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

  const renderTransactionRow = (tx: Transaction) => {
    const isIncome = tx.type === 'income';
    const iconName = isIncome ? 'arrow-down-left' : getCategoryIcon(tx.category);

    return (
      <TouchableOpacity
        key={tx.id}
        style={styles.txRow}
        activeOpacity={0.7}
        onPress={() => router.push(`/expenses/${tx.id}`)}
      >
        <View style={[styles.txIconBox, isIncome ? styles.txIconIncome : styles.txIconExpense]}>
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

        <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 6 }}>
          <Text style={isIncome ? styles.txAmountIncome : styles.txAmountExpense}>
            {isIncome ? '+' : '-'}
            {formatShortRupiah(tx.amount)}
          </Text>
          <Feather name="chevron-right" size={16} color="#AAA5B0" style={{ alignSelf: 'center' }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keuangan</Text>
        <View style={styles.monthPill}>
          <Text style={styles.monthPillText}>Juni 2025</Text>
        </View>
      </View>

      {/* ─── Summary Grid (Income vs Expense) ────────────────────── */}
      <View style={styles.summaryGrid}>
        {/* Income Card */}
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#EAF4EE' }]}>
            <Feather name="arrow-down-left" size={18} color={COLORS.success} />
          </View>
          <Text style={styles.summaryLabel}>Total pemasukan</Text>
          <Text style={styles.incomeAmountText}>{formatShortRupiah(totalIncome)}</Text>
        </View>

        {/* Expense Card */}
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconBox, { backgroundColor: '#FFF0ED' }]}>
            <Feather name="arrow-up-right" size={18} color="#E06D53" />
          </View>
          <Text style={styles.summaryLabel}>Total pengeluaran</Text>
          <Text style={styles.expenseAmountText}>{formatShortRupiah(totalExpense)}</Text>
        </View>
      </View>

      {/* ─── Balance Card ────────────────────────────────────────── */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View>
          <Text style={styles.balanceLabel}>Uang aktual tersisa</Text>
          <Text style={styles.balanceAmount}>{formatRupiah(actualBalance)}</Text>
        </View>
        <View style={styles.balanceIconCircle}>
          <Feather name="credit-card" size={24} color={COLORS.peach} />
        </View>
      </LinearGradient>

      {/* ─── Section: Pemasukan Terbaru ──────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pemasukan terbaru</Text>
        {incomeList.length > 3 && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSection((prev) => (prev === 'income' ? null : 'income'))
            }
          >
            <Text style={styles.actionText}>
              {expandedSection === 'income' ? 'Tutup' : 'Lihat Semua'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        {incomeList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada pemasukan tercatat.</Text>
          </View>
        ) : (
          displayedIncome.map(renderTransactionRow)
        )}
      </View>

      {/* ─── Section: Pengeluaran Terbaru ────────────────────────── */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Pengeluaran terbaru</Text>
        {expenseList.length > 3 && (
          <TouchableOpacity
            onPress={() =>
              setExpandedSection((prev) => (prev === 'expense' ? null : 'expense'))
            }
          >
            <Text style={styles.actionText}>
              {expandedSection === 'expense' ? 'Tutup' : 'Lihat Semua'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        {expenseList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada pengeluaran tercatat.</Text>
          </View>
        ) : (
          displayedExpense.map(renderTransactionRow)
        )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  monthPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECE8E3',
  },
  monthPillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE8E3',
    shadowColor: '#312C51',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  incomeAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.success,
  },
  expenseAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E06D53',
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#D1CCE0',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  balanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  cardContainer: {
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
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
