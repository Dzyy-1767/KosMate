import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Need, CreateNeedInput, UpdateNeedInput } from '../types/need';

const STORAGE_KEY = '@kosmate:needs';

function generateId(): string {
  return `need_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getAllNeeds(): Promise<Need[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Need[]) : [];
  } catch {
    return [];
  }
}

export async function getNeedById(id: string): Promise<Need | null> {
  const needs = await getAllNeeds();
  return needs.find((n) => n.id === id) ?? null;
}

export async function createNeed(input: CreateNeedInput): Promise<Need> {
  const needs = await getAllNeeds();
  const now = new Date().toISOString();
  const newNeed: Need = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...needs, newNeed]));
  return newNeed;
}

export async function updateNeed(
  id: string,
  input: UpdateNeedInput
): Promise<Need | null> {
  const needs = await getAllNeeds();
  const index = needs.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const updated: Need = {
    ...needs[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  needs[index] = updated;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  return updated;
}

export async function deleteNeed(id: string): Promise<boolean> {
  const needs = await getAllNeeds();
  const filtered = needs.filter((n) => n.id !== id);
  if (filtered.length === needs.length) return false;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export async function clearAllNeeds(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
