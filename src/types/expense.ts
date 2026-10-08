export type ExpenseCategory =
  | "Makan"
  | "Transportasi"
  | "Laundry"
  | "Kebutuhan Kos"
  | "Hiburan";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
  createdAt: string;
};
