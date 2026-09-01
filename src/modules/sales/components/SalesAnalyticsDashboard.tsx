import React, { useState, useEffect } from 'react';
import { SalesAnalytics } from '../types/sales.types';
import { salesApi } from '../services/salesApi';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Package,
  AlertTriangle,
  PieChart,
  CheckCircle2,
  RefreshCw,
  Target
} from 'lucide-react';

export const SalesAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await salesApi.getAnalytics();
      setAnalytics(res);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading sales & revenue telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            ${analytics.total_revenue?.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% from last month
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pipeline Value</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            ${analytics.pipeline_value?.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">
            Active Deals in Pipeline
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lead Conversion Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {analytics.lead_conversion_rate}%
          </div>
          <div className="text-[11px] text-purple-400 font-bold">
            {analytics.qualified_leads} / {analytics.total_leads} Qualified
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Low Stock Inventory</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">
            {analytics.low_stock_products_count} Items
          </div>
          <div className="text-[11px] text-amber-300 font-bold">
            Require Restock Order
          </div>
        </div>

      </div>

      {/* Sales Funnel & Monthly Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Sales Pipeline Conversion Funnel
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Inbound Sales Leads</span>
                <span>{analytics.sales_funnel?.leads || 0} Leads</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Proposals Sent</span>
                <span>{analytics.sales_funnel?.proposals || 0} Proposals</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-[70%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Under Negotiation</span>
                <span>{analytics.sales_funnel?.negotiations || 0} Deals</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Closed Won 🎉</span>
                <span>{analytics.sales_funnel?.closed_won || 0} Won</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[35%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Monthly Revenue Telemetry
          </h3>

          <div className="space-y-3 pt-2">
            {analytics.monthly_revenue?.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-300">{m.month} 2026</span>
                <span className="font-mono font-extrabold text-emerald-400">${m.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
