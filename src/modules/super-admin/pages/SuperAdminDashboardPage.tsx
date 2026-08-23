import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, Building2, Cpu, HardDrive, Activity, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

export const SuperAdminDashboardPage: React.FC = () => {
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/config');
      setSystemConfig(res.data?.data || res.data || null);
    } catch (err) {
      console.error('Failed to fetch backend configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  const tenants = [
    { id: '1', name: 'AURA Technologies Inc.', status: 'ACTIVE', plan: 'Enterprise', users: 5, aiTokens: '1.2M' },
    { id: '2', name: 'Acme Global Corporation', status: 'ACTIVE', plan: 'Standard', users: 2, aiTokens: '450K' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Super Admin Management Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global multi-tenant system controls, environment configuration & AI model management
          </p>
        </div>
        <Badge variant="purple">Global Override Mode</Badge>
      </div>

      {/* Global System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Tenants</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">2 Active Tenants</div>
          <p className="text-xs text-slate-400">AURA Tech & Acme Corp</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">AI Engine</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : (systemConfig?.ai?.defaultProvider || 'GEMINI 1.5 PRO')}
          </div>
          <p className="text-xs text-emerald-400">Dynamic Failover Ready</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Storage Backend</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : (systemConfig?.storage?.driver?.toUpperCase() || 'LOCAL')}
          </div>
          <p className="text-xs text-slate-400">Environment: {systemConfig?.app?.environment || 'local'}</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Laravel Backend API</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">v1.0.0 Connected</div>
          <p className="text-xs text-emerald-400">0 Failed Jobs</p>
        </Card>
      </div>

      {/* Tenant Directory */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-white">Active Tenants Directory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Tenant Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Users</th>
                <th className="p-3">AI Consumption</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{t.name}</td>
                  <td className="p-3">
                    <Badge variant={t.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-3">{t.plan}</td>
                  <td className="p-3">{t.users} users</td>
                  <td className="p-3 text-indigo-400 font-medium">{t.aiTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
