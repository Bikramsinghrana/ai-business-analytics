import { apiClient } from '../../../services/apiClient';
import { KnowledgeDocument, DocumentAnalyticsStats, DocumentAuditLogItem } from '../types/document.types';

export const documentApi = {
  list: async (params: {
    folder_id?: string;
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  } = {}) => {
    const res: any = await apiClient.get('/documents', { params });
    return res.data;
  },

  get: async (id: string) => {
    const res: any = await apiClient.get(`/documents/${id}`);
    return res.data;
  },

  preview: async (id: string) => {
    const res: any = await apiClient.get(`/documents/${id}/preview`);
    return res.data;
  },

  upload: async (formData: FormData) => {
    const res: any = await apiClient.post('/documents/upload', formData);
    return res;
  },

  update: async (id: string, data: Partial<KnowledgeDocument>) => {
    const res: any = await apiClient.put(`/documents/${id}`, data);
    return res.data;
  },

  reindex: async (id: string, options?: { chunk_size?: number; overlap?: number }) => {
    const res: any = await apiClient.post(`/documents/${id}/reindex`, options);
    return res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/documents/${id}`);
    return res;
  },

  getStats: async (): Promise<DocumentAnalyticsStats> => {
    const res: any = await apiClient.get('/rag/stats');
    return res.data;
  },

  getAuditLogs: async (params: { event_type?: string; page?: number; per_page?: number } = {}) => {
    const res: any = await apiClient.get('/rag/audit-logs', { params });
    return res.data;
  },
};
