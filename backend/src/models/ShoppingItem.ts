export type NeedPriority = 'Tinggi' | 'Sedang' | 'Rendah';

export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  priority: NeedPriority;
  price?: number;
  purchased: boolean;
  purchasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShoppingItemDTO {
  name: string;
  category: string;
  priority?: NeedPriority;
  price?: number;
}

export interface UpdateShoppingItemDTO {
  name?: string;
  category?: string;
  priority?: NeedPriority;
  price?: number;
  purchased?: boolean;
}
