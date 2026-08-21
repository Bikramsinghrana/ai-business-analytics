import { AIProvider } from '../../../types/enums';

export const AI_PROVIDER_MODELS: Record<AIProvider, string> = {
  [AIProvider.GEMINI]: 'Google Gemini (gemini-3.6-flash)',
  [AIProvider.OPENAI]: 'OpenAI GPT-4o',
  [AIProvider.CLAUDE]: 'Anthropic Claude 3.5 Sonnet',
};
