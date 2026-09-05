import { apiClient } from '../../../services/apiClient';
import {
  AiConversation,
  AiSettings,
  AiUsageStats,
  CreateConversationPayload,
  PromptPersona,
  QuickPromptPayload,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/ai.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const aiApi = {
  getProviders: () =>
    apiClient.get<{ providers: any[]; default_provider: string }>('/ai/providers'),

  getPersonas: () =>
    apiClient.get<{ personas: PromptPersona[] }>('/ai/personas'),

  getSettings: () =>
    apiClient.get<{ settings: AiSettings }>('/ai/settings'),

  updateSettings: (data: Partial<AiSettings>) =>
    apiClient.put<{ settings: AiSettings }>('/ai/settings', data),

  getConversations: () =>
    apiClient.get<{ conversations: AiConversation[] }>('/ai/conversations'),

  createConversation: (data?: CreateConversationPayload) =>
    apiClient.post<{ conversation: AiConversation }>('/ai/conversations', data || {}),

  getConversation: (id: string) =>
    apiClient.get<{ conversation: AiConversation }>(`/ai/conversations/${id}`),

  updateConversationTitle: (id: string, title: string) =>
    apiClient.put<{ conversation: AiConversation }>(`/ai/conversations/${id}`, { title }),

  clearConversationMessages: (id: string) =>
    apiClient.delete<{ conversation: AiConversation }>(`/ai/conversations/${id}/messages`),

  deleteConversation: (id: string) =>
    apiClient.delete(`/ai/conversations/${id}`),

  sendMessage: (id: string, data: SendMessagePayload) =>
    apiClient.post<SendMessageResponse>(`/ai/conversations/${id}/messages`, data),

  quickPrompt: (data: QuickPromptPayload) =>
    apiClient.post<SendMessageResponse>('/ai/quick-prompt', data),

  getUsage: () =>
    apiClient.get<AiUsageStats>('/ai/usage'),

  /**
   * Stream message using Server-Sent Events (SSE) reader.
   */
  streamMessage: async (
    conversationId: string,
    payload: SendMessagePayload,
    onChunk: (chunk: string) => void,
    onComplete: (data: SendMessageResponse) => void,
    onError: (err: any) => void
  ) => {
    try {
      const token = localStorage.getItem('aura_auth_token');
      const tenantId = localStorage.getItem('aura_active_tenant_id');

      const response = await fetch(`${API_BASE_URL}/ai/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Streaming error: HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported by browser.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const rawJson = trimmed.slice(6);
            try {
              const event = JSON.parse(rawJson);
              if (event.error) {
                onError(new Error(event.message || 'Stream error'));
                return;
              }
              if (event.chunk) {
                onChunk(event.chunk);
              }
              if (event.done && event.data) {
                onComplete(event.data);
                return;
              }
            } catch (err) {
              console.warn('Failed to parse SSE line:', rawJson);
            }
          }
        }
      }
    } catch (err: any) {
      onError(err);
    }
  },
};
