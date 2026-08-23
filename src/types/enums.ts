export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_OWNER = 'TENANT_OWNER',
  TENANT_ADMIN = 'TENANT_ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  ANALYST = 'ANALYST',
  DEVELOPER = 'DEVELOPER',
  CLIENT = 'CLIENT',
  USER = 'USER',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_ON_CUSTOMER = 'WAITING_ON_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum LeadStatus {
  NEW = 'NEW',
  QUALIFIED = 'QUALIFIED',
  CONTACTED = 'CONTACTED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  WON = 'WON',
  LOST = 'LOST',
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  GROQ = 'GROQ',
  CLAUDE = 'CLAUDE',
  OPENROUTER = 'OPENROUTER',
  OLLAMA = 'OLLAMA',
  AURA = 'AURA',
}

export enum FeatureKey {
  AI_CHAT = 'ai_chat',
  SQL_ANALYST = 'sql_analyst',
  RAG_DOCUMENTS = 'rag_documents',
  SUPPORT_AGENT = 'support_agent',
  SALES_AGENT = 'sales_agent',
  ECOMMERCE_AGENT = 'ecommerce_agent',
  DEVELOPER_AGENT = 'developer_agent',
  ANALYTICS = 'analytics',
}
