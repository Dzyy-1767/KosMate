import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types/expense';

const STORAGE_KEY = '@kosmate:expenses';

function generateId(): string {
  return `expense_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const expenses = await getAllExpenses();
  return expenses.find((e) => e.id === id) ?? null;
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const expenses = await getAllExpenses();
  const now = new Date().toISOString();
  const newExpense: Expense = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...expenses, newExpense]));
  return newExpense;
}

export async function updateExpense(
  id: string,
  input: UpdateExpenseInput
): Promise<Expense | null> {
  const expenses = await getAllExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const updated: Expense = {
    ...expenses[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  expenses[index] = updated;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  return updated;
}

export async function deleteExpense(id: string): Promise<boolean> {
  const expenses = await getAllExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  if (filtered.length === expenses.length) return false;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export async function clearAllExpenses(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
