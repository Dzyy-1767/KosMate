export type Budget = {
  id: string;
  month: string; 
  amount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBudgetInput = {
  month: string;
  amount: number;
};

export type UpdateBudgetInput = Partial<CreateBudgetInput>;
