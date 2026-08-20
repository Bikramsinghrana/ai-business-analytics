import { apiClient } from '../../../services/apiClient';
import { LeadStatus } from '../../../types/enums';

export interface SalesLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  score: number;
  status: LeadStatus;
}

export const salesApi = {
  getLeads: (params?: { status?: string }) => 
    apiClient.get<SalesLead[]>('/sales/leads', { params }),
};
