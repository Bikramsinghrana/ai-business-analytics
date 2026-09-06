import { apiClient } from '../../../services/apiClient';
import {
  AutomationWorkflow,
  WorkflowExecutionLog,
  NotificationTemplate,
  NotificationLog,
  CmsPage,
  CmsMenu,
  CmsContentBlock,
  MediaFile,
  MediaStats,
  SubscriptionPlan,
  TenantSubscription,
  BillingInvoice,
  QuotaOverview,
} from '../types/automationSaas.types';

export const automationSaasApi = {
  // ── Workflows ──
  getWorkflows: async (): Promise<AutomationWorkflow[]> => {
    const res = await apiClient.get<any>('/automation/workflows');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  getWorkflowById: async (id: number): Promise<AutomationWorkflow> => {
    const res = await apiClient.get<any>(`/automation/workflows/${id}`);
    const d = res.data;
    return d?.data || d;
  },

  createWorkflow: async (payload: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> => {
    const res = await apiClient.post<any>('/automation/workflows', payload);
    const d = res.data;
    return d?.data || d;
  },

  updateWorkflow: async (id: number, payload: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> => {
    const res = await apiClient.put<any>(`/automation/workflows/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteWorkflow: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/workflows/${id}`);
  },

  executeWorkflow: async (id: number, payload: Record<string, any> = {}): Promise<{ execution: WorkflowExecutionLog; workflow: AutomationWorkflow }> => {
    const res = await apiClient.post<any>(`/automation/workflows/${id}/execute`, { payload });
    const d = res.data;
    return d?.data || d;
  },

  getWorkflowExecutionLogs: async (workflowId?: number): Promise<WorkflowExecutionLog[]> => {
    const url = workflowId ? `/automation/workflows/${workflowId}/logs` : '/automation/execution-logs';
    const res = await apiClient.get<any>(url);
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  // ── Notifications ──
  getNotificationTemplates: async (): Promise<NotificationTemplate[]> => {
    const res = await apiClient.get<any>('/automation/templates');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createNotificationTemplate: async (payload: Partial<NotificationTemplate>): Promise<NotificationTemplate> => {
    const res = await apiClient.post<any>('/automation/templates', payload);
    const d = res.data;
    return d?.data || d;
  },

  updateNotificationTemplate: async (id: number, payload: Partial<NotificationTemplate>): Promise<NotificationTemplate> => {
    const res = await apiClient.put<any>(`/automation/templates/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteNotificationTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/templates/${id}`);
  },

  sendTestNotification: async (payload: {
    template_code?: string;
    recipient: string;
    subject?: string;
    body?: string;
    variables?: Record<string, any>;
    channel?: string;
  }): Promise<NotificationLog> => {
    const res = await apiClient.post<any>('/automation/notifications/send-test', payload);
    const d = res.data;
    return d?.data || d;
  },

  getNotificationLogs: async (): Promise<NotificationLog[]> => {
    const res = await apiClient.get<any>('/automation/notifications/logs');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  // ── CMS Pages & Blocks ──
  getCmsPages: async (): Promise<CmsPage[]> => {
    const res = await apiClient.get<any>('/cms/pages');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createCmsPage: async (payload: Partial<CmsPage>): Promise<CmsPage> => {
    const res = await apiClient.post<any>('/cms/pages', payload);
    const d = res.data;
    return d?.data || d;
  },

  updateCmsPage: async (id: number, payload: Partial<CmsPage>): Promise<CmsPage> => {
    const res = await apiClient.put<any>(`/cms/pages/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteCmsPage: async (id: number): Promise<void> => {
    await apiClient.delete(`/cms/pages/${id}`);
  },

  getCmsMenus: async (): Promise<CmsMenu[]> => {
    const res = await apiClient.get<any>('/cms/menus');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createCmsMenu: async (payload: Partial<CmsMenu>): Promise<CmsMenu> => {
    const res = await apiClient.post<any>('/cms/menus', payload);
    const d = res.data;
    return d?.data || d;
  },

  updateCmsMenu: async (id: number, payload: Partial<CmsMenu>): Promise<CmsMenu> => {
    const res = await apiClient.put<any>(`/cms/menus/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteCmsMenu: async (id: number): Promise<void> => {
    await apiClient.delete(`/cms/menus/${id}`);
  },

  getContentBlocks: async (): Promise<CmsContentBlock[]> => {
    const res = await apiClient.get<any>('/cms/blocks');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  createContentBlock: async (payload: Partial<CmsContentBlock>): Promise<CmsContentBlock> => {
    const res = await apiClient.post<any>('/cms/blocks', payload);
    const d = res.data;
    return d?.data || d;
  },

  updateContentBlock: async (id: number, payload: Partial<CmsContentBlock>): Promise<CmsContentBlock> => {
    const res = await apiClient.put<any>(`/cms/blocks/${id}`, payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteContentBlock: async (id: number): Promise<void> => {
    await apiClient.delete(`/cms/blocks/${id}`);
  },

  // ── Media Management ──
  getMediaFiles: async (tag?: string): Promise<MediaFile[]> => {
    const res = await apiClient.get<any>('/cms/media', { params: { tag } });
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  getMediaStats: async (): Promise<MediaStats> => {
    const res = await apiClient.get<any>('/cms/media/stats');
    const d = res.data;
    return d?.data || d;
  },

  generateAiMedia: async (payload: { prompt: string; name?: string; tags?: string[] }): Promise<MediaFile> => {
    const res = await apiClient.post<any>('/cms/media/generate', payload);
    const d = res.data;
    return d?.data || d;
  },

  uploadMediaFile: async (file: File, altText?: string, tags?: string[]): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('alt_text', altText);
    if (tags && tags.length) {
      tags.forEach((t) => formData.append('tags[]', t));
    }
    const res = await apiClient.post<any>('/cms/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const d = res.data;
    return d?.data || d;
  },

  storeMockMedia: async (payload: Partial<MediaFile>): Promise<MediaFile> => {
    const res = await apiClient.post<any>('/cms/media/mock', payload);
    const d = res.data;
    return d?.data || d;
  },

  deleteMediaFile: async (id: number): Promise<void> => {
    await apiClient.delete(`/cms/media/${id}`);
  },

  // ── Billing, Plans & Quotas ──
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const res = await apiClient.get<any>('/billing/plans');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  getCurrentSubscription: async (): Promise<TenantSubscription | null> => {
    const res = await apiClient.get<any>('/billing/subscription');
    const d = res.data;
    return d?.data || null;
  },

  subscribeToPlan: async (planId: number, billingCycle: 'monthly' | 'yearly' = 'monthly', paymentMethod: string = 'stripe'): Promise<TenantSubscription> => {
    const res = await apiClient.post<any>('/billing/subscribe', {
      plan_id: planId,
      billing_cycle: billingCycle,
      payment_method: paymentMethod,
    });
    const d = res.data;
    return d?.data || d;
  },

  cancelSubscription: async (): Promise<TenantSubscription> => {
    const res = await apiClient.post<any>('/billing/cancel');
    const d = res.data;
    return d?.data || d;
  },

  getInvoices: async (): Promise<BillingInvoice[]> => {
    const res = await apiClient.get<any>('/billing/invoices');
    const d = res.data;
    return d?.data || (Array.isArray(d) ? d : []);
  },

  payInvoice: async (id: number, gateway: string = 'stripe'): Promise<BillingInvoice> => {
    const res = await apiClient.post<any>(`/billing/invoices/${id}/pay`, { payment_gateway: gateway });
    const d = res.data;
    return d?.data || d;
  },

  getQuotaOverview: async (): Promise<QuotaOverview> => {
    const res = await apiClient.get<any>('/billing/quotas');
    const d = res.data;
    return d?.data || d;
  },
};
