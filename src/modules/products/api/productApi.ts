import { apiClient } from '../../../services/apiClient';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
}

export const productApi = {
  getProducts: (params?: { search?: string; page?: number }) => 
    apiClient.get<Product[]>('/products', { params }),

  getProduct: (id: string) => 
    apiClient.get<Product>(`/products/${id}`),

  createProduct: (data: Partial<Product>) => 
    apiClient.post<Product>('/products', data),
};
