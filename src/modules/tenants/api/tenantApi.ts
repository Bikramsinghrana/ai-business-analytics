import { apiClient } from '../../../services/apiClient';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  settings?: Record<string, any>;
  created_at?: string;
}

export interface CreateTenantPayload {
  name: string;
  plan?: string;
  settings?: Record<string, any>;
}

export const tenantApi = {
  getTenants: () =>
    apiClient.get<{ tenants: Tenant[] }>('/tenants'),

  getTenant: (id: string) =>
    apiClient.get<{ tenant: Tenant }>(`/tenants/${id}`),

  createTenant: (data: CreateTenantPayload) =>
    apiClient.post<{ tenant: Tenant }>('/tenants', data),

  getCurrentTenant: () =>
    apiClient.get<{ tenant: Tenant }>('/tenant/current'),

  switchTenant: (tenantId: string) =>
    apiClient.post<{ tenant: Tenant }>('/tenant/switch', { tenant_id: tenantId }),
};
