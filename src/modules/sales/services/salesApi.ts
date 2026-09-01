import { apiClient } from '../../../services/apiClient';
import {
  SalesLead,
  SalesOpportunity,
  ProductCategory,
  ProductCatalogItem,
  SalesAnalytics
} from '../types/sales.types';

export const salesApi = {
  // Leads
  getLeads: async (params?: any): Promise<{ data: SalesLead[]; meta: any }> => {
    const res = await apiClient.get('/sales/leads', { params });
    return res.data as any;
  },

  createLead: async (data: Partial<SalesLead>): Promise<SalesLead> => {
    const res = await apiClient.post('/sales/leads', data);
    return res.data as any;
  },

  updateLead: async (id: string, data: Partial<SalesLead>): Promise<SalesLead> => {
    const res = await apiClient.put(`/sales/leads/${id}`, data);
    return res.data as any;
  },

  qualifyLead: async (id: string): Promise<any> => {
    const res = await apiClient.post(`/sales/leads/${id}/qualify`);
    return res.data as any;
  },

  // Opportunities
  getOpportunities: async (params?: any): Promise<SalesOpportunity[]> => {
    const res = await apiClient.get('/sales/opportunities', { params });
    return res.data as any;
  },

  createOpportunity: async (data: Partial<SalesOpportunity>): Promise<SalesOpportunity> => {
    const res = await apiClient.post('/sales/opportunities', data);
    return res.data as any;
  },

  updateOpportunity: async (id: string, data: Partial<SalesOpportunity>): Promise<SalesOpportunity> => {
    const res = await apiClient.put(`/sales/opportunities/${id}`, data);
    return res.data as any;
  },

  // Products & Inventory Catalog
  getProducts: async (params?: any): Promise<{ data: ProductCatalogItem[]; meta: any }> => {
    const res = await apiClient.get('/ecommerce/products', { params });
    return res.data as any;
  },

  createProduct: async (data: Partial<ProductCatalogItem>): Promise<ProductCatalogItem> => {
    const res = await apiClient.post('/ecommerce/products', data);
    return res.data as any;
  },

  updateProduct: async (id: string, data: Partial<ProductCatalogItem>): Promise<ProductCatalogItem> => {
    const res = await apiClient.put(`/ecommerce/products/${id}`, data);
    return res.data as any;
  },

  getCategories: async (): Promise<ProductCategory[]> => {
    const res = await apiClient.get('/ecommerce/categories');
    return res.data as any;
  },

  createCategory: async (data: Partial<ProductCategory>): Promise<ProductCategory> => {
    const res = await apiClient.post('/ecommerce/categories', data);
    return res.data as any;
  },

  // AI Sales Agent Studio
  getAIProductRecommendations: async (query?: string, category?: string): Promise<any> => {
    const res = await apiClient.post('/ecommerce/recommendations', { query, category });
    return res.data as any;
  },

  getCartAssistance: async (items: any[]): Promise<any> => {
    const res = await apiClient.post('/ecommerce/cart-assistance', { items });
    return res.data as any;
  },

  // Analytics
  getAnalytics: async (): Promise<SalesAnalytics> => {
    const res = await apiClient.get('/sales/analytics');
    return res.data as any;
  },
};
