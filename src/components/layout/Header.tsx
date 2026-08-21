import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { TenantSwitcher } from '../../modules/tenants/components/TenantSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI capabilities, orders, customers..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Tenant Switcher Component */}
        <TenantSwitcher />

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User Account / Profile */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-800/40 rounded-lg transition-colors"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Authenticated User'}</div>
            <div className="text-[10px] text-slate-400 font-mono">{user?.email || 'user@gmail.com'}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
