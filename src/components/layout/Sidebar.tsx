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
  Lock,
  Cpu,
  Layers,
  Store,
  DollarSign
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
  const [openM1, setOpenM1] = useState<boolean>(location.pathname === '/dashboard' || location.pathname.startsWith('/sql-analyst'));
  const [openM2, setOpenM2] = useState<boolean>(location.pathname.startsWith('/ai-chat'));
  const [openM3, setOpenM3] = useState<boolean>(
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/customers')
  );
  const [openM4, setOpenM4] = useState<boolean>(location.pathname.startsWith('/sales'));
  const [openM5, setOpenM5] = useState<boolean>(location.pathname.startsWith('/support'));
  const [openM6, setOpenM6] = useState<boolean>(location.pathname.startsWith('/documents'));
  const [openM7, setOpenM7] = useState<boolean>(location.search.includes('mode=dev'));
  const [openM8, setOpenM8] = useState<boolean>(location.pathname.startsWith('/admin/tenants') || location.pathname.startsWith('/admin/users'));
  const [openM9, setOpenM9] = useState<boolean>(location.pathname === '/admin' || location.pathname.startsWith('/admin/settings'));

  return (
    <aside className="w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">AURA AI</h1>
          <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Enterprise Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
        
        {/* MODULE 01: Executive BI */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM1(!openM1)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              01. Executive BI
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM1 ? 'rotate-180 text-indigo-400' : ''}`} />
          </button>

          {openM1 && (
            <div className="pl-2 space-y-1 border-l-2 border-indigo-500/30 ml-3">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Dashboard</span>
              </NavLink>

              {features[FeatureKey.SQL_ANALYST] !== false && (
                <NavLink
                  to="/sql-analyst"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SQL Analyst AI</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 02: AI Intelligence (UNIFIED AI ASSISTANT + SEARCH + TOOLS) */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM2(!openM2)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              02. AI Intelligence
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM2 ? 'rotate-180 text-pink-400' : ''}`} />
          </button>

          {openM2 && (
            <div className="pl-2 space-y-1 border-l-2 border-pink-500/30 ml-3">
              {features[FeatureKey.AI_CHAT] !== false && (
                <NavLink
                  to="/ai-chat"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Bot className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Assistant Hub</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 03: E-Commerce */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM3(!openM3)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              03. E-Commerce
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM3 ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>

          {openM3 && (
            <div className="pl-2 space-y-1 border-l-2 border-emerald-500/30 ml-3">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Products & Stock</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Orders & Fulfillment</span>
              </NavLink>

              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Directory</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* MODULE 04: Sales & CRM */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM4(!openM4)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              04. Sales & CRM
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM4 ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          {openM4 && (
            <div className="pl-2 space-y-1 border-l-2 border-amber-500/30 ml-3">
              {features[FeatureKey.SALES_AGENT] !== false && (
                <NavLink
                  to="/sales"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>CRM & Sales Leads</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 05: Support Desk */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM5(!openM5)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-blue-400" />
              05. Support Desk
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM5 ? 'rotate-180 text-blue-400' : ''}`} />
          </button>

          {openM5 && (
            <div className="pl-2 space-y-1 border-l-2 border-blue-500/30 ml-3">
              {features[FeatureKey.SUPPORT_AGENT] !== false && (
                <NavLink
                  to="/support"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Headphones className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tickets & Support Agent</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 06: Knowledge RAG */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM6(!openM6)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              06. Knowledge RAG
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM6 ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          {openM6 && (
            <div className="pl-2 space-y-1 border-l-2 border-cyan-500/30 ml-3">
              {features[FeatureKey.RAG_DOCUMENTS] !== false && (
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Knowledge Base (RAG)</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* MODULE 07: Agent Studio */}
        <div className="space-y-1">
          <button
            onClick={() => setOpenM7(!openM7)}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              07. Agent Studio
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM7 ? 'rotate-180 text-violet-400' : ''}`} />
          </button>

          {openM7 && (
            <div className="pl-2 space-y-1 border-l-2 border-violet-500/30 ml-3">
              <NavLink
                to="/ai-chat?mode=dev"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Developer & Supervisor</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* MODULE 08: Management */}
        {isSuperAdmin && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM8(!openM8)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                08. Management
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM8 ? 'rotate-180 text-slate-300' : ''}`} />
            </button>

            {openM8 && (
              <div className="pl-2 space-y-1 border-l-2 border-slate-700 ml-3">
                <NavLink
                  to="/admin/tenants"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Companies / Tenants</span>
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Users Directory</span>
                </NavLink>
                <NavLink
                  to="/admin/roles"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Roles & Permissions (RBAC)</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 09: System Settings */}
        {isSuperAdmin && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM9(!openM9)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-red-400" />
                09. System Settings
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM9 ? 'rotate-180 text-red-400' : ''}`} />
            </button>

            {openM9 && (
              <div className="pl-2 space-y-1 border-l-2 border-red-500/30 ml-3">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>Super Admin HQ</span>
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Settings className="w-3.5 h-3.5 text-red-400" />
                  <span>AWS, Redis & AI Models</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

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
