import { apiClient } from '../../../services/apiClient';
import { DocumentFolder } from '../types/document.types';

export const folderApi = {
  getTree: async (): Promise<DocumentFolder[]> => {
    const res: any = await apiClient.get('/folders');
    return res.data || [];
  },

  create: async (data: {
    name: string;
    parent_id?: string | null;
    description?: string;
    color?: string;
    icon?: string;
    is_shared?: boolean;
  }): Promise<DocumentFolder> => {
    const res: any = await apiClient.post('/folders', data);
    return res.data;
  },

  moveDocuments: async (folder_id: string, document_ids: string[]) => {
    const res: any = await apiClient.post('/folders/move', { folder_id, document_ids });
    return res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/folders/${id}`);
    return res;
  },
};
