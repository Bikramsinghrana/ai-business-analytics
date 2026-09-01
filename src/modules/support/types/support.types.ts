export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country_code?: string;
  company?: string;
  notes?: string;
  created_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'CUSTOMER' | 'AI_AGENT' | 'HUMAN_AGENT' | 'SYSTEM';
  sender_id?: string;
  sender_name?: string;
  message: string;
  attachments?: any;
  sentiment?: string;
  tokens_used?: number;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  tenant_id: string;
  customer_id?: string;
  customer?: Customer;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  sentiment: string;
  sentiment_score: number;
  ai_summary?: string;
  assigned_user_id?: string;
  assigned_user?: { id: string; name: string; email: string };
  sla_due_at?: string;
  first_response_at?: string;
  resolved_at?: string;
  is_escalated: boolean;
  channel: string;
  tags?: string[];
  messages?: TicketMessage[];
  created_at: string;
  updated_at: string;
}

export interface SupportFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
  is_published: boolean;
  view_count: number;
  helpful_count: number;
  created_at?: string;
}

export interface SupportAnalytics {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  escalated_tickets: number;
  resolution_rate: number;
  sla_compliance_rate: number;
  avg_first_response_minutes: number;
  sentiment_breakdown: {
    Positive: number;
    Neutral: number;
    Frustrated: number;
    Urgent: number;
  };
  categories: Record<string, number>;
  priorities: Record<string, number>;
}

export interface Customer360Profile {
  customer: Customer;
  total_orders: number;
  total_spent: number;
  active_tickets_count: number;
  orders: any[];
  tickets: SupportTicket[];
}
