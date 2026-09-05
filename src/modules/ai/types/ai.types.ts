import { AIProvider } from '../../../types/enums';

export enum SearchType {
  AUTO = 'AUTO',
  GENERAL = 'GENERAL',
  PROJECT = 'PROJECT',
  NEWS = 'NEWS',
  SPORTS = 'SPORTS',
  FINANCE = 'FINANCE',
  WEATHER = 'WEATHER',
  WEB = 'WEB',
  KNOWLEDGE = 'KNOWLEDGE',
  BUSINESS_DATA = 'BUSINESS_DATA',
  ECOMMERCE = 'ECOMMERCE',
  DEVELOPER = 'DEVELOPER',
}

export interface ToolCall {
  tool: string;
  status: string;
  description: string;
  source?: string | null;
  updated_at?: string | null;
}

export interface AgentResponseMeta {
  content: string;
  tokens_used: number;
  agent_name: string;
  search_type: string;
  tool_calls: ToolCall[];
  source?: string | null;
  updated_at?: string | null;
  is_real_time: boolean;
  provider?: string | null;
  model?: string | null;
  metadata?: Record<string, any>;
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
    agent_name?: string;
    search_type?: string;
    source?: string | null;
    updated_at?: string | null;
    is_real_time?: boolean;
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
  search_type?: SearchType | string;
  provider?: AIProvider | string;
  model?: string;
}

export interface CreateConversationPayload {
  title?: string;
  provider?: AIProvider | string;
  model?: string;
}

export interface SendMessagePayload {
  message: string;
  search_type?: SearchType | string;
  provider?: AIProvider | string;
  model?: string;
  system_prompt?: string;
  temperature?: number;
}

export interface QuickPromptPayload extends SendMessagePayload {
  conversation_id?: string;
}

export interface SendMessageResponse {
  user_message: AiMessage;
  assistant_message: AiMessage;
  agent_response?: AgentResponseMeta;
  conversation: AiConversation;
  rate_limit?: {
    limit: number;
    remaining: number;
  };
}

export interface PromptPersona {
  id: string;
  name: string;
  description: string;
  icon: string;
  system_prompt: string;
}

export interface AiSettings {
  default_provider: string;
  default_model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  memory_enabled: boolean;
  streaming_enabled: boolean;
  rate_limit_rpm: number;
  response_format: 'markdown' | 'json';
  api_keys: {
    gemini?: string;
    openai?: string;
    claude?: string;
    groq?: string;
    openrouter?: string;
  };
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
  recent_logs?: Array<{
    id: string;
    agent_id: string;
    provider: string;
    model: string;
    total_tokens: number;
    estimated_cost: number;
    created_at: string;
  }>;
}

