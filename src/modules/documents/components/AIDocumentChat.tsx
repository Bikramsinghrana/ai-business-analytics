import React, { useState } from 'react';
import { KnowledgeDocument, DocumentCitation } from '../types/document.types';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  FileText, 
  Layers, 
  ChevronRight, 
  Loader2, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ragApi } from '../api/ragApi';

interface Props {
  documents: KnowledgeDocument[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: DocumentCitation[];
  latencyMs?: number;
  tokensUsed?: number;
  confidenceScore?: number;
}

export const AIDocumentChat: React.FC<Props> = ({ documents }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your AI Document Intelligence Assistant. Ask any question and I will search across your indexed documents with exact citations.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<DocumentCitation | null>(null);

  const toggleDocSelection = (id: string) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter((d) => d !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputQuery,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputQuery;
    setInputQuery('');
    setLoading(true);

    try {
      const res = await ragApi.chat({
        question: currentQuery,
        document_ids: selectedDocIds.length > 0 ? selectedDocIds : undefined,
        top_k: 4,
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.answer,
        citations: res.citations,
        latencyMs: res.latency_ms,
        tokensUsed: res.tokens_used,
        confidenceScore: res.confidence_score,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Sorry, I encountered an error while searching the document vector index. Please check your backend connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
      {/* Left / Top Document Filter Palette */}
      <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 overflow-hidden">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Knowledge Context Scope
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Select specific documents to ground answers, or leave unselected to search everything.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          <div
            onClick={() => setSelectedDocIds([])}
            className={`p-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
              selectedDocIds.length === 0
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span>All Indexed Documents</span>
            <span className="text-[10px] bg-slate-950/40 px-1.5 py-0.5 rounded">{documents.length}</span>
          </div>

          {documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleDocSelection(doc.id)}
                className={`p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-semibold'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                  <span className="truncate">{doc.title}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>{doc.category}</span>
                  <span>{doc.chunk_count} chunks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                Multi-Document RAG Agent
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded Verification
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {selectedDocIds.length > 0
                  ? `Grounded in ${selectedDocIds.length} selected document(s)`
                  : `Grounded in entire knowledge base (${documents.length} documents)`}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800/80 shadow-md'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Citations Footer */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Grounded Source Citations ({msg.citations.length})
                      </span>
                      {msg.latencyMs && (
                        <span className="text-[10px] text-slate-500">
                          {msg.latencyMs}ms • {msg.tokensUsed} tokens
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCitation(c)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-lg text-[11px] flex items-center gap-1.5 transition-all shadow-sm group"
                        >
                          <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                            {c.source_index}
                          </span>
                          <span className="truncate max-w-[140px]">{c.document_title}</span>
                          <span className="text-[9px] text-slate-500">p.{c.page_number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Scanning vector embeddings & synthesizing answer...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question about contracts, reports, policies, or operations..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>

      {/* Citation Preview Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                  #{activeCitation.source_index}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{activeCitation.document_title}</h4>
                  <p className="text-[11px] text-slate-400">
                    Page {activeCitation.page_number} • Chunk #{activeCitation.chunk_index + 1} • Similarity Score: {(activeCitation.similarity_score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              {activeCitation.snippet}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
