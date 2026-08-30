import React, { useState } from 'react';
import { KnowledgeDocument } from '../types/document.types';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Layers, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Folder,
  SlidersHorizontal,
  MoreVertical,
  Plus
} from 'lucide-react';

interface Props {
  documents: KnowledgeDocument[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPreview: (doc: KnowledgeDocument) => void;
  onReindex: (doc: KnowledgeDocument) => void;
  onDelete: (id: string) => void;
  onOpenUpload: () => void;
  onSelectForChat?: (doc: KnowledgeDocument) => void;
}

export const DocumentGridList: React.FC<Props> = ({
  documents,
  loading,
  searchQuery,
  onSearchChange,
  onPreview,
  onReindex,
  onDelete,
  onOpenUpload,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const getFileBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'docx':
      case 'doc':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'csv':
      case 'xlsx':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INDEXED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Indexed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Loader2 className="w-3 h-3 animate-spin" /> Chunking...
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 flex-1">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title, summary, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800/60">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-xs font-medium">Loading knowledge base records...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No documents found</h4>
            <p className="text-xs text-slate-400 mt-1">Upload PDF, DOCX, CSV, or TXT files to start semantic search.</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30"
          >
            Upload Your First Document
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-lg group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${getFileBadgeColor(doc.file_type)}`}>
                    {doc.file_type}
                  </span>
                  {getStatusBadge(doc.status)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {doc.metadata?.important_data?.document_type && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 truncate max-w-[200px]">
                        {doc.metadata.important_data.document_type}
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onPreview(doc)}
                    className="text-sm font-bold text-white group-hover:text-indigo-400 cursor-pointer truncate transition-colors"
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.summary || doc.extracted_text || 'Document parsed and indexed in vector database.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    {doc.chunk_count} Chunks ({doc.word_count} words)
                  </span>
                  <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1">
                  <button
                    onClick={() => onPreview(doc)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>

                  <button
                    onClick={() => onReindex(doc)}
                    className="p-1.5 bg-slate-800/60 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 rounded-lg transition-colors"
                    title="Re-index Chunks"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1.5 bg-slate-800/60 hover:bg-red-600/30 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Chunks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div
                        onClick={() => onPreview(doc)}
                        className="font-bold text-white hover:text-indigo-400 cursor-pointer truncate max-w-xs"
                      >
                        {doc.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{doc.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getFileBadgeColor(doc.file_type)}`}>
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{doc.chunk_count} ({doc.word_count}w)</td>
                    <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(doc.updated_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onPreview(doc)}
                        className="text-slate-400 hover:text-white"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => onReindex(doc)}
                        className="text-slate-400 hover:text-indigo-400"
                        title="Reindex"
                      >
                        <RefreshCw className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
