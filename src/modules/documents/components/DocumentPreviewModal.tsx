import React, { useState } from 'react';
import { KnowledgeDocument } from '../types/document.types';
import { 
  X, 
  FileText, 
  Layers, 
  History, 
  Info, 
  Copy, 
  Check, 
  Sparkles,
  Database,
  RefreshCw
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: KnowledgeDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onReindex?: (id: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  onReindex,
}) => {
  const [activeTab, setActiveTab] = useState<'key_data' | 'text' | 'chunks' | 'versions' | 'metadata'>('key_data');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !document) return null;

  const importantData = document.metadata?.important_data;
  const entities = importantData?.entities || {};
  const highlights = importantData?.highlights || [];
  const docType = importantData?.document_type || (document.file_type ? `${document.file_type.toUpperCase()} Document` : 'Document');

  const handleCopyText = () => {
    if (document.extracted_text) {
      navigator.clipboard.writeText(document.extracted_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const entityEntries = Object.entries(entities);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate max-w-md">{document.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {docType}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  document.status === 'INDEXED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  document.status === 'PROCESSING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {document.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                <span>Category: <strong className="text-slate-200">{document.category || 'General'}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-slate-200">{(document.file_size / 1024).toFixed(1)} KB</strong></span>
                <span>•</span>
                <span>Words: <strong className="text-slate-200">{document.word_count}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReindex && (
              <button
                onClick={() => onReindex(document.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Analyze & Index</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('key_data')}
              className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'key_data'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Important Key Data & Summary
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'text'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Full Extracted Text
            </button>
            <button
              onClick={() => setActiveTab('chunks')}
              className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'chunks'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Vector Chunks ({document.chunks?.length || document.chunk_count})
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'metadata'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Metadata & Storage
            </button>
          </div>

          {activeTab === 'text' && (
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'key_data' && (
            <div className="space-y-6">
              
              {/* Executive Summary Card */}
              <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 rounded-2xl border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Executive Summary & Purpose
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {document.summary || 'Summary is being processed or available on re-indexing.'}
                </p>
              </div>

              {/* Key Highlights */}
              {highlights.length > 0 && (
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Key Highlights & Findings
                  </span>
                  <ul className="space-y-1.5">
                    {highlights.map((h: string, i: number) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Key Data Entity Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Extracted Important Key Data ({entityEntries.length} Fields)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Document Type: <span className="text-indigo-400 font-semibold">{docType}</span>
                  </span>
                </div>

                {entityEntries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {entityEntries.map(([k, v], idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors space-y-1"
                      >
                        <span className="text-[11px] font-semibold text-slate-400 block truncate">
                          {k}
                        </span>
                        <span className="text-xs font-bold text-white block select-all break-words">
                          {Array.isArray(v) ? v.join(', ') : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                    <p>Click "Re-Analyze & Index" to generate AI key entity extraction on this document.</p>
                  </div>
                )}
              </div>

              {/* Tags & Classification */}
              {document.tags && document.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {document.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {document.extracted_text || 'No extracted text available for this document.'}
              </div>
            </div>
          )}

          {activeTab === 'chunks' && (
            <div className="space-y-3">
              {document.chunks && document.chunks.length > 0 ? (
                document.chunks.map((chunk, idx) => (
                  <div
                    key={chunk.id || idx}
                    className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-indigo-400 flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" />
                        Chunk #{chunk.chunk_index + 1} (Page {chunk.page_number || 1})
                      </span>
                      <span className="text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                        {chunk.token_count} Tokens • {chunk.embedding_model || 'text-embedding-004'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{chunk.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No individual chunk records retrieved. (Total Chunks: {document.chunk_count})
                </div>
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400">Current Live Version ({document.version})</span>
                  <p className="text-[11px] text-slate-400">Indexed on {new Date(document.updated_at).toLocaleString()}</p>
                </div>
                <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
              {document.versions?.map((ver) => (
                <div key={ver.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300">{ver.version_number}</span>
                    <p className="text-[11px] text-slate-500">{ver.change_summary || 'Archived version'}</p>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(ver.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Storage Disk</span>
                <span className="font-semibold text-slate-200">{document.storage_disk} (Tenant Isolated)</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">File Hash (SHA-256)</span>
                <span className="font-mono text-slate-200 truncate block">{document.file_hash || 'N/A'}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Total Word Count</span>
                <span className="font-semibold text-slate-200">{document.word_count} words</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Total Embedded Tokens</span>
                <span className="font-semibold text-slate-200">{document.token_count} tokens</span>
              </div>
              <div className="col-span-2 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Tags</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {document.tags && document.tags.length > 0 ? (
                    document.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded text-[11px]">
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No custom tags</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
