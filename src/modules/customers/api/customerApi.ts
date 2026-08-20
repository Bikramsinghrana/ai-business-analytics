import { apiClient } from '../../../services/apiClient';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export const customerApi = {
  getCustomers: () => apiClient.get<Customer[]>('/customers'),
  getCustomer: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
};
