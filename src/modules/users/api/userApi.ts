import { apiClient } from '../../../services/apiClient';
import { AuthUser } from '../../auth/api/authApi';

export interface UpdateProfilePayload {
  name?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export const userApi = {
  getProfile: () =>
    apiClient.get<{ user: AuthUser }>('/users/me'),

  updateProfile: (data: UpdateProfilePayload) =>
    apiClient.put<{ user: AuthUser }>('/users/me', data),

  changePassword: (data: ChangePasswordPayload) =>
    apiClient.put<null>('/users/me/password', data),
};
