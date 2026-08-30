import React, { useState } from 'react';
import { RAGSearchResult, KnowledgeDocument } from '../types/document.types';
import { 
  Search, 
  Sparkles, 
  Sliders, 
  Database, 
  Zap, 
  Layers, 
  FileText, 
  Code, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { ragApi } from '../api/ragApi';

interface Props {
  documents: KnowledgeDocument[];
}

export const RAGSearchStudio: React.FC<Props> = ({ documents }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'hybrid' | 'semantic' | 'keyword'>('hybrid');
  const [topK, setTopK] = useState(5);
  const [minScore, setMinScore] = useState(0.2);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RAGSearchResult | null>(null);
  const [copiedContext, setCopiedContext] = useState(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'context'>('matches');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await ragApi.search({
        query,
        mode,
        top_k: topK,
        min_score: minScore,
        category: selectedCategory || undefined,
      });
      setResult(data);
    } catch (err) {
      console.error('RAG Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContext = () => {
    if (result?.context_text) {
      navigator.clipboard.writeText(result.context_text);
      setCopiedContext(true);
      setTimeout(() => setCopiedContext(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Search Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              RAG Hybrid & Semantic Search Workbench
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test dense vector cosine embeddings, sparse keyword matching, and Reciprocal Rank Fusion (RRF).
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['hybrid', 'semantic', 'keyword'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  mode === m
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter search query or prompt to retrieve vector chunks (e.g. SLA response times, payment conditions, architecture)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Execute Search
          </button>
        </form>

        {/* Hyperparameter Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Top-K Chunks</span>
              <span className="font-bold text-indigo-400">{topK} matches</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Min Similarity Threshold</span>
              <span className="font-bold text-indigo-400">{(minScore * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="Legal">Legal</option>
              <option value="Finance">Finance</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Retrieved {result.total_found} Vector Matches ({result.latency_ms}ms)
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 uppercase">
                {result.search_mode} Search
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    activeTab === 'matches' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Chunks List
                </button>
                <button
                  onClick={() => setActiveTab('context')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    activeTab === 'context' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Prompt Context
                </button>
              </div>

              {activeTab === 'context' && (
                <button
                  onClick={handleCopyContext}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedContext ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedContext ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {activeTab === 'matches' ? (
            <div className="space-y-3">
              {result.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white">{m.document_title}</span>
                      <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                        {m.file_type}
                      </span>
                      <span className="text-[10px] text-slate-400">Page {m.page_number}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-400">
                        Score: {(m.score * 100).toFixed(1)}%
                      </span>
                      {m.fused_score && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          (RRF: {m.fused_score.toFixed(4)})
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {result.context_text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
