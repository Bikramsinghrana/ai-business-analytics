import React, { useState, useEffect } from 'react';
import { SupportAnalytics } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Smile,
  Frown,
  Flame,
  ShieldCheck,
  Loader2,
  PieChart,
  BarChart3
} from 'lucide-react';

export const SupportAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<SupportAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await supportApi.getAnalytics();
      setAnalytics(res);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        <span>Calculating Support Telemetry & SLA Metrics...</span>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Key Performance Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* SLA Compliance */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>SLA Target Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{analytics.sla_compliance_rate}%</span>
            <span className="text-[11px] text-slate-400">Target: 95%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics.sla_compliance_rate}%` }} />
          </div>
        </div>

        {/* First Response Time */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Avg First Response (FRT)</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{analytics.avg_first_response_minutes} min</span>
            <span className="text-[11px] text-emerald-400 font-bold">⚡ Fast</span>
          </div>
          <p className="text-[11px] text-slate-400">AI auto-agent handles 72% under 30s</p>
        </div>

        {/* Resolution Rate */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Ticket Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-400">{analytics.resolution_rate}%</span>
            <span className="text-[11px] text-slate-400">{analytics.resolved_tickets} / {analytics.total_tickets}</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analytics.resolution_rate}%` }} />
          </div>
        </div>

        {/* Escalated Tickets */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Human Handoffs</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">{analytics.escalated_tickets}</span>
            <span className="text-[11px] text-slate-400">Escalated to Staff</span>
          </div>
          <p className="text-[11px] text-slate-400">Complex issues routed to human team</p>
        </div>

      </div>

      {/* Sentiment & Category Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sentiment Analysis Breakdown */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-pink-400" />
            <h4 className="text-sm font-bold text-white">Customer Sentiment Breakdown</h4>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>😊 Positive / Satisfied</span>
                <span className="font-bold text-emerald-400">{analytics.sentiment_breakdown.Positive || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(analytics.sentiment_breakdown.Positive / (analytics.total_tickets || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>😐 Neutral / Informational</span>
                <span className="font-bold text-blue-400">{analytics.sentiment_breakdown.Neutral || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(analytics.sentiment_breakdown.Neutral / (analytics.total_tickets || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>😡 Frustrated / Sensitive</span>
                <span className="font-bold text-pink-400">{analytics.sentiment_breakdown.Frustrated || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(analytics.sentiment_breakdown.Frustrated / (analytics.total_tickets || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>🚨 Urgent / Critical</span>
                <span className="font-bold text-red-400">{analytics.sentiment_breakdown.Urgent || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(analytics.sentiment_breakdown.Urgent / (analytics.total_tickets || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Metrics */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Tickets Volume by Category</h4>
          </div>

          <div className="space-y-3">
            {Object.entries(analytics.categories).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>{cat}</span>
                  <span className="font-bold text-indigo-400">{count}</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(count / (analytics.total_tickets || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
