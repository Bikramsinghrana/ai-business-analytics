import { AIProvider } from '../../../types/enums';
import { SearchType } from '../types/ai.types';

export interface AIProviderDetail {
  key: AIProvider;
  name: string;
  badge: string;
  isFree: boolean;
  description: string;
  defaultModel: string;
}

export const AI_PROVIDERS_CONFIG: Record<AIProvider, AIProviderDetail> = {
  [AIProvider.GEMINI]: {
    key: AIProvider.GEMINI,
    name: 'Google Gemini',
    badge: 'Free Tier',
    isFree: true,
    description: 'Fast Google AI with generous 60 req/min free quota',
    defaultModel: 'gemini-3.6-flash',
  },
  [AIProvider.GROQ]: {
    key: AIProvider.GROQ,
    name: 'Groq Llama 3.3',
    badge: 'Ultra Fast Free',
    isFree: true,
    description: 'High-speed Llama 3.3 70B open-source inference',
    defaultModel: 'llama-3.3-70b-versatile',
  },
  [AIProvider.OPENROUTER]: {
    key: AIProvider.OPENROUTER,
    name: 'OpenRouter Free',
    badge: 'Free Models',
    isFree: true,
    description: 'Aggregated free models (Llama 3.2, Gemini Flash, Qwen)',
    defaultModel: 'meta-llama/llama-3.2-3b-instruct:free',
  },
  [AIProvider.OLLAMA]: {
    key: AIProvider.OLLAMA,
    name: 'Ollama Local',
    badge: '100% Free & Private',
    isFree: true,
    description: 'Local on-premise AI model execution with zero cloud fees',
    defaultModel: 'llama3',
  },
  [AIProvider.OPENAI]: {
    key: AIProvider.OPENAI,
    name: 'OpenAI GPT-4o',
    badge: 'Pro API',
    isFree: false,
    description: 'State-of-the-art GPT-4o reasoning and analysis',
    defaultModel: 'gpt-4o',
  },
  [AIProvider.CLAUDE]: {
    key: AIProvider.CLAUDE,
    name: 'Anthropic Claude',
    badge: 'Pro API',
    isFree: false,
    description: 'Claude 3.5 Sonnet for deep technical reasoning',
    defaultModel: 'claude-3-5-sonnet-20241022',
  },
  [AIProvider.AURA]: {
    key: AIProvider.AURA,
    name: 'AURA Neural Engine',
    badge: 'Built-in Free',
    isFree: true,
    description: 'Built-in multi-agent tool execution engine with 100% uptime',
    defaultModel: 'aura-v1-hybrid',
  },
};

export const AI_PROVIDER_MODELS: Record<AIProvider, string> = {
  [AIProvider.GEMINI]: 'Google Gemini 3.6 Flash (Free)',
  [AIProvider.GROQ]: 'Groq Llama 3.3 70B (Fast Free)',
  [AIProvider.OPENROUTER]: 'OpenRouter (Free Tier)',
  [AIProvider.OLLAMA]: 'Ollama Local (Free & Offline)',
  [AIProvider.OPENAI]: 'OpenAI GPT-4o',
  [AIProvider.CLAUDE]: 'Anthropic Claude 3.5 Sonnet',
  [AIProvider.AURA]: 'AURA Multi-Agent Engine (Free)',
};

export interface SearchTypeOption {
  value: SearchType;
  label: string;
  badge: string;
  iconName: string;
  description: string;
}

export const SEARCH_TYPE_OPTIONS: SearchTypeOption[] = [
  {
    value: SearchType.WEB,
    label: 'Live Web Search',
    badge: 'Web',
    iconName: 'Globe',
    description: 'Live web searching for up-to-date facts',
  },
  {
    value: SearchType.GENERAL,
    label: 'General AI Assistant',
    badge: 'General',
    iconName: 'MessageSquare',
    description: 'General technical explanations & reasoning',
  },
  {
    value: SearchType.ECOMMERCE,
    label: 'E-commerce & Inventory',
    badge: 'Inventory',
    iconName: 'ShoppingBag',
    description: 'Product catalog search, stock alerts & SKUs',
  },
  {
    value: SearchType.NEWS,
    label: 'News & Breaking Events',
    badge: 'News',
    iconName: 'Newspaper',
    description: 'Live breaking news & global headlines',
  },
  {
    value: SearchType.AUTO,
    label: 'Auto Detect',
    badge: 'Smart Auto',
    iconName: 'Sparkles',
    description: 'Auto-detects query domain & real-time tools',
  },
  {
    value: SearchType.PROJECT,
    label: 'Project & Codebase',
    badge: 'Project',
    iconName: 'FolderGit2',
    description: 'Architecture, Laravel code, routes & frontend',
  },
  {
    value: SearchType.SPORTS,
    label: 'Sports & Cricket',
    badge: 'Sports',
    iconName: 'Trophy',
    description: 'Real-time cricket scores, matches & tournaments',
  },
  {
    value: SearchType.FINANCE,
    label: 'Stocks & Finance',
    badge: 'Stocks',
    iconName: 'TrendingUp',
    description: 'Live stock prices (TSLA, AAPL, NVDA) & crypto',
  },
  {
    value: SearchType.BUSINESS_DATA,
    label: 'Business Data & Sales',
    badge: 'Business',
    iconName: 'Database',
    description: 'Live SQL queries for sales, revenue & tickets',
  },
  {
    value: SearchType.WEATHER,
    label: 'Weather & Forecast',
    badge: 'Weather',
    iconName: 'CloudSun',
    description: 'Live meteorological forecast & temperature',
  },
  {
    value: SearchType.KNOWLEDGE,
    label: 'Documents & RAG',
    badge: 'Docs',
    iconName: 'FileText',
    description: 'Search uploaded tenant PDFs & contracts',
  },
];

export const SEARCH_TYPE_PLACEHOLDERS: Record<SearchType, string> = {
  [SearchType.AUTO]: 'Ask any question across project, sports, stocks, business, or web...',
  [SearchType.PROJECT]: 'Ask any question about project architecture, Laravel code, API routes, or frontend...',
  [SearchType.SPORTS]: 'Ask any question about live cricket scores, match updates, tournaments, or player stats...',
  [SearchType.FINANCE]: 'Ask any question about stock prices (Tesla, Apple, Nvidia), crypto, or market analysis...',
  [SearchType.BUSINESS_DATA]: 'Ask any question about tenant sales, gross revenue, orders, tickets, or CRM leads...',
  [SearchType.ECOMMERCE]: 'Ask any question about product catalog, SKU details, pricing, or low stock items...',
  [SearchType.NEWS]: 'Ask any question about latest breaking news, tech developments, or world headlines...',
  [SearchType.WEATHER]: 'Ask any question about live weather, forecast, or temperature for any city...',
  [SearchType.WEB]: 'Ask any question for real-time live web facts, references, and information...',
  [SearchType.KNOWLEDGE]: 'Ask any question from tenant documents, company policies, or contracts...',
  [SearchType.GENERAL]: 'Ask any question, logic, or technical concept...',
  [SearchType.DEVELOPER]: 'Ask any question about code review, controllers, migrations, or debugging...',
};
