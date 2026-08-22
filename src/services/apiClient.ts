import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request Interceptor: Inject Auth & Tenant Headers
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

    // Response Interceptor: Standardize API responses & handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('aura_auth_token');
        }

        const formattedError: ApiResponse<null> = {
          success: false,
          message: error.response?.data?.message || error.message || 'Network request failed',
          data: null,
          errors: error.response?.data?.errors || null,
        };

        return Promise.reject(formattedError);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
