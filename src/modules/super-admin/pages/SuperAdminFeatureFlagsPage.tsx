import React, { useState, useEffect } from 'react';
import {
  Flag,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Building2,
  Sparkles
} from 'lucide-react';
import { superAdminApi } from '../services/superAdminApi';
import { FeatureFlag } from '../types/superAdmin.types';

export const SuperAdminFeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const loadFlags = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getFeatureFlags();
      setFlags(data);
    } catch (err) {
      console.error('Failed to load feature flags', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleToggle = async (flag: FeatureFlag) => {
    try {
      const updated = await superAdminApi.toggleFeatureFlag(flag.id, !flag.is_enabled);
      setFlags((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    } catch (err) {
      console.error('Failed to toggle feature flag', err);
    }
  };

  const handleCreateFlag = async () => {
    const name = prompt('Enter Feature Flag Name:', 'Autonomous Invoice Scanner');
    if (!name) return;
    const key = name.toUpperCase().replace(/\s+/g, '_');
    const description = prompt('Enter Description:', 'Enables OCR document intelligence on uploads') || '';
    try {
      await superAdminApi.createFeatureFlag({
        name,
        key,
        description,
        is_enabled: true,
      });
      await loadFlags();
    } catch (err) {
      console.error('Failed to create flag', err);
    }
  };

  const handleDeleteFlag = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) return;
    try {
      await superAdminApi.deleteFeatureFlag(id);
      await loadFlags();
    } catch (err) {
      console.error('Failed to delete flag', err);
    }
  };

  const filteredFlags = flags.filter((f) => {
    if (!search) return true;
    return (
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Flag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Feature Flags & Rollout Governance
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {flags.length} Flags
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Dynamically activate modules, beta features, and tenant capabilities without redeploying code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateFlag}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Flag</span>
          </button>

          <button
            onClick={loadFlags}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter feature flags by key, name, or description..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-cyan-400" />
          <p className="text-sm">Loading Feature Flags...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFlags.map((f) => (
            <div
              key={f.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                f.is_enabled
                  ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase">{f.key}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      f.is_enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {f.is_enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{f.name}</h3>
                <p className="text-xs text-slate-400">{f.description || 'Global system toggle flag.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  Scope: {f.tenant_id ? `Tenant #${f.tenant_id}` : 'Global Instance'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      f.is_enabled
                        ? 'bg-red-950/60 text-red-300 hover:bg-red-900'
                        : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
                    }`}
                  >
                    {f.is_enabled ? 'Turn OFF' : 'Turn ON'}
                  </button>

                  <button
                    onClick={() => handleDeleteFlag(f.id)}
                    title="Delete Flag"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
