import { AIProvider } from '../../../types/enums';

export interface ToolCall {
  tool: string;
  status: string;
  description: string;
}

export interface AiMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tokens_used: number;
  tool_calls?: ToolCall[] | null;
  metadata?: {
    provider?: string;
    model?: string;
  } | null;
  created_at?: string;
}

export interface AiConversation {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  provider: AIProvider | string;
  model: string;
  created_at: string;
  updated_at?: string;
  messages?: AiMessage[];
}

export interface SendMessagePayload {
  message: string;
  provider?: AIProvider | string;
  model?: string;
}

export interface CreateConversationPayload {
  title?: string;
  provider?: AIProvider | string;
  model?: string;
}

export interface QuickPromptPayload extends SendMessagePayload {
  conversation_id?: string;
}

export interface AiUsageStats {
  total_tokens: number;
  total_cost: number;
  total_requests: number;
  by_provider: Array<{
    provider: string;
    tokens: number;
    count: number;
  }>;
}
