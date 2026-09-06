export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action_ai' | 'action_ai_task' | 'action_notification' | 'action_webhook' | 'action_database';
  title: string;
  config: Record<string, any>;
}

export interface AutomationWorkflow {
  id: number;
  tenant_id: number;
  name: string;
  description?: string;
  trigger_type: 'event' | 'schedule' | 'webhook' | 'manual';
  trigger_config?: Record<string, any>;
  nodes?: WorkflowNode[];
  is_active: boolean;
  last_run_at?: string | null;
  run_count: number;
  success_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
  execution_logs_count?: number;
}

export interface WorkflowExecutionLog {
  id: number;
  tenant_id: number;
  workflow_id: number;
  status: 'success' | 'failed' | 'running';
  trigger_payload?: Record<string, any>;
  step_results?: Array<{
    node_id: string;
    title: string;
    type: string;
    status: string;
    output?: any;
    duration_ms?: number;
  }>;
  error_message?: string | null;
  execution_time_ms: number;
  created_at: string;
  workflow?: AutomationWorkflow;
}

export interface NotificationTemplate {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  channel: 'email' | 'in_app' | 'sms' | 'webhook' | 'slack';
  subject?: string;
  body: string;
  variables?: string[];
  is_active: boolean;
  logs_count?: number;
  created_at: string;
}

export interface NotificationLog {
  id: number;
  tenant_id: number;
  template_id?: number | null;
  recipient: string;
  channel: string;
  subject?: string;
  content?: string;
  status: 'sent' | 'failed' | 'queued';
  metadata?: Record<string, any>;
  created_at: string;
  template?: NotificationTemplate;
}

export interface CmsPage {
  id: number;
  tenant_id: number;
  title: string;
  slug: string;
  content?: string;
  layout: 'default' | 'landing' | 'full_width' | 'blog';
  meta_title?: string;
  meta_description?: string;
  status: 'published' | 'draft' | 'archived';
  view_count: number;
  published_at?: string | null;
  created_at: string;
}

export interface CmsMenuItem {
  title: string;
  url: string;
  target?: '_self' | '_blank';
  icon?: string;
  children?: CmsMenuItem[];
}

export interface CmsMenu {
  id: number;
  tenant_id: number;
  name: string;
  location: 'header' | 'footer' | 'sidebar' | 'mobile';
  items?: CmsMenuItem[];
  is_active: boolean;
  created_at: string;
}

export interface CmsContentBlock {
  id: number;
  tenant_id: number;
  identifier: string;
  title: string;
  type: 'hero' | 'cta' | 'features' | 'testimonial' | 'custom_html';
  content?: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface MediaFile {
  id: number;
  tenant_id: number;
  name: string;
  file_name: string;
  file_path: string;
  disk: string;
  mime_type?: string;
  size_bytes: number;
  tags?: string[];
  alt_text?: string;
  url?: string;
  created_at: string;
}

export interface MediaStats {
  total_bytes: number;
  total_mb: number;
  total_gb: number;
  file_count: number;
  image_count: number;
  document_count: number;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features?: string[];
  limits?: {
    ai_tokens_monthly?: number;
    storage_mb?: number;
    user_seats?: number;
    workflows_count?: number;
  };
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

export interface TenantSubscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start?: string;
  current_period_end?: string;
  trial_ends_at?: string | null;
  canceled_at?: string | null;
  payment_method: string;
  plan?: SubscriptionPlan;
  invoices?: BillingInvoice[];
}

export interface BillingInvoice {
  id: number;
  tenant_id: number;
  subscription_id?: number | null;
  invoice_number: string;
  amount: number;
  currency: string;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'refunded';
  due_date?: string;
  paid_at?: string | null;
  items?: Array<{
    description: string;
    unit_price: number;
    quantity: number;
    total: number;
  }>;
  pdf_url?: string;
  payment_gateway: string;
  transaction_reference?: string;
  created_at: string;
}

export interface QuotaOverview {
  period: string;
  plan: {
    id?: number;
    name: string;
    slug: string;
    price_monthly: number;
    currency: string;
  };
  subscription?: {
    status: string;
    billing_cycle: string;
    current_period_end?: string;
    payment_method: string;
  } | null;
  metrics: {
    ai_tokens: {
      used: number;
      limit: number;
      percentage: number;
      unit: string;
    };
    ai_requests: {
      used: number;
      limit: number | null;
      unit: string;
    };
    storage: {
      used_mb: number;
      limit_mb: number;
      percentage: number;
      unit: string;
    };
    workflows: {
      used: number;
      limit: number;
      percentage: number;
      unit: string;
    };
    user_seats: {
      used: number;
      limit: number;
      percentage: number;
      unit: string;
    };
  };
}
