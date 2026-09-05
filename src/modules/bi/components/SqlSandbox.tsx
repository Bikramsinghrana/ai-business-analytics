import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Layers, 
  HelpCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SqlExecutionResponse, SqlExplanationResponse } from '../../../services/biService';

interface SqlSandboxProps {
  sql: string;
  setSql: (sql: string) => void;
  isLoading: boolean;
  onExecute: (sql: string) => void;
  onExplain: (sql: string) => void;
  result: SqlExecutionResponse | null;
  explanation: SqlExplanationResponse | null;
  onExportCsv: (sql: string) => void;
  onSaveReportModal: (sql: string) => void;
}

export const SqlSandbox: React.FC<SqlSandboxProps> = ({
  sql,
  setSql,
  isLoading,
  onExecute,
  onExplain,
  result,
  explanation,
  onExportCsv,
  onSaveReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Real-time client-side security check
  const forbiddenRegex = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|REPLACE|CREATE|GRANT|REVOKE)\b/i;
  const hasSecurityViolation = forbiddenRegex.test(sql);

  // Keyboard shortcut Ctrl+Enter to execute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (sql.trim() && !hasSecurityViolation) {
          onExecute(sql);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sql, hasSecurityViolation, onExecute]);

  // Filter rows
  const filteredRows = result?.rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* SQL Editor Card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              SQL Query Sandbox
            </span>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Strict Read-Only Guard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExplain(sql)}
              disabled={isLoading || !sql.trim() || hasSecurityViolation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Explain & Optimize</span>
            </button>

            <button
              onClick={() => onSaveReportModal(sql)}
              disabled={!sql.trim() || hasSecurityViolation}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
            >
              Save Query
            </button>

            <button
              onClick={() => onExecute(sql)}
              disabled={isLoading || !sql.trim() || hasSecurityViolation}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        {/* Security Warning Alert */}
        {hasSecurityViolation && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>
              Security Rejection: Mutating or destructive keywords (INSERT, UPDATE, DELETE, DROP, etc.) are strictly forbidden. Only SELECT or EXPLAIN queries are allowed.
            </span>
          </div>
        )}

        {/* Text Area Code Editor */}
        <div className="relative">
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={5}
            placeholder="SELECT * FROM orders WHERE total_amount > 100 ORDER BY created_at DESC LIMIT 20;"
            className="w-full bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-indigo-300 leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Queries are auto-capped at LIMIT 500 for safety.</span>
          <span>Multi-tenant data isolation active</span>
        </div>
      </div>

      {/* AI Explanation Card */}
      {explanation && (
        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-5 space-y-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Query Analysis & Optimization
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
              Complexity: {explanation.complexity}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{explanation.explanation}</p>

          {explanation.optimization_tips?.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Optimization Suggestions:</span>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5">
                {explanation.optimization_tips.map((tip, idx) => (
                  <li key={idx} className="text-slate-300">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Execution Results Grid */}
      {result && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl animate-fadeIn">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Query Executed</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {result.execution_time_ms} ms
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {result.row_count} rows
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search in results */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search rows..."
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Export CSV */}
              <button
                onClick={() => onExportCsv(sql)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {result.rows.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              0 rows returned by this query.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto max-h-96 custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950/80 sticky top-0 z-10 border-b border-slate-800">
                    <tr>
                      {result.columns.map((col) => (
                        <th
                          key={col}
                          className="px-3.5 py-2.5 font-bold text-slate-300 uppercase tracking-wider font-mono text-[11px] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                    {paginatedRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                        {result.columns.map((col) => {
                          const val = row[col];
                          const displayVal =
                            typeof val === 'object' && val !== null
                              ? JSON.stringify(val)
                              : String(val ?? '');

                          return (
                            <td
                              key={col}
                              className="px-3.5 py-2 text-slate-300 font-mono text-[11px] whitespace-nowrap max-w-xs truncate"
                              title={displayVal}
                            >
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
                  <span>
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} results
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-white font-semibold">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
