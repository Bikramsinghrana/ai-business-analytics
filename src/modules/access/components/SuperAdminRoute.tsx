import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-12 bg-slate-900/80 border border-purple-500/20 rounded-2xl">
        <ShieldCheck className="w-12 h-12 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Super Admin Access Only</h2>
        <p className="text-sm text-slate-400">
          This governance dashboard is restricted to global platform Super Administrators.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
