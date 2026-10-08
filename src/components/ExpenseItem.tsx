import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";
import { SPACING } from "../constants/spacing";
import { Expense } from "../types/expense";
import { formatRupiah } from "../utils/currency";

type ExpenseItemProps = {
  expense: Expense;
};

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.category}>{expense.category}</Text>
      </View>

      <Text style={styles.amount}>{formatRupiah(expense.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: SPACING.md,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  category: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
