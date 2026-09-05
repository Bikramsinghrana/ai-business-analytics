import { apiClient } from './apiClient';

export interface ColumnMetadata {
  name: string;
  type: string;
  full_type?: string;
  is_nullable: boolean;
  is_primary: boolean;
  is_foreign: boolean;
  default?: any;
}

export interface TableSchema {
  table: string;
  columns: ColumnMetadata[];
  row_count: number;
  description: string;
}

export interface NaturalQueryResponse {
  natural_query: string;
  sql: string;
  explanation: string;
  chart_type: 'table' | 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  suggested_followups: string[];
  key_metrics: string[];
}

export interface SqlExecutionResponse {
  success: boolean;
  sql: string;
  columns: string[];
  rows: Record<string, any>[];
  row_count: number;
  execution_time_ms: number;
  error?: string;
  executed_at?: string;
}

export interface SqlExplanationResponse {
  is_valid: boolean;
  sql: string;
  explanation: string;
  complexity: string;
  optimization_tips: string[];
  error?: string;
}

export interface ExecutiveInsightsResponse {
  metrics: {
    total_revenue: number;
    order_count: number;
    avg_order_value: number;
    customer_count: number;
    active_products: number;
    sales_leads: number;
    pipeline_value: number;
    open_support_tickets: number;
  };
  headline: string;
  trend_analysis: string;
  risk_signals: string[];
  recommendations: string[];
  period: string;
  generated_at: string;
}

export interface SavedReport {
  id: string;
  tenant_id: string;
  user_id?: string;
  name: string;
  description?: string;
  sql_query: string;
  chart_type: 'table' | 'bar' | 'line' | 'area' | 'pie' | 'kpi';
  chart_config?: Record<string, any>;
  parameters?: Record<string, any>;
  is_public: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ScheduledReport {
  id: string;
  tenant_id: string;
  saved_report_id: string;
  name: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'csv' | 'json' | 'pdf';
  status: 'active' | 'paused';
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  saved_report?: SavedReport;
}

export interface QueryHistoryItem {
  id: string;
  tenant_id: string;
  user_id?: string;
  natural_query?: string;
  sql_query: string;
  execution_time_ms: number;
  row_count: number;
  status: 'success' | 'error';
  error_message?: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

class BiService {
  /**
   * Convert Natural Language Question to SQL Query.
   */
  async generateNaturalQuery(query: string): Promise<NaturalQueryResponse> {
    const res = await apiClient.post<NaturalQueryResponse>('/bi/query/natural', { query });
    return res.data;
  }

  /**
   * Execute read-only SQL in sandbox.
   */
  async executeSql(sql: string, naturalQuery?: string): Promise<SqlExecutionResponse> {
    const res = await apiClient.post<SqlExecutionResponse>('/bi/query/execute', {
      sql,
      natural_query: naturalQuery,
    });
    return res.data;
  }

  /**
   * AI SQL explanation and optimization suggestions.
   */
  async explainSql(sql: string): Promise<SqlExplanationResponse> {
    const res = await apiClient.post<SqlExplanationResponse>('/bi/query/explain', { sql });
    return res.data;
  }

  /**
   * Discover MySQL database schema.
   */
  async getSchema(): Promise<TableSchema[]> {
    const res = await apiClient.get<TableSchema[]>('/bi/schema');
    return res.data;
  }

  /**
   * Get Automated Executive BI Insights & Trend Analysis.
   */
  async getInsights(): Promise<ExecutiveInsightsResponse> {
    const res = await apiClient.get<ExecutiveInsightsResponse>('/bi/insights');
    return res.data;
  }

  /**
   * List saved reports.
   */
  async getSavedReports(): Promise<SavedReport[]> {
    const res = await apiClient.get<SavedReport[]>('/bi/saved-reports');
    return res.data;
  }

  /**
   * Create a saved report.
   */
  async saveReport(data: {
    name: string;
    description?: string;
    sql_query: string;
    chart_type?: string;
    tags?: string[];
    is_public?: boolean;
  }): Promise<SavedReport> {
    const res = await apiClient.post<SavedReport>('/bi/saved-reports', data);
    return res.data;
  }

  /**
   * Update a saved report.
   */
  async updateReport(id: string, data: Partial<SavedReport>): Promise<SavedReport> {
    const res = await apiClient.put<SavedReport>(`/bi/saved-reports/${id}`, data);
    return res.data;
  }

  /**
   * Delete a saved report.
   */
  async deleteReport(id: string): Promise<void> {
    await apiClient.delete(`/bi/saved-reports/${id}`);
  }

  /**
   * Run a saved report by ID.
   */
  async runSavedReport(id: string): Promise<{ report: SavedReport; result: SqlExecutionResponse }> {
    const res = await apiClient.post<{ report: SavedReport; result: SqlExecutionResponse }>(
      `/bi/saved-reports/${id}/run`,
      {}
    );
    return res.data;
  }

  /**
   * List scheduled reports.
   */
  async getScheduledReports(): Promise<ScheduledReport[]> {
    const res = await apiClient.get<ScheduledReport[]>('/bi/scheduled-reports');
    return res.data;
  }

  /**
   * Create scheduled report.
   */
  async createScheduledReport(data: {
    saved_report_id: string;
    name: string;
    frequency: string;
    recipients: string[];
    format?: string;
  }): Promise<ScheduledReport> {
    const res = await apiClient.post<ScheduledReport>('/bi/scheduled-reports', data);
    return res.data;
  }

  /**
   * Trigger scheduled report immediately.
   */
  async triggerScheduledReport(id: string): Promise<{ message: string; execution: SqlExecutionResponse }> {
    const res = await apiClient.post<{ message: string; execution: SqlExecutionResponse }>(
      `/bi/scheduled-reports/${id}/trigger`,
      {}
    );
    return res.data;
  }

  /**
   * Delete scheduled report.
   */
  async deleteScheduledReport(id: string): Promise<void> {
    await apiClient.delete(`/bi/scheduled-reports/${id}`);
  }

  /**
   * Get query history.
   */
  async getQueryHistory(): Promise<QueryHistoryItem[]> {
    const res = await apiClient.get<QueryHistoryItem[]>('/bi/history');
    return res.data;
  }

  /**
   * Clear query history.
   */
  async clearQueryHistory(): Promise<void> {
    await apiClient.delete('/bi/history');
  }

  /**
   * Export query results as CSV download.
   */
  async exportCsv(sql: string, filename: string = 'query_export'): Promise<void> {
    const res = await apiClient.post<string>(
      '/bi/export',
      { sql, format: 'csv', filename },
      { responseType: 'blob' as any }
    );
    
    // Download trigger
    const blob = new Blob([res as any], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export const biService = new BiService();
