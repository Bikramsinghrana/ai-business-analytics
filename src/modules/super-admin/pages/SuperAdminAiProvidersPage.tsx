import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Settings,
  RefreshCw,
  Key,
  Layers,
  Sparkles
} from 'lucide-react';
import { superAdminApi } from '../services/superAdminApi';
import { AiProvider } from '../types/superAdmin.types';

export const SuperAdminAiProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingId, setTestingId] = useState<number | null>(null);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getAiProviders();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load AI providers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleTestProvider = async (id: number) => {
    setTestingId(id);
    try {
      const res = await superAdminApi.testAiProviderConnection(id);
      alert(res.message);
      await loadProviders();
    } catch (err) {
      console.error('Provider test failed', err);
      alert('Failed to connect to AI Provider API.');
    } finally {
      setTestingId(null);
    }
  };

  const handleToggleActive = async (provider: AiProvider) => {
    try {
      await superAdminApi.updateAiProvider(provider.id, {
        is_active: !provider.is_active,
      });
      await loadProviders();
    } catch (err) {
      console.error('Failed to update provider status', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Provider & Model Governance
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Multi-LLM
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage LLM routing, API key secrets, failover chains, and dynamic model allocations across tenants.
            </p>
          </div>
        </div>

        <button
          onClick={loadProviders}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Refresh Providers</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-purple-400" />
          <p className="text-sm">Loading AI Model Providers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div
              key={p.id}
              className={`bg-slate-900/60 p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                p.is_active ? 'border-purple-500/40 shadow-lg shadow-purple-500/5' : 'border-slate-800 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 font-bold uppercase text-xs">
                      {p.provider_name}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Priority #{p.priority}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.health_status === 'healthy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {p.health_status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{p.display_name}</h3>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-1">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{p.api_key_masked || 'System Environment Key'}</span>
                  </p>
                </div>

                {/* Models List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Configured Models</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.models?.map((m: any, idx: number) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-medium ${
                          m.id === p.default_model
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-slate-950 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {m.name || m.id} {m.id === p.default_model && '★'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Telemetry info */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400">
                  <div className="p-2 bg-slate-950 rounded-lg">
                    <span className="text-slate-500 block">Rate Limit:</span>
                    <span className="text-white font-bold">{p.rate_limit_rpm} RPM</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg">
                    <span className="text-slate-500 block">Temperature:</span>
                    <span className="text-white font-bold">{p.settings?.temperature || 0.7}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleActive(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    p.is_active
                      ? 'bg-red-950 text-red-300 hover:bg-red-900'
                      : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {p.is_active ? 'Disable' : 'Enable'}
                </button>

                <button
                  onClick={() => handleTestProvider(p.id)}
                  disabled={testingId === p.id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 ${testingId === p.id ? 'animate-spin' : ''}`} />
                  <span>{testingId === p.id ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
