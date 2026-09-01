import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SalesPipelineKanban } from '../components/SalesPipelineKanban';
import { ProductInventoryManager } from '../components/ProductInventoryManager';
import { AISalesAssistantStudio } from '../components/AISalesAssistantStudio';
import { SalesAnalyticsDashboard } from '../components/SalesAnalyticsDashboard';
import {
  TrendingUp,
  Package,
  Bot,
  Briefcase,
  PieChart,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SalesEcommercePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'pipeline';
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'pipeline', label: 'Sales Leads & CRM', icon: Briefcase },
    { id: 'catalog', label: 'Products & Inventory', icon: Package },
    { id: 'ai-sales', label: 'AI Sales Studio', icon: Bot },
    { id: 'analytics', label: 'Revenue Analytics', icon: PieChart },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                04. Sales & E-Commerce Suite
              </h1>
              <p className="text-xs text-slate-400">
                Manage CRM pipeline, product catalog stock, AI recommendation engines, and revenue metrics
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      {activeTab === 'pipeline' && <SalesPipelineKanban />}
      {activeTab === 'catalog' && <ProductInventoryManager />}
      {activeTab === 'ai-sales' && <AISalesAssistantStudio />}
      {activeTab === 'analytics' && <SalesAnalyticsDashboard />}

    </div>
  );
};
