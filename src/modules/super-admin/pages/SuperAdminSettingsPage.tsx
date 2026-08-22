import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Settings, Cpu, HardDrive, ShieldCheck, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

export const SuperAdminSettingsPage: React.FC = () => {
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
      console.error('Failed to fetch system config:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-indigo-400" />
            Global System & AI Engine Configuration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Super Admin settings for AI model routing, dynamic failover, storage drivers & backend status
          </p>
        </div>
        <Button variant="outline" onClick={fetchConfig} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* AI Model Chain Card */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-lg font-bold text-white">AI Engine Routing & Failover Chain</h2>
              <p className="text-xs text-slate-400">Configured models & automated fallback sequence</p>
            </div>
          </div>
          <Badge variant="purple">Active Multi-Tier Strategy</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold uppercase">
              Primary Model
            </div>
            <div className="text-lg font-bold text-white">gemini-3.7-flash</div>
            <p className="text-xs text-slate-400">High speed, real-time web synthesis & table formatting</p>
            <div className="flex items-center gap-1 text-xs text-emerald-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              Fallback Chain (1-4)
            </div>
            <div className="text-sm font-semibold text-slate-200">
              gemini-3.6 ➔ gemini-3.5 ➔ gemini-2.0 ➔ gemini-1.5
            </div>
            <p className="text-xs text-slate-400">Automatic rate-limit failover (429 handling)</p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
              Standalone Backup
            </div>
            <div className="text-lg font-bold text-white">AURA Intelligent Engine</div>
            <p className="text-xs text-slate-400">Direct Google News RSS parser with zero downtime</p>
          </div>
        </div>
      </Card>

      {/* Backend Infrastructure */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Backend Infrastructure & Security</h2>
              <p className="text-xs text-slate-400">Environment variables & passport authentication</p>
            </div>
          </div>
          <Badge variant="success">Operational</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Environment</span>
              <span className="font-semibold text-white uppercase">{systemConfig?.app?.environment || 'local'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Storage Driver</span>
              <span className="font-semibold text-white uppercase">{systemConfig?.storage?.driver || 'local'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Database Driver</span>
              <span className="font-semibold text-white uppercase">MySQL Multi-Tenant</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">OAuth2 Security</span>
              <span className="font-semibold text-emerald-400">Laravel Passport</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Tenant Isolation Scope</span>
              <span className="font-semibold text-indigo-400">TenantScope Active</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">API Version</span>
              <span className="font-semibold text-white">v1.0.0</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
