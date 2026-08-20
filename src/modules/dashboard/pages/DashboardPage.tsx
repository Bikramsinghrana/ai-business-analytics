import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Sparkles, TrendingUp, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AURA Multi-Agent Platform Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tenant Automation Control Center
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Monitor real-time AI sales pipelines, customer support automation, database insights, and document RAG memory.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">$128,450</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% from last month</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Active Customers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,420</div>
          <div className="flex items-center gap-1 text-xs text-indigo-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.4% growth</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Orders Processed</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">890</div>
          <Badge variant="success">99.4% Automated</Badge>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">AI Token Usage</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.2M</div>
          <Badge variant="purple">Gemini 1.5 Pro</Badge>
        </Card>
      </div>
    </div>
  );
};
