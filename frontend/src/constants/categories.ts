export type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
};

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', label: 'Makan & Minum', icon: '🍽️', color: '#FF6584' },
  { id: 'transport', label: 'Transportasi', icon: '🚌', color: '#6C63FF' },
  { id: 'utilities', label: 'Listrik & Air', icon: '💡', color: '#FFB703' },
  { id: 'health', label: 'Kesehatan', icon: '🏥', color: '#43C6AC' },
  { id: 'entertainment', label: 'Hiburan', icon: '🎮', color: '#FF9800' },
  { id: 'shopping', label: 'Belanja', icon: '🛍️', color: '#E91E63' },
  { id: 'education', label: 'Pendidikan', icon: '📚', color: '#2196F3' },
  { id: 'other', label: 'Lainnya', icon: '📦', color: '#9E9E9E' },
];

export const NEED_CATEGORIES: Category[] = [
  { id: 'grocery', label: 'Kebutuhan Dapur', icon: '🛒', color: '#4CAF50' },
  { id: 'household', label: 'Rumah Tangga', icon: '🏠', color: '#795548' },
  { id: 'personal', label: 'Kebutuhan Pribadi', icon: '👤', color: '#9C27B0' },
  { id: 'other', label: 'Lainnya', icon: '📦', color: '#9E9E9E' },
];
