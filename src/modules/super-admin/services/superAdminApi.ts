import { apiClient } from '../../../services/apiClient';
import {
  DashboardMetrics,
  SystemInfo,
  CacheStats,
  QueueStats,
  DatabaseStats,
  LogsResponse,
  AiProvider,
  FeatureFlag,
  SystemPromptTemplate,
  PlatformSetting,
} from '../types/superAdmin.types';

export const superAdminApi = {
  // ── Dashboard Metrics ──
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get<any>('/admin/dashboard');
    const d = res.data;
    return d?.data || d;
  },

  // ── Infrastructure Telemetry & Controls ──
  getSystemInfo: async (): Promise<SystemInfo> => {
    const res = await apiClient.get<any>('/admin/infrastructure/system-info');
    const d = res.data;
    return d?.data || d;
  },

  getCacheStats: async (): Promise<CacheStats> => {
    const res = await apiClient.get<any>('/admin/infrastructure/cache');
    const d = res.data;
    return d?.data || d;
  },

  flushCache: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>('/admin/infrastructure/cache/flush');
    const d = res.data;
    return d?.data || d;
  },

  getQueueStats: async (): Promise<QueueStats> => {
    const res = await apiClient.get<any>('/admin/infrastructure/queues');
    const d = res.data;
    return d?.data || d;
  },

  retryQueueJob: async (id: string | number): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>(`/admin/infrastructure/queues/retry/${id}`);
    const d = res.data;
    return d?.data || d;
  },

  purgeQueueJobs: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>('/admin/infrastructure/queues/purge');
    const d = res.data;
    return d?.data || d;
  },

  getDatabaseStats: async (): Promise<DatabaseStats> => {
    const res = await apiClient.get<any>('/admin/infrastructure/database');
    const d = res.data;
    return d?.data || d;
  },

  optimizeDatabase: async (): Promise<{ success: boolean; message: string; optimized_tables_count: number }> => {
    const res = await apiClient.post<any>('/admin/infrastructure/database/optimize');
    const d = res.data;
    return d?.data || d;
  },

  triggerBackup: async (): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await apiClient.post<any>('/admin/infrastructure/database/backup');
    const d = res.data;
    return d?.data || d;
  },

  getLogs: async (limit = 100, level?: string): Promise<LogsResponse> => {
    const res = await apiClient.get<any>('/admin/infrastructure/logs', {
      params: { limit, level },
    });
    const d = res.data;
    return d?.data || d;
  },

  clearLogs: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post<any>('/admin/infrastructure/logs/clear');
    const d = res.data;
    return d?.data || d;
  },

  // ── AI Providers & Models ──
  getAiProviders: async (): Promise<AiProvider[]> => {
    const res = await apiClient.get<any>('/admin/ai-providers');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  updateAiProvider: async (id: number, payload: Partial<AiProvider>): Promise<AiProvider> => {
    const res = await apiClient.put<any>(`/admin/ai-providers/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  testAiProviderConnection: async (id: number): Promise<{ success: boolean; message: string; latency_ms: number }> => {
    const res = await apiClient.post<any>(`/admin/ai-providers/${id}/test`);
    const d = res.data;
    return d?.data || d;
  },

  // ── Feature Flags ──
  getFeatureFlags: async (tenantId?: string): Promise<FeatureFlag[]> => {
    const res = await apiClient.get<any>('/admin/feature-flags', {
      params: { tenant_id: tenantId },
    });
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createFeatureFlag: async (payload: Partial<FeatureFlag>): Promise<FeatureFlag> => {
    const res = await apiClient.post<any>('/admin/feature-flags', payload);
    const d = res.data;
    return d?.data || d;
  },

  toggleFeatureFlag: async (id: number, isEnabled?: boolean): Promise<FeatureFlag> => {
    const res = await apiClient.post<any>(`/admin/feature-flags/${id}/toggle`, {
      is_enabled: isEnabled,
    });
    const d = res.data;
    return d?.data || d;
  },

  deleteFeatureFlag: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/feature-flags/${id}`);
  },

  // ── System Prompts ──
  getPrompts: async (module?: string): Promise<SystemPromptTemplate[]> => {
    const res = await apiClient.get<any>('/admin/prompts', {
      params: { module },
    });
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createPrompt: async (payload: Partial<SystemPromptTemplate>): Promise<SystemPromptTemplate> => {
    const res = await apiClient.post<any>('/admin/prompts', payload);
    const d = res.data;
    return d?.data || d;
  },

  updatePrompt: async (id: number, payload: Partial<SystemPromptTemplate>): Promise<SystemPromptTemplate> => {
    const res = await apiClient.put<any>(`/admin/prompts/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deletePrompt: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/prompts/${id}`);
  },

  // ── Platform Settings ──
  getSettings: async (group?: string): Promise<PlatformSetting[]> => {
    const res = await apiClient.get<any>('/admin/settings', { params: { group } });
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  updateSettings: async (settings: Record<string, any>): Promise<void> => {
    await apiClient.post('/admin/settings', { settings });
  },
};
