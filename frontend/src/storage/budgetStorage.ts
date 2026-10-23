import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Budget, CreateBudgetInput, UpdateBudgetInput } from '../types/budget';

const STORAGE_KEY = '@kosmate:budget';

function generateId(): string {
  return `budget_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getActiveBudget(): Promise<Budget | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Budget) : null;
  } catch {
    return null;
  }
}

export async function saveBudget(input: CreateBudgetInput): Promise<Budget> {
  const now = new Date().toISOString();
  const existing = await getActiveBudget();

  const budget: Budget = {
    ...input,
    id: existing?.id ?? generateId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  return budget;
}

export async function updateBudget(input: UpdateBudgetInput): Promise<Budget | null> {
  const existing = await getActiveBudget();
  if (!existing) return null;

  const updated: Budget = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearBudget(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
