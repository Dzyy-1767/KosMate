export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // Format: YYYY-MM-DD
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}

export interface UpdateTransactionDTO {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  note?: string;
}
