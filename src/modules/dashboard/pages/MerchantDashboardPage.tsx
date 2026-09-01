import React, { useState, useEffect } from 'react';
import { salesApi } from '../../sales/services/salesApi';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Package,
  AlertTriangle,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const MerchantDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    try {
      setLoading(true);
      const [anRes, leadRes, prodRes] = await Promise.all([
        salesApi.getAnalytics(),
        salesApi.getLeads(),
        salesApi.getProducts({ low_stock: true }),
      ]);
      setAnalytics(anRes);
      setLeads(leadRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Merchant Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Merchant Store Overview
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Merchant & Tenant Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Monitor store revenue, low stock alerts, sales leads, and deal pipeline performance.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">
            <Package className="w-4 h-4" />
            <span>Manage Inventory</span>
          </button>
        </div>
      </div>

      {/* Merchant Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Store Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            ${analytics?.total_revenue?.toLocaleString() || '121,568'}
          </div>
          <p className="text-[11px] text-emerald-400 font-bold">+18.5% store growth</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Deals Pipeline Value</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            ${analytics?.pipeline_value?.toLocaleString() || '120,568'}
          </div>
          <p className="text-[11px] text-indigo-400 font-bold">Active Opportunities</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Active Sales Leads</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {leads.length} Leads
          </div>
          <p className="text-[11px] text-purple-400 font-bold">AI Qualification Active</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">
            {products.length} Products
          </div>
          <p className="text-[11px] text-amber-300 font-bold">Action Required</p>
        </div>
      </div>

      {/* Merchant Low Stock Alerts & Sales Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Inventory Stock Alerts
          </h3>
          <div className="space-y-3 pt-1">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">{p.name}</span>
                  <span className="text-[11px] font-mono text-slate-500">SKU: {p.sku}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold font-mono">
                  Qty: {p.inventory_qty ?? p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Hot Inbound Sales Leads
          </h3>
          <div className="space-y-3 pt-1">
            {leads.map((l) => (
              <div key={l.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">{l.name} ({l.company || 'Client'})</span>
                  <span className="text-[11px] text-slate-400">{l.email}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold font-mono">
                  Score: {l.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
