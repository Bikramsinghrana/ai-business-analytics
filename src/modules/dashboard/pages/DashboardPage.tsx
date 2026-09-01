import React, { useState } from 'react';
import { CustomerDashboardPage } from './CustomerDashboardPage';
import { MerchantDashboardPage } from './MerchantDashboardPage';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Sparkles, TrendingUp, Users, ShoppingBag, ArrowUpRight, Package, ShieldCheck, Store, User } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'MERCHANT' | 'CUSTOMER'>('ADMIN');

  return (
    <div className="space-y-6">
      
      {/* Role Switcher Toolbar */}
      <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-extrabold text-white">Role Dashboard Switcher:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'ADMIN' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>👑 Super Admin HQ</span>
          </button>

          <button
            onClick={() => setActiveRole('MERCHANT')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'MERCHANT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🏪 Merchant View</span>
          </button>

          <button
            onClick={() => setActiveRole('CUSTOMER')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'CUSTOMER' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👤 Customer Portal</span>
          </button>
        </div>
      </div>

      {/* Dynamic Dashboard View */}
      {activeRole === 'CUSTOMER' && <CustomerDashboardPage />}
      {activeRole === 'MERCHANT' && <MerchantDashboardPage />}

      {activeRole === 'ADMIN' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-8 border border-indigo-500/20 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Super Admin Multi-Tenant Control Center</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Global Platform Executive Control
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Full administrative access across all 10 platform modules, tenant provisioning, AI providers, sales CRM pipelines, and document intelligence.
              </p>
            </div>
          </div>

          <MerchantDashboardPage />
        </div>
      )}

    </div>
  );
};
