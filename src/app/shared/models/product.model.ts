export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
}
