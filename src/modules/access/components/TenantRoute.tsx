import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTenant } from '../../../context/TenantContext';
import { Loader2 } from 'lucide-react';

export const TenantRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { currentTenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Resolving active tenant...</span>
      </div>
    );
  }

  if (!currentTenant) {
    return <Navigate to="/tenants/select" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
