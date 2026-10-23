export type ShoppingPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export type ShoppingCategory =
  | 'Kamar'
  | 'Dapur'
  | 'Kebersihan'
  | 'Belajar'
  | 'Elektronik'
  | 'Lainnya';

export type ShoppingItem = {
  id: string;
  name: string;
  title?: string; // for compatibility with legacy components
  category: ShoppingCategory;
  price: number; // Estimasi harga
  estimatedPrice?: number; // legacy compatibility
  actualPrice?: number; // Harga aktual saat dibeli
  purchased: boolean;
  isPurchased?: boolean; // legacy compatibility
  priority: ShoppingPriority;
  targetDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt?: string;
};

// Aliases for compatibility with any existing components
export type Need = ShoppingItem;
export type KosNeed = Need;

export type CreateShoppingItemInput = {
  name: string;
  title?: string;
  category?: ShoppingCategory;
  price?: number;
  estimatedPrice?: number;
  priority?: ShoppingPriority;
  targetDate?: string;
  isPurchased?: boolean;
};

export type CreateNeedInput = CreateShoppingItemInput;
export type UpdateNeedInput = Partial<ShoppingItem>;
