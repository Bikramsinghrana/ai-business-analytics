import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface PermissionRouteProps {
  permission: string;
  children: React.ReactNode;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-12 bg-slate-900/80 border border-red-500/20 rounded-2xl">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-bold text-white">403 Forbidden</h2>
        <p className="text-sm text-slate-400">
          You do not have the required permission (<code className="text-red-300 font-mono">{permission}</code>) to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
