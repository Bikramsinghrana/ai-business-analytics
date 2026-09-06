export interface DashboardMetrics {
  overview: {
    total_tenants: number;
    active_tenants: number;
    total_users: number;
    active_users: number;
    total_ai_tokens: number;
    today_ai_tokens: number;
    total_ai_requests: number;
    active_subscriptions: number;
    estimated_mrr: number;
    database_size_mb: number;
    active_ai_providers: string;
    active_feature_flags: string;
  };
  health_matrix: Record<string, {
    status: 'healthy' | 'degraded' | 'offline';
    latency_ms?: number;
    driver?: string;
    default_model?: string;
    failover_ready?: boolean;
    backlog?: number;
    used_mb?: number;
  }>;
  recent_tenants: Array<{
    id: string;
    name: string;
    slug?: string;
    status: string;
    created_at: string;
  }>;
}

export interface SystemInfo {
  php_version: string;
  laravel_version: string;
  os: string;
  server_software: string;
  environment: string;
  debug_mode: boolean;
  timezone: string;
  server_time: string;
  memory_limit: string;
  max_execution_time: string;
  upload_max_filesize: string;
  post_max_size: string;
  database_driver: string;
  cache_driver: string;
  queue_driver: string;
  session_driver: string;
  storage_disk: string;
  app_url: string;
}

export interface CacheStats {
  driver: string;
  status: string;
  prefix: string;
  estimated_memory_mb: number;
  hit_rate_percentage: number;
  total_hits: number;
  total_misses: number;
  last_flushed_at: string;
}

export interface QueueStats {
  driver: string;
  workers_active: number;
  active_queues: string[];
  total_processed_24h: number;
  pending_jobs: number;
  failed_jobs_count: number;
  failed_jobs: Array<{
    id: number | string;
    connection: string;
    queue: string;
    failed_at: string;
    exception?: string;
  }>;
}

export interface DatabaseStats {
  database_name: string;
  total_size_mb: number;
  total_rows: number;
  table_count: number;
  tables: Array<{
    name: string;
    rows: number;
    size_mb: number;
    data_mb: number;
    index_mb: number;
    engine: string;
    updated_at: string;
  }>;
  recent_backups: Array<{
    id: number;
    file_name: string;
    disk: string;
    size_bytes: number;
    status: string;
    type: string;
    created_at: string;
  }>;
}

export interface LogEntry {
  timestamp: string;
  environment: string;
  level: string;
  message: string;
  raw?: string;
}

export interface LogsResponse {
  total_lines: number;
  count: number;
  entries: LogEntry[];
}

export interface AiProvider {
  id: number;
  provider_name: string;
  display_name: string;
  api_key_masked?: string;
  models?: Array<{ id: string; name: string; is_default?: boolean }>;
  default_model?: string;
  is_active: boolean;
  priority: number;
  rate_limit_rpm: number;
  settings?: Record<string, any>;
  last_tested_at?: string;
  health_status: 'healthy' | 'degraded' | 'offline';
}

export interface FeatureFlag {
  id: number;
  name: string;
  key: string;
  description?: string;
  is_enabled: boolean;
  tenant_id?: string | null;
  rules?: Record<string, any>;
  updated_at?: string;
}

export interface SystemPromptTemplate {
  id: number;
  title: string;
  slug: string;
  module: string;
  prompt_text: string;
  version: string;
  is_active: boolean;
  variables?: string[];
  updated_at?: string;
}

export interface PlatformSetting {
  id: number;
  key: string;
  value: string;
  group: string;
  type: string;
  description?: string;
  is_public: boolean;
}
