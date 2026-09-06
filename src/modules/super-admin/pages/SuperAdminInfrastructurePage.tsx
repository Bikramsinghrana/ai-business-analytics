import React, { useState, useEffect } from 'react';
import {
  Server,
  Zap,
  HardDrive,
  FileText,
  Database,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  Search
} from 'lucide-react';
import { superAdminApi } from '../services/superAdminApi';
import {
  SystemInfo,
  CacheStats,
  QueueStats,
  DatabaseStats,
  LogsResponse
} from '../types/superAdmin.types';

export const SuperAdminInfrastructurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'cache' | 'queues' | 'logs' | 'database'>('system');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Data states
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [logsData, setLogsData] = useState<LogsResponse | null>(null);
  const [logFilter, setLogFilter] = useState<string>('');
  const [logLevel, setLogLevel] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sysRes, cacheRes, queueRes, dbRes, logsRes] = await Promise.allSettled([
        superAdminApi.getSystemInfo(),
        superAdminApi.getCacheStats(),
        superAdminApi.getQueueStats(),
        superAdminApi.getDatabaseStats(),
        superAdminApi.getLogs(100, logLevel || undefined),
      ]);

      if (sysRes.status === 'fulfilled') setSystemInfo(sysRes.value);
      if (cacheRes.status === 'fulfilled') setCacheStats(cacheRes.value);
      if (queueRes.status === 'fulfilled') setQueueStats(queueRes.value);
      if (dbRes.status === 'fulfilled') setDbStats(dbRes.value);
      if (logsRes.status === 'fulfilled') setLogsData(logsRes.value);
    } catch (err) {
      console.error('Failed to load infrastructure telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [logLevel]);

  // Actions
  const handleFlushCache = async () => {
    if (!confirm('Are you sure you want to flush application & configuration cache?')) return;
    setActionLoading(true);
    try {
      const res = await superAdminApi.flushCache();
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('Cache flush failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOptimizeDatabase = async () => {
    setActionLoading(true);
    try {
      const res = await superAdminApi.optimizeDatabase();
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('DB optimize failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerBackup = async () => {
    setActionLoading(true);
    try {
      const res = await superAdminApi.triggerBackup();
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('Backup trigger failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear the laravel.log file?')) return;
    setActionLoading(true);
    try {
      const res = await superAdminApi.clearLogs();
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('Clear logs failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryJob = async (id: string | number) => {
    try {
      const res = await superAdminApi.retryQueueJob(id);
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('Failed to retry job', err);
    }
  };

  const handlePurgeJobs = async () => {
    if (!confirm('Are you sure you want to purge all failed queue jobs?')) return;
    try {
      const res = await superAdminApi.purgeQueueJobs();
      alert(res.message);
      await loadData();
    } catch (err) {
      console.error('Failed to purge jobs', err);
    }
  };

  const filteredLogs = (logsData?.entries || []).filter((e) => {
    if (!logFilter) return true;
    return (
      e.message.toLowerCase().includes(logFilter.toLowerCase()) ||
      e.level.toLowerCase().includes(logFilter.toLowerCase()) ||
      e.timestamp.includes(logFilter)
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Production Infrastructure Workbench
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Node
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Real-time server metrics, Redis caching, worker queues, log streaming, and database maintenance.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'system' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Environment</span>
          </button>

          <button
            onClick={() => setActiveTab('cache')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cache' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Redis Cache</span>
          </button>

          <button
            onClick={() => setActiveTab('queues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'queues' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Queues</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logs' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Logs & Errors</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'database' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database & Backups</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
          <p className="text-sm">Querying infrastructure nodes...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SYSTEM ENVIRONMENT */}
          {activeTab === 'system' && systemInfo && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Runtime Stack & PHP Engine
                  </h2>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">PHP Version</span>
                      <span className="font-mono font-bold text-white">{systemInfo.php_version}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Laravel Framework</span>
                      <span className="font-mono font-bold text-emerald-400">v{systemInfo.laravel_version}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Operating System</span>
                      <span className="font-mono text-slate-300">{systemInfo.os}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Server Software</span>
                      <span className="font-mono text-slate-300">{systemInfo.server_software}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Environment Mode</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                        {systemInfo.environment}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Resource & Memory Allocations
                  </h2>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Memory Limit</span>
                      <span className="font-mono font-bold text-white">{systemInfo.memory_limit}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Max Execution Time</span>
                      <span className="font-mono text-slate-300">{systemInfo.max_execution_time}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Upload Max File Size</span>
                      <span className="font-mono text-cyan-400 font-bold">{systemInfo.upload_max_filesize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Post Max Size</span>
                      <span className="font-mono text-slate-300">{systemInfo.post_max_size}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Storage Driver</span>
                      <span className="font-mono font-bold text-purple-400 uppercase">{systemInfo.storage_disk}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REDIS & CACHE */}
          {activeTab === 'cache' && cacheStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Cache Driver</p>
                  <p className="text-xl font-bold text-amber-400 mt-1 uppercase">{cacheStats.driver}</p>
                  <p className="text-[10px] text-slate-500">Prefix: {cacheStats.prefix}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Hit Rate</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{cacheStats.hit_rate_percentage}%</p>
                  <p className="text-[10px] text-slate-500">Optimized lookups</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Total Hits</p>
                  <p className="text-xl font-bold text-white mt-1">{cacheStats.total_hits.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Misses: {cacheStats.total_misses}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Memory Footprint</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">{cacheStats.estimated_memory_mb} MB</p>
                  <p className="text-[10px] text-slate-500">Volatile state</p>
                </div>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Flush Application & Config Cache</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Purges Redis keys, compiled route definitions, and configuration cache immediately.
                  </p>
                </div>

                <button
                  onClick={handleFlushCache}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Flush All Cache</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QUEUES & WORKERS */}
          {activeTab === 'queues' && queueStats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Queue Driver</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1 uppercase">{queueStats.driver}</p>
                  <p className="text-[10px] text-slate-500">{queueStats.workers_active} Active Worker Threads</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Jobs Processed (24h)</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{queueStats.total_processed_24h}</p>
                  <p className="text-[10px] text-slate-500">Autonomous executions</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Failed Jobs</p>
                  <p className={`text-xl font-bold mt-1 ${queueStats.failed_jobs_count > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                    {queueStats.failed_jobs_count}
                  </p>
                  <p className="text-[10px] text-slate-500">Exception state</p>
                </div>
              </div>

              {/* Failed Jobs Table */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Failed Jobs Queue ({queueStats.failed_jobs_count})
                  </h3>
                  {queueStats.failed_jobs_count > 0 && (
                    <button
                      onClick={handlePurgeJobs}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge All</span>
                    </button>
                  )}
                </div>

                {queueStats.failed_jobs?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Queue</th>
                          <th className="p-3">Failed At</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {queueStats.failed_jobs.map((j) => (
                          <tr key={j.id} className="hover:bg-slate-800/40">
                            <td className="p-3 text-white font-bold">{j.id}</td>
                            <td className="p-3 text-cyan-400">{j.queue}</td>
                            <td className="p-3 text-slate-400">{j.failed_at}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRetryJob(j.id)}
                                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-[11px] font-semibold"
                              >
                                Retry Job
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-xl">
                    No failed queue jobs detected. Queue processing is 100% healthy.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE LOGS & ERROR TRACKING */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    placeholder="Search logs by keyword, exception, or timestamp..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="">All Levels</option>
                    <option value="ERROR">ERROR only</option>
                    <option value="INFO">INFO only</option>
                    <option value="WARNING">WARNING only</option>
                  </select>

                  <button
                    onClick={handleClearLogs}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Log File</span>
                  </button>
                </div>
              </div>

              {/* Log Stream Viewer */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-2 max-h-[600px] overflow-y-auto">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        entry.level === 'ERROR'
                          ? 'bg-red-950/20 border-red-900/40 text-red-200'
                          : entry.level === 'WARNING'
                          ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-400">{entry.timestamp}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                            entry.level === 'ERROR'
                              ? 'bg-red-500/20 text-red-300'
                              : entry.level === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {entry.level}
                        </span>
                      </div>
                      <pre className="whitespace-pre-wrap break-words">{entry.message}</pre>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-12 font-sans">No matching log entries found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE & BACKUPS */}
          {activeTab === 'database' && dbStats && (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Database Schema</p>
                  <p className="text-xl font-bold text-indigo-400 mt-1">{dbStats.database_name}</p>
                  <p className="text-[10px] text-slate-500">{dbStats.table_count} Migrated Tables</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Total Storage Size</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{dbStats.total_size_mb} MB</p>
                  <p className="text-[10px] text-slate-500">{dbStats.total_rows.toLocaleString()} indexed records</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Maintenance</p>
                    <p className="text-xs text-slate-300 mt-1">Run index defragmentation</p>
                  </div>
                  <button
                    onClick={handleOptimizeDatabase}
                    disabled={actionLoading}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Optimize Tables
                  </button>
                </div>
              </div>

              {/* Backups Card */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Database Snapshots & Backups
                  </h3>

                  <button
                    onClick={handleTriggerBackup}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Create Snapshot Now</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dbStats.recent_backups?.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-white">{b.file_name}</span>
                        <p className="text-[10px] text-slate-500">{new Date(b.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">{Math.round(b.size_bytes / 1024)} KB</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tables Breakdown */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Database Tables by Storage
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Table Name</th>
                        <th className="p-3">Rows</th>
                        <th className="p-3">Data MB</th>
                        <th className="p-3">Index MB</th>
                        <th className="p-3">Total MB</th>
                        <th className="p-3">Engine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {dbStats.tables?.slice(0, 12).map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 text-cyan-400 font-bold">{t.name}</td>
                          <td className="p-3 text-slate-200">{Number(t.rows).toLocaleString()}</td>
                          <td className="p-3 text-slate-400">{t.data_mb}</td>
                          <td className="p-3 text-slate-400">{t.index_mb}</td>
                          <td className="p-3 text-emerald-400 font-bold">{t.size_mb} MB</td>
                          <td className="p-3 text-slate-500 uppercase">{t.engine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
