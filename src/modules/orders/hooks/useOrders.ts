import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';

export const useOrders = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
  });
};
