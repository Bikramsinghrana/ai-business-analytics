import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  ShoppingCart, 
  Headphones, 
  TrendingUp, 
  Bot, 
  ShieldCheck, 
  Settings,
  Sparkles,
  Database,
  FileText
} from 'lucide-react';
import { UserRole, FeatureKey } from '../../types/enums';

interface SidebarProps {
  userRole?: UserRole;
  features?: Record<string, boolean>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userRole = UserRole.SUPER_ADMIN,
  features = {
    [FeatureKey.AI_CHAT]: true,
    [FeatureKey.SQL_ANALYST]: true,
    [FeatureKey.RAG_DOCUMENTS]: true,
    [FeatureKey.SUPPORT_AGENT]: true,
    [FeatureKey.SALES_AGENT]: true,
  }
}) => {
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;

  const superAdminNav = [
    { label: 'Super Admin HQ', path: '/admin', icon: ShieldCheck },
    { label: 'Tenants Overview', path: '/admin/tenants', icon: Building2 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const tenantNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/ai-chat', icon: Sparkles, feature: FeatureKey.AI_CHAT },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'Customer Support', path: '/support', icon: Headphones, feature: FeatureKey.SUPPORT_AGENT },
    { label: 'Sales & Leads', path: '/sales', icon: TrendingUp, feature: FeatureKey.SALES_AGENT },
    { label: 'Knowledge Base', path: '/documents', icon: FileText, feature: FeatureKey.RAG_DOCUMENTS },
    { label: 'SQL Analyst', path: '/sql-analyst', icon: Database, feature: FeatureKey.SQL_ANALYST },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">AURA</h1>
          <p className="text-xs text-indigo-400 font-medium">AI SaaS Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {isSuperAdmin && (
          <div>
            <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Super Admin Control
            </div>
            <nav className="space-y-1">
              {superAdminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        <div>
          <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Tenant Management
          </div>
          <nav className="space-y-1">
            {tenantNav
              .filter((item) => !item.feature || features[item.feature] !== false)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
          </nav>
        </div>
      </div>

      {/* Footer User Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-400">
            {isSuperAdmin ? 'SA' : 'TO'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {isSuperAdmin ? 'Super Admin' : 'Tenant Owner'}
            </p>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
