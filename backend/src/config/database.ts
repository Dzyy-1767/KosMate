import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { ShoppingItem } from '../models/ShoppingItem.js';

/**
 * In-Memory Database Store for Development & Testing
 * (Dapat diganti dengan koneksi MySQL / PostgreSQL / Prisma / TypeORM)
 */
class DatabaseStore {
  public users: Map<string, User> = new Map();
  public transactions: Map<string, Transaction> = new Map();
  public shoppingItems: Map<string, ShoppingItem> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Demo User
    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'Rian Kos',
      email: 'rian@kosmate.id',
      passwordHash: 'hashed_pass_123',
      phone: '081234567890',
      kosName: 'Kos Berkah Jaya',
      roomNumber: 'Kamar 12',
      monthlyBudget: 1500000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Demo Transactions
    const initialTxs: Transaction[] = [
      {
        id: 'tx_1',
        userId: demoUser.id,
        title: 'Kiriman Bulanan Ortu',
        amount: 1500000,
        type: 'income',
        category: 'Kiriman Ortu',
        date: '2026-10-01',
        note: 'Uang bulanan awal bulan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tx_2',
        userId: demoUser.id,
        title: 'Makan Siang Nasi Padang',
        amount: 18000,
        type: 'expense',
        category: 'Makan & Minum',
        date: '2026-10-20',
        note: 'Nasi padang lauk ayam rendang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tx_3',
        userId: demoUser.id,
        title: 'Beli Galon Air Mineral',
        amount: 7000,
        type: 'expense',
        category: 'Kebutuhan Kos',
        date: '2026-10-21',
        note: 'Refill galon isi ulang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'tx_4',
        userId: demoUser.id,
        title: 'Bensin Motor',
        amount: 25000,
        type: 'expense',
        category: 'Transportasi',
        date: '2026-10-22',
        note: 'Pertalite full tank',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    initialTxs.forEach((tx) => this.transactions.set(tx.id, tx));

    // Demo Shopping Items
    const initialItems: ShoppingItem[] = [
      {
        id: 'need_1',
        userId: demoUser.id,
        name: 'Deterjen Bubuk 1kg',
        category: 'Kebutuhan Kos',
        priority: 'Tinggi',
        price: 22000,
        purchased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'need_2',
        userId: demoUser.id,
        name: 'Shampoo & Sabun Mandi',
        category: 'Kebutuhan Kos',
        priority: 'Tinggi',
        price: 35000,
        purchased: true,
        purchasedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'need_3',
        userId: demoUser.id,
        name: 'Kopi Sachet 1 Renceng',
        category: 'Makan & Minum',
        priority: 'Sedang',
        price: 15000,
        purchased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'need_4',
        userId: demoUser.id,
        name: 'Token Listrik Kamar',
        category: 'Tagihan & Pulsa',
        priority: 'Tinggi',
        price: 50000,
        purchased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    initialItems.forEach((item) => this.shoppingItems.set(item.id, item));
  }
}

export const db = new DatabaseStore();
