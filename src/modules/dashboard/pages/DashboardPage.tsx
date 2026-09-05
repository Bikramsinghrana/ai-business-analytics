import React, { useState } from 'react';
import { CustomerDashboardPage } from './CustomerDashboardPage';
import { MerchantDashboardPage } from './MerchantDashboardPage';
import { ExecutiveBiDashboardView } from '../components/ExecutiveBiDashboardView';
import { ShieldCheck, Store, User } from 'lucide-react';

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
            <span>👑 Super Admin HQ (BI & KPIs)</span>
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
      {activeRole === 'ADMIN' && <ExecutiveBiDashboardView />}

    </div>
  );
};
