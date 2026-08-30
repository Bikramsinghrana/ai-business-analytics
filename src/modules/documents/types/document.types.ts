export interface DocumentFolder {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: string | null;
  is_shared?: boolean;
  documents_count?: number;
  children_folders?: DocumentFolder[];
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  token_count: number;
  page_number?: number;
  embedding_provider?: string;
  embedding_model?: string;
  metadata?: Record<string, any>;
}

export interface DocumentVersion {
  id: string;
  version_number: string;
  file_path: string;
  file_size: number;
  change_summary?: string;
  created_by?: string;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  tenant_id: string;
  folder_id?: string | null;
  folder?: DocumentFolder;
  title: string;
  category: string;
  tags?: string[];
  file_path: string;
  storage_disk: string;
  s3_key?: string;
  file_type: string;
  file_size: number;
  version: string;
  file_hash?: string;
  status: 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';
  ocr_enabled: boolean;
  extracted_text?: string;
  chunk_count: number;
  word_count: number;
  token_count: number;
  summary?: string;
  metadata?: Record<string, any>;
  error_log?: string;
  created_at: string;
  updated_at: string;
  chunks?: DocumentChunk[];
  versions?: DocumentVersion[];
}

export interface DocumentCitation {
  source_index: number;
  document_id: string;
  document_title: string;
  file_type: string;
  page_number: number;
  chunk_index: number;
  similarity_score: number;
  snippet: string;
}

export interface RAGSearchMatch {
  chunk_id: string;
  document_id: string;
  document_title: string;
  file_type: string;
  category: string;
  chunk_index: number;
  page_number: number;
  content: string;
  token_count: number;
  score: number;
  fused_score?: number;
}

export interface RAGSearchResult {
  total_found: number;
  latency_ms: number;
  search_mode: 'hybrid' | 'semantic' | 'keyword';
  citations: DocumentCitation[];
  context_text: string;
  matches: RAGSearchMatch[];
}

export interface DocumentQAResponse {
  question: string;
  answer: string;
  citations: DocumentCitation[];
  used_documents: string[];
  confidence_score: number;
  tokens_used: number;
  latency_ms: number;
}

export interface DocumentAnalysis {
  document_id: string;
  title: string;
  executive_summary: string;
  key_insights: string[];
  action_items: string[];
  extracted_entities: any[];
  sentiment_and_tone?: { tone: string; sentiment: string };
  suggested_tags: string[];
  detected_category: string;
}

export interface DocumentAnalyticsStats {
  total_documents: number;
  indexed_documents: number;
  processing_documents: number;
  failed_documents: number;
  total_chunks: number;
  total_words: number;
  total_file_size_bytes: number;
  total_tokens_embedded: number;
  total_searches: number;
  total_chats: number;
}

export interface DocumentAuditLogItem {
  id: string;
  event_type: string;
  query?: string;
  tokens_used: number;
  latency_ms: number;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  message?: string;
  created_at: string;
  user?: { name: string; email: string };
  document?: { title: string; file_type: string };
}
