import React, { useState } from 'react';
import { Send, Loader2, Sparkles, Cpu } from 'lucide-react';
import { AIProvider } from '../../../types/enums';
import { AI_PROVIDER_MODELS } from '../constants/aiConstants';

interface ChatInputAreaProps {
  onSend: (message: string, provider: AIProvider) => void;
  loading: boolean;
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

const QUICK_PROMPTS = [
  '📦 Show all low stock inventory items',
  '💰 Summarize total sales & gross revenue',
  '🎫 Are there any open support tickets?',
  '🎯 What is our active CRM lead pipeline value?',
];

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSend,
  loading,
  provider,
  onProviderChange,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim(), provider);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    // Remove icon emoji for clean execution
    const cleanPrompt = prompt.replace(/^[\p{Emoji}\s]+/u, '');
    onSend(cleanPrompt, provider);
  };

  return (
    <div className="p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 space-y-3">
      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Suggested:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loading}
            onClick={() => handleQuickPrompt(qp)}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-slate-700/60 text-[11px] text-slate-300 hover:text-indigo-300 transition whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar with Provider Selector */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Provider Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl flex-shrink-0">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as AIProvider)}
            className="bg-transparent text-xs text-indigo-300 font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {Object.entries(AI_PROVIDER_MODELS).map(([key, label]) => (
              <option key={key} value={key} className="bg-slate-900 text-slate-200">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about sales, inventory, CRM deals, or automation tasks..."
            disabled={loading}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner disabled:opacity-60"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};
