import { Expense } from "../types/expense";

/**
 * Hitung total seluruh pengeluaran.
 *
 * Kompetensi: Custom Function + Loop (for...of)
 */
export function calculateTotalExpenses(expenses: Expense[]): number {
  let total = 0;

  for (const expense of expenses) {
    total += expense.amount;
  }

  return total;
}

/**
 * Hitung total pengeluaran berdasarkan kategori tertentu.
 *
 * Kompetensi: Custom Function + Parameter + Loop + Condition
 */
export function calculateCategoryTotal(
  expenses: Expense[],
  category: Expense["category"]
): number {
  let total = 0;

  for (const expense of expenses) {
    if (expense.category === category) {
      total += expense.amount;
    }
  }

  return total;
}

/**
 * Berikan status kondisi budget berdasarkan persentase pemakaian.
 *
 * Kompetensi: Custom Function + Condition + Return value
 */
export function getBudgetStatus(budget: number, expenses: number): string {
  const percentage = (expenses / budget) * 100;

  if (percentage >= 100) {
    return "Budget kamu sudah habis.";
  }

  if (percentage >= 80) {
    return "Hati-hati, pengeluaranmu sudah mendekati budget.";
  }

  return "Pengeluaranmu masih cukup aman.";
}
