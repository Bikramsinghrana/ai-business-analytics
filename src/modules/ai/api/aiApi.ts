import { apiClient } from '../../../services/apiClient';
import {
  AiConversation,
  AiMessage,
  AiUsageStats,
  CreateConversationPayload,
  QuickPromptPayload,
  SendMessagePayload,
} from '../types/ai.types';

export const aiApi = {
  getConversations: () =>
    apiClient.get<{ conversations: AiConversation[] }>('/ai/conversations'),

  createConversation: (data?: CreateConversationPayload) =>
    apiClient.post<{ conversation: AiConversation }>('/ai/conversations', data || {}),

  getConversation: (id: string) =>
    apiClient.get<{ conversation: AiConversation }>(`/ai/conversations/${id}`),

  deleteConversation: (id: string) =>
    apiClient.delete(`/ai/conversations/${id}`),

  sendMessage: (id: string, data: SendMessagePayload) =>
    apiClient.post<{
      user_message: AiMessage;
      assistant_message: AiMessage;
      conversation: AiConversation;
    }>(`/ai/conversations/${id}/messages`, data),

  quickPrompt: (data: QuickPromptPayload) =>
    apiClient.post<{
      user_message: AiMessage;
      assistant_message: AiMessage;
      conversation: AiConversation;
    }>('/ai/quick-prompt', data),

  getUsage: () =>
    apiClient.get<AiUsageStats>('/ai/usage'),
};
