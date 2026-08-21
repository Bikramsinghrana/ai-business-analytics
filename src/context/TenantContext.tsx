import React, { createContext, useContext, useEffect, useState } from 'react';
import { tenantApi, Tenant, CreateTenantPayload } from '../modules/tenants/api/tenantApi';
import { useAuth } from './AuthContext';

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  createTenant: (payload: CreateTenantPayload) => Promise<Tenant>;
  refetchTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadTenants();
    } else {
      setCurrentTenant(null);
      setTenants([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const [tenantsRes, currentRes]: any[] = await Promise.allSettled([
        tenantApi.getTenants(),
        tenantApi.getCurrentTenant(),
      ]);

      const tenantsList = tenantsRes.status === 'fulfilled'
        ? (tenantsRes.value.data?.tenants || tenantsRes.value.tenants || [])
        : [];

      const activeTenant = currentRes.status === 'fulfilled'
        ? (currentRes.value.data?.tenant || currentRes.value.tenant || tenantsList[0] || null)
        : tenantsList[0] || null;

      setTenants(tenantsList);
      if (activeTenant) {
        setCurrentTenant(activeTenant);
        localStorage.setItem('aura_active_tenant_id', activeTenant.id);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    const res: any = await tenantApi.switchTenant(tenantId);
    const switched = res.data?.tenant || res.tenant;
    if (switched) {
      setCurrentTenant(switched);
      localStorage.setItem('aura_active_tenant_id', switched.id);
      // Reload page state / queries dynamically
      window.location.reload();
    }
  };

  const createTenant = async (payload: CreateTenantPayload): Promise<Tenant> => {
    const res: any = await tenantApi.createTenant(payload);
    const created = res.data?.tenant || res.tenant;
    await loadTenants();
    return created;
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        loading,
        switchTenant,
        createTenant,
        refetchTenants: loadTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
