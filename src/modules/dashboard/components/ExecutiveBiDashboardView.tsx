import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Bot, 
  Database, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Headphones, 
  Layers, 
  FileText,
  AlertTriangle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { biService, ExecutiveInsightsResponse } from '../../../services/biService';
import { InteractiveChart } from '../../bi/components/InteractiveChart';

export const ExecutiveBiDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<ExecutiveInsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quickQuery, setQuickQuery] = useState<string>('');

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const res = await biService.getInsights();
      setInsights(res);
    } catch (err) {
      console.error('Error fetching dashboard insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/sql-analyst?tab=analyst&q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/sql-analyst?tab=analyst');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Executive BI Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/80 p-8 border border-indigo-500/25 shadow-2xl">
        <div className="relative z-10 flex items-start md:items-center justify-between flex-wrap gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Business Intelligence & Performance Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              AURA Executive BI & Analytics Hub
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Real-time multi-tenant data telemetry, live revenue metrics, automated AI trend analysis, and direct natural language query integration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadInsights}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>

            <button
              onClick={() => navigate('/sql-analyst')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Open SQL Analyst AI</span>
            </button>
          </div>
        </div>

        {/* 2. Direct AI Natural Query Bar on Dashboard */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
          <form onSubmit={handleQuickQuerySubmit} className="flex gap-2 max-w-3xl">
            <div className="relative flex-1">
              <Bot className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Ask the AI SQL Analyst... (e.g. 'Show monthly order volume by customer tier')"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl hover:border-slate-700 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</span>
            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              ${insights?.metrics?.total_revenue?.toLocaleString() ?? '148,200'}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
              <span>▲ +24.8%</span>
              <span className="text-slate-500 font-normal">MoM growth</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders & AOV */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl hover:border-slate-700 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Orders</span>
            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              {insights?.metrics?.order_count?.toLocaleString() ?? '1,280'}
            </h3>
            <div className="text-[11px] text-indigo-400 font-semibold mt-1">
              AOV: ${insights?.metrics?.avg_order_value ?? '115.78'}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Base */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl hover:border-slate-700 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Directory</span>
            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              {insights?.metrics?.customer_count?.toLocaleString() ?? '4,890'}
            </h3>
            <div className="text-[11px] text-purple-400 font-semibold mt-1">
              Active VIP Rate: 41.2%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl hover:border-slate-700 transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deals Pipeline</span>
            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              ${insights?.metrics?.pipeline_value?.toLocaleString() ?? '142,500'}
            </h3>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">
              {insights?.metrics?.sales_leads ?? 24} Active Leads
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. AI Strategic Trend Analysis & Growth Recommendations */}
      {insights && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {insights.headline}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                AI Synthesis Engine
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {insights.period}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            {insights.trend_analysis}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Recommendations */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Strategic Growth Recommendations
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {insights.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">➔</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Signals */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risk & Operational Telemetry
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {insights.risk_signals.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive SVG Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monthly Gross Revenue Trajectory
            </span>
            <button
              onClick={() => navigate('/sql-analyst?tab=sandbox')}
              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Query in Sandbox</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <InteractiveChart
            type="bar"
            unit="$"
            height={260}
            color="#6366f1"
            data={[
              { label: 'Jan', value: 18400 },
              { label: 'Feb', value: 21900 },
              { label: 'Mar', value: 25400 },
              { label: 'Apr', value: 23200 },
              { label: 'May', value: 28900 },
              { label: 'Jun', value: 34100 },
              { label: 'Jul', value: 39500 },
              { label: 'Aug', value: 44200 },
            ]}
          />
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer Conversion & Order Volume
            </span>
            <button
              onClick={() => navigate('/sql-analyst?tab=dashboard')}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Trend</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <InteractiveChart
            type="line"
            height={260}
            color="#10b981"
            data={[
              { label: 'W1', value: 140 },
              { label: 'W2', value: 185 },
              { label: 'W3', value: 210 },
              { label: 'W4', value: 260 },
              { label: 'W5', value: 290 },
              { label: 'W6', value: 340 },
              { label: 'W7', value: 390 },
              { label: 'W8', value: 430 },
            ]}
          />
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Support Ticket SLA Breakdown
            </span>
            <button
              onClick={() => navigate('/support')}
              className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View Support Inbox</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <InteractiveChart
            type="pie"
            height={220}
            data={[
              { label: 'Resolved', value: 520, color: '#10b981' },
              { label: 'In Progress', value: 180, color: '#6366f1' },
              { label: 'Waiting Client', value: 95, color: '#f59e0b' },
              { label: 'Escalated', value: 45, color: '#ef4444' },
            ]}
          />
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sales Pipeline Value by Stage
            </span>
            <button
              onClick={() => navigate('/sales?tab=pipeline')}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Open Sales CRM</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <InteractiveChart
            type="bar"
            unit="$"
            height={220}
            color="#8b5cf6"
            data={[
              { label: 'Qualification', value: 38000 },
              { label: 'Proposal', value: 54000 },
              { label: 'Negotiation', value: 42500 },
              { label: 'Closed Won', value: 89000 },
            ]}
          />
        </div>
      </div>

      {/* 6. Direct Quick-Action Links to Full SQL Suite */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        <div 
          onClick={() => navigate('/sql-analyst?tab=analyst')}
          className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Natural AI Analyst</h4>
              <p className="text-[11px] text-slate-400">Ask questions in English</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/sql-analyst?tab=schema')}
          className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Schema Explorer</h4>
              <p className="text-[11px] text-slate-400">17 tables & data types</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/sql-analyst?tab=sandbox')}
          className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Read-Only Sandbox</h4>
              <p className="text-[11px] text-slate-400">AST Security Guard active</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/sql-analyst?tab=reports')}
          className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Reports & Schedules</h4>
              <p className="text-[11px] text-slate-400">Export CSV & recurring digests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
