import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  FileText,
  ChevronDown,
  Users,
  Store,
  MessageSquare
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
  const location = useLocation();

  // Collapsible dropdown states
  const [openGov, setOpenGov] = useState<boolean>(location.pathname.startsWith('/admin'));
  const [openEcom, setOpenEcom] = useState<boolean>(
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/customers')
  );
  const [openCrm, setOpenCrm] = useState<boolean>(
    location.pathname.startsWith('/sales') ||
    location.pathname.startsWith('/support')
  );
  const [openAi, setOpenAi] = useState<boolean>(true);

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">AURA</h1>
          <p className="text-xs text-indigo-400 font-medium">AI SaaS Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-4 custom-scrollbar">
        
        {/* Executive Dashboard Quick Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          <span>Executive Dashboard</span>
        </NavLink>

        {/* MODULE 01: Auth & Multi-Tenant Governance */}
        {isSuperAdmin && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenGov(!openGov)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                01. Auth & Multi-Tenant
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openGov ? 'rotate-180 text-indigo-400' : ''}`} />
            </button>

            {openGov && (
              <div className="pl-2 space-y-1 border-l-2 border-slate-800 ml-3">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Super Admin HQ</span>
                </NavLink>

                <NavLink
                  to="/admin/tenants"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>Companies / Tenants</span>
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Users & Roles (RBAC)</span>
                </NavLink>

                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>System & AI Settings</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 02: E-Commerce & Retail Operations (SEPARATED) */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenEcom(!openEcom)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              02. E-Commerce & Retail
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openEcom ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>

          {openEcom && (
            <div className="pl-2 space-y-1 border-l-2 border-slate-800 ml-3">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Products & Stock</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Orders & Fulfillment</span>
              </NavLink>

              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Customer Directory</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* MODULE 03: CRM, Sales & Support */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenCrm(!openCrm)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              03. CRM & Support
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openCrm ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          {openCrm && (
            <div className="pl-2 space-y-1 border-l-2 border-slate-800 ml-3">
              {features[FeatureKey.SALES_AGENT] !== false && (
                <NavLink
                  to="/sales"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Sales & CRM Leads</span>
                </NavLink>
              )}

              {features[FeatureKey.SUPPORT_AGENT] !== false && (
                <NavLink
                  to="/support"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>Customer Support</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 04: AI Intelligence Hub */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenAi(!openAi)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              04. AI Intelligence Hub
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openAi ? 'rotate-180 text-pink-400' : ''}`} />
          </button>

          {openAi && (
            <div className="pl-2 space-y-1 border-l-2 border-slate-800 ml-3">
              {features[FeatureKey.AI_CHAT] !== false && (
                <NavLink
                  to="/ai-chat"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>AI Assistant Hub</span>
                </NavLink>
              )}

              {features[FeatureKey.RAG_DOCUMENTS] !== false && (
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <FileText className="w-4 h-4" />
                  <span>Knowledge Base (RAG)</span>
                </NavLink>
              )}

              {features[FeatureKey.SQL_ANALYST] !== false && (
                <NavLink
                  to="/sql-analyst"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Database className="w-4 h-4" />
                  <span>SQL Analyst AI</span>
                </NavLink>
              )}
            </div>
          )}
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
