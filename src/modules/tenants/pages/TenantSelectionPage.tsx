import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Building2, Check, ArrowRight, Plus, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../../types/enums';

export const TenantSelectionPage: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant, tenants, switchTenant, createTenant } = useTenant();
  const [newTenantName, setNewTenantName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const isOwnerOrAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.TENANT_OWNER;

  const handleSelect = async (tenantId: string) => {
    await switchTenant(tenantId);
    navigate('/dashboard');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    setCreating(true);
    try {
      const tenant = await createTenant({ name: newTenantName, plan: 'Standard' });
      await switchTenant(tenant.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create tenant:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Active Business Tenant</h1>
          <p className="text-sm text-slate-400">Organization Environment & Workspace Management</p>
        </div>

        {/* Info Banner for non-owners/admins */}
        {!isOwnerOrAdmin && (
          <Card className="p-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>You are connected to your active company workspace. Tenant creation and switching are reserved for Tenant Owners and Super Admins.</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ml-3"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map((t) => (
            <Card
              key={t.id}
              onClick={() => isOwnerOrAdmin && handleSelect(t.id)}
              className={`p-6 border transition flex flex-col justify-between space-y-4 ${
                isOwnerOrAdmin ? 'cursor-pointer hover:border-indigo-500' : 'cursor-default'
              } ${
                t.id === currentTenant?.id
                  ? 'border-indigo-500 bg-indigo-950/20'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                {t.id === currentTenant?.id && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                    <Check className="w-3 h-3" /> Active Workspace
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{t.name}</h3>
                <p className="text-xs text-slate-400">Status: <span className="text-emerald-400 font-semibold">{t.status || 'ACTIVE'}</span> | Plan: {t.plan}</p>
              </div>

              {isOwnerOrAdmin && (
                <div className="flex items-center justify-end text-xs font-semibold text-indigo-400 gap-1">
                  <span>Switch Environment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Create Tenant Card (Super Admin and Tenant Owner Only) */}
        {isOwnerOrAdmin && (
          <Card className="p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Create New Business Tenant
            </h3>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input
                type="text"
                required
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="e.g. Nexus AI Labs"
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition"
              >
                {creating ? 'Creating...' : 'Create Tenant'}
              </button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
