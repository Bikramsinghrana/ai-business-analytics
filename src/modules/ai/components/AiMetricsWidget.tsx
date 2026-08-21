import React, { useEffect, useState } from 'react';
import { aiApi } from '../api/aiApi';
import { AiUsageStats } from '../types/ai.types';
import { Activity, Zap, DollarSign } from 'lucide-react';

export const AiMetricsWidget: React.FC = () => {
  const [stats, setStats] = useState<AiUsageStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await aiApi.getUsage();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  if (!stats) return null;

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono">
      <div className="flex items-center gap-1 text-indigo-400">
        <Zap className="w-3 h-3" />
        <span>{stats.total_tokens.toLocaleString()} tokens</span>
      </div>
      <span className="text-slate-700">•</span>
      <div className="flex items-center gap-1 text-emerald-400">
        <DollarSign className="w-3 h-3" />
        <span>${stats.total_cost.toFixed(4)}</span>
      </div>
      <span className="text-slate-700">•</span>
      <div className="flex items-center gap-1 text-slate-400">
        <Activity className="w-3 h-3" />
        <span>{stats.total_requests} runs</span>
      </div>
    </div>
  );
};
