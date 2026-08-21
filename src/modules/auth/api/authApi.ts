import { apiClient, ApiResponse } from '../../../services/apiClient';

export interface AuthUser {
  id: string;
  tenant_id: string | null;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponseData {
  user: AuthUser;
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  tenant_id?: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponseData>('/auth/register', data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponseData>('/auth/login', data),

  logout: () =>
    apiClient.post<null>('/auth/logout'),

  getCurrentUser: () =>
    apiClient.get<{ user: AuthUser }>('/auth/me'),

  getPermissions: () =>
    apiClient.get<{ permissions: string[]; role: string }>('/auth/permissions'),
};
