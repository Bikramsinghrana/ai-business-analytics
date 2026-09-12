import React, { useState } from 'react';
import { Database, Table, Key, Search, ChevronRight, ChevronDown, PlusCircle, RefreshCw } from 'lucide-react';
import { TableSchema } from '../../../services/biService';

interface SchemaExplorerProps {
  schema: TableSchema[];
  isLoading: boolean;
  onRefresh: () => void;
  onInsertText: (text: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  schema,
  isLoading,
  onRefresh,
  onInsertText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    orders: true,
    products: true,
    customers: true,
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const filteredSchema = schema.filter(
    (t) =>
      t.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Database Schema Browser</h3>
            <p className="text-xs text-slate-400">{schema.length} accessible database tables</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Schema"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="my-3 relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter tables or columns..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {isLoading && schema.length === 0 ? (
          <div className="space-y-2 py-1 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 bg-slate-800/30 rounded-xl border border-slate-800/60 flex items-center px-3 gap-2"
              >
                <div className="w-3.5 h-3.5 rounded bg-slate-700/50" />
                <div className="h-3 w-24 rounded bg-slate-700/50" />
                <div className="h-2.5 w-12 rounded bg-slate-800 ml-auto" />
              </div>
            ))}
          </div>
        ) : filteredSchema.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            {searchTerm ? `No tables or columns matching "${searchTerm}"` : 'No database tables available'}
          </div>
        ) : (
          filteredSchema.map((tbl) => {
            const isExpanded = expandedTables[tbl.table];

            return (
              <div key={tbl.table} className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
              {/* Table Header */}
              <div
                onClick={() => toggleTable(tbl.table)}
                className="flex items-center justify-between px-3 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  )}
                  <Table className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-white truncate">{tbl.table}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({tbl.row_count} rows)</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertText(`SELECT * FROM ${tbl.table} LIMIT 20;`);
                  }}
                  title={`Insert SELECT for ${tbl.table}`}
                  className="text-slate-500 hover:text-indigo-400 p-1 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Columns Details */}
              {isExpanded && (
                <div className="px-3 py-2 space-y-1.5 bg-slate-950/80 border-t border-slate-800/50">
                  {tbl.description && (
                    <p className="text-[11px] text-slate-400 italic mb-2 leading-tight">{tbl.description}</p>
                  )}

                  {tbl.columns.map((col) => (
                    <div
                      key={col.name}
                      onClick={() => onInsertText(col.name)}
                      className="flex items-center justify-between text-[11px] py-1 px-1.5 rounded hover:bg-slate-800/50 cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {col.is_primary ? (
                          <span title="Primary Key">
                            <Key className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          </span>
                        ) : col.is_foreign ? (
                          <span className="text-[9px] font-bold px-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            FK
                          </span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 ml-1 mr-0.5" />
                        )}
                        <span className="font-mono text-slate-300 group-hover:text-indigo-300 truncate">
                          {col.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-slate-500">{col.type}</span>
                        {col.is_nullable && (
                          <span className="text-[9px] text-slate-600 font-mono">null</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
