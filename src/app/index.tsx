import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";
import { SPACING } from "../constants/spacing";
import { TYPOGRAPHY } from "../constants/typography";
import { Expense } from "../types/expense";
import { formatRupiah } from "../utils/currency";
import {
  calculateTotalExpenses,
  calculateCategoryTotal,
  getBudgetStatus,
} from "../utils/calculation";

// ─── Data Dummy ─────────────────────────────────────────────────────────────
// Array of Objects — Expense[]
const expenses: Expense[] = [
  {
    id: "1",
    title: "Nasi Ayam",
    amount: 18000,
    category: "Makan",
    date: "2026-10-08",
    createdAt: "2026-10-08T07:00:00Z",
  },
  {
    id: "2",
    title: "Laundry",
    amount: 25000,
    category: "Laundry",
    date: "2026-10-08",
    createdAt: "2026-10-08T09:00:00Z",
  },
  {
    id: "3",
    title: "Ojek Online",
    amount: 15000,
    category: "Transportasi",
    date: "2026-10-08",
    createdAt: "2026-10-08T10:00:00Z",
  },
];

// Kategori yang digunakan di ringkasan (sesuai PRD FR-HOME-04)
const CATEGORIES: Expense["category"][] = [
  "Makan",
  "Transportasi",
  "Laundry",
  "Kebutuhan Kos",
  "Hiburan",
];

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const budget = 2000000;

  // Loop 1 — for...of di dalam calculateTotalExpenses
  const totalExpenses = calculateTotalExpenses(expenses);
  const remainingBudget = budget - totalExpenses;
  const status = getBudgetStatus(budget, totalExpenses);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hai, Sinta 👋</Text>
      <Text style={styles.subtitle}>
        Yuk cek kondisi keuanganmu hari ini.
      </Text>

      {/* Budget Card — Hero Component */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Budget bulan ini</Text>

        <Text style={styles.budgetAmount}>{formatRupiah(budget)}</Text>

        <Text style={styles.expenseLabel}>
          Terpakai {formatRupiah(totalExpenses)}
        </Text>

        {/* Inline Style — conditional color berdasarkan sisa budget */}
        <Text
          style={{
            ...TYPOGRAPHY.heading3,
            color: remainingBudget < 0 ? COLORS.coral : "#FFFFFF",
            marginTop: SPACING.xs,
          }}
        >
          Sisa {formatRupiah(remainingBudget)}
        </Text>
      </View>

      {/* Budget Status Insight (FR-HOME-03 + getBudgetStatus) */}
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>💡 KosMate Insight</Text>
        <Text style={styles.insightText}>{status}</Text>
      </View>

      {/* Ringkasan per Kategori (FR-HOME-04) */}
      <Text style={styles.sectionTitle}>Ringkasan Kategori</Text>

      {/* Loop 2 — .map() untuk menampilkan kategori */}
      {CATEGORIES.map((category) => {
        const categoryTotal = calculateCategoryTotal(expenses, category);
        if (categoryTotal === 0) return null;

        return (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryAmount}>
              {formatRupiah(categoryTotal)}
            </Text>
          </View>
        );
      })}

      {/* Pengeluaran Terbaru */}
      <Text style={styles.sectionTitle}>Pengeluaran Terbaru</Text>

      {/* Loop 3 — .map() untuk daftar transaksi */}
      {expenses.map((expense) => (
        <View key={expense.id} style={styles.expenseItem}>
          <View>
            <Text style={styles.expenseTitle}>{expense.title}</Text>
            <Text style={styles.expenseCategory}>{expense.category}</Text>
          </View>

          <Text style={styles.expenseAmount}>
            {formatRupiah(expense.amount)}
          </Text>
        </View>
      ))}

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
}

// ─── External Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },

  greeting: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.primary,
    marginTop: SPACING.xl,
  },

  subtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Budget Card — Hero Component (Design Brief section 12)
  budgetCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.xxl,
    marginTop: SPACING.xxl,
  },

  budgetLabel: {
    ...TYPOGRAPHY.small,
    color: "#FFFFFF",
    opacity: 0.8,
  },

  budgetAmount: {
    ...TYPOGRAPHY.display,
    color: "#FFFFFF",
    marginTop: SPACING.sm,
  },

  expenseLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.peach,
    marginTop: SPACING.md,
  },

  // Insight Card
  insightCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  insightTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  insightText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },

  sectionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text,
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.md,
  },

  // Kategori Row
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  categoryName: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },

  categoryAmount: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.secondary,
  },

  // Expense Item (inline version di Home, pakai komponen di expenses screen)
  expenseItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  expenseTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.text,
  },

  expenseCategory: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  expenseAmount: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.primary,
  },
});
