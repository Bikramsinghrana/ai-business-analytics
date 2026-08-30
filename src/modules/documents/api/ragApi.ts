import { apiClient } from '../../../services/apiClient';
import {
  RAGSearchResult,
  DocumentQAResponse,
  DocumentAnalysis,
} from '../types/document.types';

export const ragApi = {
  search: async (params: {
    query: string;
    top_k?: number;
    min_score?: number;
    folder_id?: string;
    category?: string;
    document_ids?: string[];
    mode?: 'hybrid' | 'semantic' | 'keyword';
  }): Promise<RAGSearchResult> => {
    const res: any = await apiClient.post('/rag/search', params);
    return res.data;
  },

  chat: async (params: {
    question: string;
    document_ids?: string[];
    top_k?: number;
  }): Promise<DocumentQAResponse> => {
    const res: any = await apiClient.post('/rag/chat', params);
    return res.data;
  },

  summarize: async (documentId: string): Promise<DocumentAnalysis> => {
    const res: any = await apiClient.post(`/rag/summarize/${documentId}`);
    return res.data;
  },

  extractSchema: async (documentId: string, schema?: Record<string, any>): Promise<any> => {
    const res: any = await apiClient.post(`/rag/extract-schema/${documentId}`, { schema });
    return res.data;
  },

  classify: async (documentId: string, categories?: string[]): Promise<any> => {
    const res: any = await apiClient.post(`/rag/classify/${documentId}`, { categories });
    return res.data;
  },

  compare: async (documentIdA: string, documentIdB: string): Promise<any> => {
    const res: any = await apiClient.post('/rag/compare', {
      document_id_a: documentIdA,
      document_id_b: documentIdB,
    });
    return res.data;
  },
};
