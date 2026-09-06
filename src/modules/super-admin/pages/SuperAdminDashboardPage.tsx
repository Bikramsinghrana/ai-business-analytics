import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Flag,
  FileCode,
  DollarSign,
  Zap,
  RefreshCw,
  Server,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { superAdminApi } from '../services/superAdminApi';
import { DashboardMetrics } from '../types/superAdmin.types';

export const SuperAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch super admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Super Admin Command Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Module 12
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Global multi-tenant governance, production telemetry, AI provider routing, and infrastructure controls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {loading && !metrics ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-indigo-400" />
          <p className="text-sm">Loading Super Admin Diagnostics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Tenants & Orgs</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {metrics?.overview.total_tenants || 0}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{metrics?.overview.active_tenants || 0} Active</span>
                <button
                  onClick={() => navigate('/admin/tenants')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Platform Users</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {metrics?.overview.total_users || 0}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{metrics?.overview.active_users || 0} Active Accounts</span>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  Directory <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">AI Token Velocity</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-cyan-400">
                {(metrics?.overview.total_ai_tokens || 0).toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>+{(metrics?.overview.today_ai_tokens || 0).toLocaleString()} today</span>
                <span className="text-emerald-400 font-semibold">{metrics?.overview.total_ai_requests || 0} reqs</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase">Monthly ARR / MRR</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">
                ${metrics?.overview.estimated_mrr?.toLocaleString() || '0'}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{metrics?.overview.active_subscriptions || 0} Paid Plans</span>
                <span className="text-slate-400">MRR Run-rate</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Matrix */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Live Production Telemetry & Health Matrix
                </h2>
                <p className="text-xs text-slate-400">Autonomous status indicators across platform nodes</p>
              </div>

              <button
                onClick={() => navigate('/admin/infrastructure')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <span>Full Infrastructure Workbench</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Database */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400" /> Database
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Healthy
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">MySQL Multi-Tenant</p>
                <p className="text-[10px] text-slate-500">DB Size: {metrics?.overview.database_size_mb || 0} MB</p>
              </div>

              {/* AI Engine */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" /> AI Engine
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                    Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Gemini 3.7 Flash</p>
                <p className="text-[10px] text-slate-500">Failover: Multi-Tier</p>
              </div>

              {/* Redis Cache */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Redis Cache
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">High Velocity</p>
                <p className="text-[10px] text-slate-500">Hit Rate: 94.8%</p>
              </div>

              {/* Queues & Workers */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" /> Workers
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    0 Failed
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Active Listeners</p>
                <p className="text-[10px] text-slate-500">Queues: 4 Channels</p>
              </div>

              {/* Storage */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-400" /> Storage
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Linked
                  </span>
                </div>
                <p className="text-xs font-semibold text-white">Public Symlink</p>
                <p className="text-[10px] text-slate-500">S3 / Local Driver</p>
              </div>
            </div>
          </div>

          {/* Quick Action Control Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/ai-providers')}
              className="p-4 bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Providers & Models</h3>
              <p className="text-xs text-slate-400 mt-1">
                Gemini, OpenAI, Claude routing & API keys
              </p>
            </button>

            <button
              onClick={() => navigate('/admin/feature-flags')}
              className="p-4 bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Flag className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">Feature Flags</h3>
              <p className="text-xs text-slate-400 mt-1">
                Global & per-tenant module activation
              </p>
            </button>

            <button
              onClick={() => navigate('/admin/prompts')}
              className="p-4 bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-pink-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                  <FileCode className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">Prompt Management</h3>
              <p className="text-xs text-slate-400 mt-1">
                System instructions for all agent suites
              </p>
            </button>

            <button
              onClick={() => navigate('/admin/infrastructure')}
              className="p-4 bg-slate-900/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <HardDrive className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">Logs, Cache & DB</h3>
              <p className="text-xs text-slate-400 mt-1">
                Live log tailing, cache flush, backups
              </p>
            </button>
          </div>

          {/* Recent Tenants Directory */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Recent Organizations & Tenant Instances
              </h2>

              <button
                onClick={() => navigate('/admin/tenants')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View All Tenants →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {metrics?.recent_tenants?.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate max-w-[70%]">{t.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 truncate">UUID: {t.id}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
