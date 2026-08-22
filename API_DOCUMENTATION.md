# 📡 AURA AI Frontend — API Client Integration Specification

This document details how the frontend application connects to the backend API services using [`src/services/apiClient.ts`](file:///c:/laragon/www/ai-business-analytics/src/services/apiClient.ts).

---

## 🔑 1. Environment Configuration

- **Environment Variable**: `VITE_API_BASE_URL`
- **Default Base URL**: `http://localhost:8000/api/v1`

---

## 📐 2. TypeScript Interfaces

```typescript
export interface ApiMeta {
  timestamp: string;
  version: string;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
  errors?: Record<string, string[]> | string | null;
}
```

---

## ⚡ 3. Header Interceptor Pipeline

Outbound requests automatically include:
1. `Authorization: Bearer {token}` (Read from `localStorage.getItem('aura_auth_token')`)
2. `X-Tenant-ID: {tenant_id}` (Read from `localStorage.getItem('aura_active_tenant_id')`)

```typescript
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeTenantId = localStorage.getItem('aura_active_tenant_id');
  if (activeTenantId) {
    config.headers['X-Tenant-ID'] = activeTenantId;
  }

  return config;
});
```

---

## 💻 4. Code Consumption Example

```typescript
import { apiClient } from '../services/apiClient';

export const loadTenantProducts = async () => {
  const response = await apiClient.get<ProductItem[]>('/products');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || 'Failed to load products');
};
```