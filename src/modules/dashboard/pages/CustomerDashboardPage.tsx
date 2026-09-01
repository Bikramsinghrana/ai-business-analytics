import React, { useState, useEffect } from 'react';
import { salesApi } from '../../sales/services/salesApi';
import { supportApi } from '../../support/services/supportApi';
import {
  ShoppingBag,
  Package,
  Bot,
  Sparkles,
  Clock,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const [prodRes, tickRes] = await Promise.all([
        salesApi.getProducts(),
        supportApi.getTickets(),
      ]);
      setProducts(prodRes.data || []);
      setTickets(tickRes.data || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 rounded-3xl border border-purple-500/20 shadow-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Customer Portal Dashboard
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Welcome back, Valued Customer! 👋</h2>
          <p className="text-xs text-purple-200">Track your order purchases, view AI product recommendations, or get instant support.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30">
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </button>
        </div>
      </div>

      {/* Customer Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Recent Purchases</span>
            <Package className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">3 Orders</div>
          <p className="text-[11px] text-emerald-400 font-bold">1 Order in Transit (Tracking Live)</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Support Tickets</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{tickets.length} Tickets</div>
          <p className="text-[11px] text-purple-300 font-bold">AURA AI Agent active on your queries</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Personalized Offers</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">15% OFF</div>
          <p className="text-[11px] text-amber-300 font-bold">Code: WELCOME10 available</p>
        </div>

      </div>

      {/* Customer Order Tracking & Recommended Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Recommended Products for You
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-indigo-500/50 transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-400">${p.price}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
                <button className="w-full py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition-all">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            Your Open Support Tickets
          </h3>

          <div className="space-y-3 pt-2">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{t.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
