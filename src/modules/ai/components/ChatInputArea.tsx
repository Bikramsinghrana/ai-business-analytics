import React, { useState } from 'react';
import { Send, Loader2, Globe, MessageSquare, ShoppingBag, Newspaper, FolderGit2, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { SearchType } from '../types/ai.types';
import { SEARCH_TYPE_PLACEHOLDERS } from '../constants/aiConstants';

interface ChatInputAreaProps {
  onSend: (message: string, provider: AIProvider, searchType: SearchType) => void;
  loading: boolean;
  provider: AIProvider;
  searchType: SearchType;
  onSearchTypeChange: (type: SearchType) => void;
}

const QUICK_DOMAINS = [
  { type: SearchType.WEB, label: 'Live Web Search', icon: Globe },
  { type: SearchType.GENERAL, label: 'General AI', icon: MessageSquare },
  { type: SearchType.ECOMMERCE, label: 'E-commerce', icon: ShoppingBag },
  { type: SearchType.NEWS, label: 'News', icon: Newspaper },
  { type: SearchType.PROJECT, label: 'Project', icon: FolderGit2 },
  { type: SearchType.SPORTS, label: 'Sports', icon: Trophy },
  { type: SearchType.FINANCE, label: 'Stocks', icon: TrendingUp },
];

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSend,
  loading,
  provider,
  searchType,
  onSearchTypeChange,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim(), provider, searchType);
    setInput('');
  };

  const placeholderText =
    SEARCH_TYPE_PLACEHOLDERS[searchType] || 'Ask any question...';

  return (
    <div className="p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 space-y-2.5">
      {/* 1-Click Search Mode Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mr-1">
          Active Mode:
        </span>
        {QUICK_DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isActive = searchType === domain.type;
          return (
            <button
              key={domain.type}
              type="button"
              disabled={loading}
              onClick={() => onSearchTypeChange(domain.type)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400 font-bold'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition shadow-inner disabled:opacity-60 font-medium"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
