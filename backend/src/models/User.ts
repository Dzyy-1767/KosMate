export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  kosName?: string;
  roomNumber?: string;
  monthlyBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  kosName?: string;
  roomNumber?: string;
  monthlyBudget?: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  kosName?: string;
  roomNumber?: string;
  monthlyBudget?: number;
}
