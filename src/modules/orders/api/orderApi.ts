import { apiClient } from '../../../services/apiClient';
import { OrderStatus } from '../../../types/enums';

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: string;
  created_at: string;
}

export const orderApi = {
  getOrders: (params?: { status?: string; page?: number }) => 
    apiClient.get<Order[]>('/orders', { params }),

  getOrder: (id: string) => 
    apiClient.get<Order>(`/orders/${id}`),
};
