export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Makanan'
  | 'Transportasi'
  | 'Kos'
  | 'Tagihan'
  | 'Belanja'
  | 'Pendidikan'
  | 'Lainnya'
  // Income categories
  | 'Keluarga'
  | 'Freelance'
  | 'Gaji';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  note: string;
  title?: string; // backwards compatibility with legacy components
  category: string;
  createdAt: string;
  updatedAt?: string;
};

// Alias for compatibility
export type Expense = Transaction;

export type CreateTransactionInput = {
  type: TransactionType;
  amount: number;
  date: string;
  note: string;
  title?: string;
  category: string;
};

export type CreateExpenseInput = CreateTransactionInput;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;
export type UpdateExpenseInput = UpdateTransactionInput;
