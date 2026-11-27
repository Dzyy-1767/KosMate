import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import type { Transaction } from '../types/expense';
import type { ShoppingItem } from '../types/need';
import { supabase } from '../lib/supabase';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  TRANSACTIONS: '@kosmate:transactions',
  NEEDS: '@kosmate:shopping_items',
  BUDGET: '@kosmate:monthly_budget',
  PROFILE: '@kosmate:user_profile',
};

// ─── Initial Seed Data (from Design) ──────────────────────────────────────────
const SEED_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 3500000, date: '2025-06-01', note: 'Uang bulanan', category: 'Keluarga', createdAt: '2025-06-01T08:00:00Z' },
  { id: '2', type: 'income', amount: 1250000, date: '2025-06-05', note: 'Proyek desain', category: 'Freelance', createdAt: '2025-06-05T10:00:00Z' },
  { id: '3', type: 'income', amount: 450000, date: '2025-06-08', note: 'Jual buku bekas', category: 'Lainnya', createdAt: '2025-06-08T11:00:00Z' },
  { id: '4', type: 'expense', amount: 1250000, date: '2025-06-02', note: 'Sewa kos bulan Juni', category: 'Kos', createdAt: '2025-06-02T09:00:00Z' },
  { id: '5', type: 'expense', amount: 185000, date: '2025-06-10', note: 'Belanja mingguan', category: 'Makanan', createdAt: '2025-06-10T12:00:00Z' },
  { id: '6', type: 'expense', amount: 75000, date: '2025-06-11', note: 'Isi ulang kartu transportasi', category: 'Transportasi', createdAt: '2025-06-11T14:00:00Z' },
  { id: '7', type: 'expense', amount: 48000, date: '2025-06-12', note: 'Kopi dan makan siang', category: 'Makanan', createdAt: '2025-06-12T13:00:00Z' },
  { id: '8', type: 'expense', amount: 129000, date: '2025-06-13', note: 'Internet kos', category: 'Tagihan', createdAt: '2025-06-13T16:00:00Z' },
];

// KONSEP #1: ID ini hanya milik data contoh lama, bukan ID dari item buatan pengguna.
const LEGACY_SEED_NEED_IDS = new Set(['1', '2', '3', '4', '5', '6']);

export type UserProfile = {
  name: string;
  email: string;
  notifications: boolean;
  budgetReminder: boolean;
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Naya Ardhani',
  email: 'naya.ardhani@email.com',
  notifications: true,
  budgetReminder: true,
};

const DEFAULT_BUDGET = 4000000;

// ─── Context Type ─────────────────────────────────────────────────────────────
type KosMateContextType = {
  // Auth
  isLoggedIn: boolean | null; // null = still loading from storage
  getAccessToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error: string | null; confirmationRequired: boolean }>;
  logout: () => Promise<void>;

  // Transactions
  transactions: Transaction[];
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Needs / Shopping Items
  shoppingItems: ShoppingItem[];
  addShoppingItem: (data: Omit<ShoppingItem, 'id' | 'purchased' | 'createdAt'>) => Promise<void>;
  toggleShoppingItem: (id: string, actualPrice?: number) => Promise<void>;
  deleteShoppingItem: (id: string) => Promise<void>;

  // Budget
  monthlyBudget: number;
  updateMonthlyBudget: (amount: number) => Promise<void>;

  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Toast
  toast: string | null;
  showToast: (message: string) => void;

  // Quick Action Sheet modal control
  quickSheet: 'quick' | 'income' | 'expense' | null;
  openQuickSheet: (type?: 'quick' | 'income' | 'expense') => void;
  closeQuickSheet: () => void;
};

const KosMateContext = createContext<KosMateContextType | null>(null);

export function KosMateProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(DEFAULT_BUDGET);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [toast, setToast] = useState<string | null>(null);
  const [quickSheet, setQuickSheet] = useState<'quick' | 'income' | 'expense' | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
        }

        const storedNeeds = await AsyncStorage.getItem(STORAGE_KEYS.NEEDS);
        if (storedNeeds) {
          const parsedNeeds = JSON.parse(storedNeeds) as ShoppingItem[];
          const userNeeds = parsedNeeds.filter((item) => !LEGACY_SEED_NEED_IDS.has(item.id));
          setShoppingItems(userNeeds);
          if (userNeeds.length !== parsedNeeds.length) {
            // KONSEP #2: Bersihkan item contoh lama sekali saja dan pertahankan item buatan pengguna.
            await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(userNeeds));
          }
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify([]));
        }

        const storedBudget = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET);
        if (storedBudget) {
          setMonthlyBudget(Number(storedBudget));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, String(DEFAULT_BUDGET));
        }

        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        }
      } catch (err) {
        console.error('Failed to load data from storage', err);
        setIsLoggedIn(false); // fallback: not logged in
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setIsLoggedIn(Boolean(data.session));
      }
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        setIsLoggedIn(Boolean(session));

        if (session?.user) {
          const metadata = session.user.user_metadata;
          setProfile((current) => ({
            ...current,
            name: typeof metadata?.name === 'string' ? metadata.name : current.name,
            email: session.user.email || current.email,
          }));
        }
      },
    );

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2400);
  };

  const addTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    showToast(data.type === 'income' ? 'Pemasukan berhasil ditambahkan' : 'Pengeluaran berhasil ditambahkan');
  };

  const deleteTransaction = async (id: string) => {
    // Compute filtered list from current state BEFORE calling setTransactions
    const nextTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(nextTransactions);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(nextTransactions));
    } catch (err) {
      console.error('Failed to save transactions after deletion', err);
    }
    showToast('Transaksi berhasil dihapus');
  };

  const addShoppingItem = async (data: Omit<ShoppingItem, 'id' | 'purchased' | 'createdAt'>) => {
    const newItem: ShoppingItem = {
      ...data,
      id: `need_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      purchased: false,
      createdAt: new Date().toISOString(),
    };
    let nextItems: ShoppingItem[] = [];
    setShoppingItems((prev) => {
      nextItems = [newItem, ...prev];
      return nextItems;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(nextItems));
    } catch (err) {
      console.error('Failed to save needs after adding', err);
    }
    showToast('Kebutuhan baru berhasil ditambahkan');
  };

  const deleteShoppingItem = async (id: string) => {
    let nextItems: ShoppingItem[] = [];
    setShoppingItems((prev) => {
      nextItems = prev.filter((item) => item.id !== id);
      return nextItems;
    });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(nextItems));
    } catch (err) {
      console.error('Failed to save needs after deletion', err);
    }
    showToast('Kebutuhan berhasil dihapus');
  };

  const toggleShoppingItem = async (id: string, actualPrice?: number) => {
    const updated = shoppingItems.map((item) => {
      if (item.id === id) {
        if (item.purchased) {
          return { ...item, purchased: false, actualPrice: undefined };
        } else {
          return { ...item, purchased: true, actualPrice: actualPrice ?? item.price };
        }
      }
      return item;
    });
    setShoppingItems(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(updated));

    const item = shoppingItems.find((i) => i.id === id);
    if (item?.purchased) {
      showToast('Item dikembalikan ke daftar belum dibeli');
    } else {
      showToast('Harga aktual disimpan dan item ditandai dibeli');
    }
  };

  const updateMonthlyBudget = async (amount: number) => {
    setMonthlyBudget(amount);
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, String(amount));
    showToast('Anggaran bulanan diperbarui');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    showToast('Profil berhasil disimpan');
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (!error && data.user) {
      await updateProfile({ name, email });
    }

    return {
      error: error?.message || null,
      confirmationRequired: !error && !data.session,
    };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  const openQuickSheet = (type: 'quick' | 'income' | 'expense' = 'quick') => {
    setQuickSheet(type);
  };

  const closeQuickSheet = () => {
    setQuickSheet(null);
  };

  return (
    <KosMateContext.Provider
      value={{
        isLoggedIn,
        getAccessToken,
        login,
        register,
        logout,
        transactions,
        addTransaction,
        deleteTransaction,
        shoppingItems,
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        monthlyBudget,
        updateMonthlyBudget,
        profile,
        updateProfile,
        toast,
        showToast,
        quickSheet,
        openQuickSheet,
        closeQuickSheet,
      }}
    >
      {children}
    </KosMateContext.Provider>
  );
}

export function useKosMate() {
  const context = useContext(KosMateContext);
  if (!context) {
    throw new Error('useKosMate must be used within a KosMateProvider');
  }
  return context;
}
