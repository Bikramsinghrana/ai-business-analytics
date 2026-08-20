import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShieldCheck, Building2, Cpu, HardDrive, Activity } from 'lucide-react';
import { TenantStatus } from '../../../types/enums';

export const SuperAdminDashboardPage: React.FC = () => {
  const tenants = [
    { id: '1', name: 'Acme Corp', status: TenantStatus.ACTIVE, plan: 'Enterprise', users: 48, aiTokens: '1.2M' },
    { id: '2', name: 'Starlight Retail', status: TenantStatus.ACTIVE, plan: 'Pro', users: 14, aiTokens: '450K' },
    { id: '3', name: 'Nexus Logistics', status: TenantStatus.SUSPENDED, plan: 'Standard', users: 8, aiTokens: '0' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Super Admin Governance Dashboard
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
          <div className="text-2xl font-bold text-white">42 Tenants</div>
          <p className="text-xs text-slate-400">38 Active, 4 Suspended</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">AI Engine</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">Gemini 1.5 Pro</div>
          <p className="text-xs text-emerald-400">Dynamic Failover Ready</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Storage Backend</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">AWS S3</div>
          <p className="text-xs text-slate-400">Condition: Production</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Horizon Workers</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">12 Queues</div>
          <p className="text-xs text-emerald-400">0 Failed Jobs</p>
        </Card>
      </div>

      {/* Tenant Governance Table */}
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
                    <Badge variant={t.status === TenantStatus.ACTIVE ? 'success' : 'danger'}>
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
