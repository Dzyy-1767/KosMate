import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import type { Transaction } from '../types/expense';
import type { ShoppingItem } from '../types/need';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  TRANSACTIONS: '@kosmate:transactions',
  NEEDS: '@kosmate:shopping_items',
  BUDGET: '@kosmate:monthly_budget',
  PROFILE: '@kosmate:user_profile',
  AUTH: '@kosmate:is_logged_in',
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

const SEED_NEEDS: ShoppingItem[] = [
  {
    id: '1',
    name: 'Rak sepatu minimalis',
    category: 'Kamar',
    price: 185000,
    purchased: false,
    priority: 'Tinggi',
    targetDate: '2025-06-16',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Deterjen & pewangi',
    category: 'Kebersihan',
    price: 72000,
    purchased: false,
    priority: 'Sedang',
    targetDate: '2025-06-18',
    createdAt: '2025-06-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Lampu meja belajar',
    category: 'Belajar',
    price: 149000,
    purchased: false,
    priority: 'Rendah',
    targetDate: '2025-06-25',
    createdAt: '2025-06-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Galon air mineral',
    category: 'Dapur',
    price: 23000,
    actualPrice: 22000,
    purchased: true,
    priority: 'Tinggi',
    targetDate: '2025-06-12',
    createdAt: '2025-06-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Gantungan baju',
    category: 'Kamar',
    price: 48000,
    actualPrice: 45000,
    purchased: true,
    priority: 'Sedang',
    targetDate: '2025-06-10',
    createdAt: '2025-06-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Kotak penyimpanan',
    category: 'Kamar',
    price: 89000,
    actualPrice: 92000,
    purchased: true,
    priority: 'Rendah',
    targetDate: '2025-06-08',
    createdAt: '2025-06-06T00:00:00Z',
  },
];

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
  login: () => Promise<void>;
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
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(SEED_NEEDS);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(DEFAULT_BUDGET);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [toast, setToast] = useState<string | null>(null);
  const [quickSheet, setQuickSheet] = useState<'quick' | 'income' | 'expense' | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        // ── Auth state ────────────────────────────────────────────
        const storedAuth = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
        setIsLoggedIn(storedAuth === 'true');

        const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
        }

        const storedNeeds = await AsyncStorage.getItem(STORAGE_KEYS.NEEDS);
        if (storedNeeds) {
          setShoppingItems(JSON.parse(storedNeeds));
        } else {
          await AsyncStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(SEED_NEEDS));
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

  const login = async () => {
    setIsLoggedIn(true);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'false');
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
        login,
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
