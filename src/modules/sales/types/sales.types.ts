export interface SalesLead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  score: number;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'LOST';
  lead_source: string;
  qualification_status: 'UNQUALIFIED' | 'MARKETING_QUALIFIED' | 'SALES_QUALIFIED';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOpportunity {
  id: string;
  tenant_id: string;
  lead_id?: string;
  customer_id?: string;
  title: string;
  value: number;
  stage: 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  probability: number;
  expected_close_date?: string;
  closed_at?: string;
  notes?: string;
  lead?: SalesLead;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  products_count?: number;
}

export interface ProductCatalogItem {
  id: string;
  tenant_id: string;
  category_id?: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  inventory_qty: number;
  status: string;
  images?: string[];
  ai_recommendation_tags?: string[];
  category?: ProductCategory;
}

export interface LeadActivity {
  id: string;
  tenant_id: string;
  lead_id: string;
  activity_type: string;
  subject: string;
  notes?: string;
  scheduled_at?: string;
  completed_at?: string;
}

export interface SalesAnalytics {
  total_revenue: number;
  deal_revenue: number;
  order_revenue: number;
  pipeline_value: number;
  total_leads: number;
  qualified_leads: number;
  lead_conversion_rate: number;
  total_orders: number;
  total_products: number;
  low_stock_products_count: number;
  sales_funnel: {
    leads: number;
    proposals: number;
    negotiations: number;
    closed_won: number;
  };
  monthly_revenue: { month: string; revenue: number }[];
}
