import React from 'react';
import { History, Play, Trash2, Clock, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { QueryHistoryItem } from '../../../services/biService';

interface QueryHistoryTabProps {
  history: QueryHistoryItem[];
  isLoading: boolean;
  onClearHistory: () => void;
  onLoadInSandbox: (sql: string) => void;
}

export const QueryHistoryTab: React.FC<QueryHistoryTabProps> = ({
  history,
  isLoading,
  onClearHistory,
  onLoadInSandbox,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Analytics Query Audit History</h3>
            <p className="text-xs text-slate-400">Execution performance, benchmark timings, and query audit trail</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs">
          No queries recorded in history yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
          {history.map((item) => {
            const isSuccess = item.status === 'success';

            return (
              <div
                key={item.id}
                className="p-4 flex items-start justify-between gap-4 hover:bg-slate-850/50 transition-colors group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Natural Query if available */}
                  {item.natural_query && (
                    <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{item.natural_query}</span>
                    </div>
                  )}

                  {/* SQL Statement */}
                  <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-900 overflow-x-auto">
                    {item.sql_query}
                  </div>

                  {/* Error message if any */}
                  {!isSuccess && item.error_message && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{item.error_message}</span>
                    </div>
                  )}

                  {/* Metadata line */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      {isSuccess ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <span className={isSuccess ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {item.status.toUpperCase()}
                      </span>
                    </span>

                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span
                        className={
                          item.execution_time_ms < 50
                            ? 'text-emerald-400'
                            : item.execution_time_ms < 200
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }
                      >
                        {item.execution_time_ms} ms
                      </span>
                    </span>

                    <span className="flex items-center gap-1 font-mono">
                      <Layers className="w-3 h-3 text-slate-500" />
                      {item.row_count} rows
                    </span>

                    <span>{new Date(item.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-1">
                  <button
                    onClick={() => onLoadInSandbox(item.sql_query)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 hover:border-indigo-500 shadow-sm transition-all"
                    title="Load query in SQL Sandbox"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Load</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
