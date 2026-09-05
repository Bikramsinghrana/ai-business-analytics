import React, { useState } from 'react';
import { Sparkles, Play, BookmarkPlus, ArrowRight, HelpCircle, CheckCircle2, Zap } from 'lucide-react';
import { NaturalQueryResponse } from '../../../services/biService';

interface NaturalQueryBarProps {
  isLoading: boolean;
  onGenerate: (query: string) => void;
  result: NaturalQueryResponse | null;
  onExecute: (sql: string, naturalQuery?: string) => void;
  onSaveReportModal: (sql: string, naturalQuery?: string, chartType?: string) => void;
}

export const NaturalQueryBar: React.FC<NaturalQueryBarProps> = ({
  isLoading,
  onGenerate,
  result,
  onExecute,
  onSaveReportModal,
}) => {
  const [prompt, setPrompt] = useState('');

  const quickPrompts = [
    'Show monthly gross revenue breakdown for this year',
    'List top 5 VIP customers with highest lifetime spend',
    'Which products have stock below 30 units?',
    'Count support tickets grouped by priority and status',
    'Summarize sales opportunities by deal stage and value',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  const handleSelectQuickPrompt = (p: string) => {
    setPrompt(p);
    onGenerate(p);
  };

  return (
    <div className="space-y-4">
      {/* Natural Language Input Card */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/50 rounded-2xl border border-indigo-500/30 p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Natural Language AI SQL Analyst
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            AI Powered
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything in English... (e.g. 'What are our top 10 selling products this month?')"
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-indigo-200" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate SQL</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-indigo-400" /> Try asking:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuickPrompt(qp)}
              className="text-[11px] bg-slate-800/70 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 px-2.5 py-1 rounded-lg border border-slate-700/60 hover:border-indigo-500/50 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Result Preview */}
      {result && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Generated Query & Business Analysis
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                Recommended: {result.chart_type.toUpperCase()} CHART
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSaveReportModal(result.sql, result.natural_query, result.chart_type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Save Report</span>
              </button>

              <button
                onClick={() => onExecute(result.sql, result.natural_query)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Query</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* SQL Block */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl p-3.5 border border-slate-800/80 font-mono text-xs text-indigo-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{result.sql}</pre>
            </div>

            {/* AI Explanation */}
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Business Logic
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
              </div>

              {result.suggested_followups?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Follow-up Questions:
                  </span>
                  <div className="space-y-1">
                    {result.suggested_followups.slice(0, 2).map((fu, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectQuickPrompt(fu)}
                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 truncate text-left w-full"
                      >
                        <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">{fu}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
