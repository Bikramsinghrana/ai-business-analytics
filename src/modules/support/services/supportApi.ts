import { apiClient } from '../../../services/apiClient';
import { SupportTicket, TicketMessage, SupportFaq, SupportAnalytics, Customer360Profile } from '../types/support.types';

export const supportApi = {
  getTickets: async (params?: Record<string, any>): Promise<{ data: SupportTicket[]; meta?: any }> => {
    const res = await apiClient.get<SupportTicket[]>('/support/tickets', { params });
    return { data: res.data || [], meta: res.meta };
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    const res = await apiClient.get<SupportTicket>(`/support/tickets/${id}`);
    return res.data;
  },

  createTicket: async (payload: Partial<SupportTicket>): Promise<SupportTicket> => {
    const res = await apiClient.post<SupportTicket>('/support/tickets', payload);
    return res.data;
  },

  updateTicket: async (id: string, payload: Partial<SupportTicket>): Promise<SupportTicket> => {
    const res = await apiClient.put<SupportTicket>(`/support/tickets/${id}`, payload);
    return res.data;
  },

  addMessage: async (ticketId: string, payload: { message: string; sender_type?: string; sender_name?: string; status?: string }): Promise<TicketMessage> => {
    const res = await apiClient.post<TicketMessage>(`/support/tickets/${ticketId}/messages`, payload);
    return res.data;
  },

  generateAIResponse: async (ticketId: string, query?: string): Promise<{ message: string; confidence_score: number }> => {
    const res = await apiClient.post<{ message: string; confidence_score: number }>(`/support/tickets/${ticketId}/ai-respond`, { query });
    return res.data;
  },

  classifyTicket: async (ticketId: string): Promise<any> => {
    const res = await apiClient.post(`/support/tickets/${ticketId}/analyze`);
    return res.data;
  },

  getSuggestions: async (ticketId: string): Promise<string[]> => {
    const res = await apiClient.get<string[]>(`/support/tickets/${ticketId}/suggest-responses`);
    return res.data || [];
  },

  humanHandoff: async (ticketId: string, note?: string): Promise<SupportTicket> => {
    const res = await apiClient.post<SupportTicket>(`/support/tickets/${ticketId}/human-handoff`, { note });
    return res.data;
  },

  getCustomer360: async (customerId: string): Promise<Customer360Profile> => {
    const res = await apiClient.get<Customer360Profile>(`/support/customers/${customerId}/profile`);
    return res.data;
  },

  lookupOrder: async (query: string): Promise<any[]> => {
    const res = await apiClient.get<any[]>('/support/lookup-order', { params: { query } });
    return res.data || [];
  },

  getFaqs: async (category?: string, search?: string): Promise<SupportFaq[]> => {
    const res = await apiClient.get<SupportFaq[]>('/support/faqs', { params: { category, search } });
    return res.data || [];
  },

  createFaq: async (payload: Partial<SupportFaq>): Promise<SupportFaq> => {
    const res = await apiClient.post<SupportFaq>('/support/faqs', payload);
    return res.data;
  },

  getAnalytics: async (): Promise<SupportAnalytics> => {
    const res = await apiClient.get<SupportAnalytics>('/support/analytics');
    return res.data;
  },
};
