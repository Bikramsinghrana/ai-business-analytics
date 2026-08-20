import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

export const useProducts = (params?: { search?: string; page?: number }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
  });
};
