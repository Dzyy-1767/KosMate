import type { Transaction } from '@/types/expense';

export interface MonthlyFinanceSummary {
  income: number;
  budget: number;
  spent: number;
  remaining: number;
  netBalance: number;
}

export function getCurrentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// KONSEP #2: Dashboard, Keuangan, dan Hemat memakai ringkasan transaksi bulan yang sama.
export function getMonthlyFinanceSummary(
  transactions: Transaction[],
  date = new Date()
): MonthlyFinanceSummary {
  const currentMonth = getCurrentMonthKey(date);
  const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(currentMonth));
  const income = monthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
  const spent = monthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  return {
    income,
    budget: income,
    spent,
    // Anggaran bulan ini berasal dari pemasukan tercatat; nilai negatif menunjukkan kelebihan belanja.
    remaining: income - spent,
    netBalance: income - spent,
  };
}
