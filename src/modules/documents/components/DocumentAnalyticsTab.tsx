import React, { useEffect, useState } from 'react';
import { DocumentAnalyticsStats, DocumentAuditLogItem } from '../types/document.types';
import { 
  BarChart3, 
  Database, 
  Layers, 
  HardDrive, 
  Search, 
  MessageSquare, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { documentApi } from '../api/documentApi';

export const DocumentAnalyticsTab: React.FC = () => {
  const [stats, setStats] = useState<DocumentAnalyticsStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [statsData, logsData] = await Promise.all([
        documentApi.getStats(),
        documentApi.getAuditLogs({ per_page: 20 }),
      ]);
      setStats(statsData);
      setAuditLogs(logsData?.data || logsData || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Vector Chunks</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.total_chunks?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">
            Across {stats?.total_documents || 0} documents ({stats?.total_words?.toLocaleString() || 0} words)
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Embedded Tokens</span>
            <Database className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.total_tokens_embedded?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">
            Google text-embedding-004 vectors
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Search & Chat Queries</span>
            <Search className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {(stats?.total_searches || 0) + (stats?.total_chats || 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            {stats?.total_searches || 0} RAG Searches • {stats?.total_chats || 0} AI Chats
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Storage Footprint</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {((stats?.total_file_size_bytes || 0) / 1024 / 1024).toFixed(2)} MB
          </div>
          <p className="text-[11px] text-slate-500">Tenant-isolated storage disk</p>
        </div>
      </div>

      {/* Audit Logs & Processing Status */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Knowledge Base Ingestion & Query Audit Trail
          </h4>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Refresh Audit Logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            Loading audit records...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No audit logs recorded yet. Upload documents or perform searches to see real-time logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Query / Message</th>
                  <th className="py-3 px-4">Tokens</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {log.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans max-w-sm truncate">
                      {log.query || log.message || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.tokens_used}</td>
                    <td className="py-3 px-4 text-slate-400">{log.latency_ms}ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-red-400 bg-red-500/10 border border-red-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-sans">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
