import React, { useState } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { Building2, Check, ChevronDown, Plus, Loader2 } from 'lucide-react';

export const TenantSwitcher: React.FC = () => {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSelect = async (tenantId: string) => {
    if (tenantId === currentTenant?.id) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    try {
      await switchTenant(tenantId);
    } catch (err) {
      console.error('Tenant switch failed:', err);
    } finally {
      setSwitching(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition"
      >
        <Building2 className="w-4 h-4 text-indigo-400" />
        <span>{switching ? 'Switching...' : (currentTenant?.name || 'Select Tenant')}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-1 divide-y divide-slate-800/80">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Available Tenants ({tenants.length})
          </div>

          <div className="py-1 max-h-48 overflow-y-auto">
            {tenants.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{t.plan} Plan</div>
                </div>
                {t.id === currentTenant?.id && (
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
