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
  DollarSign,
  Search,
  BrainCircuit,
  BarChart3
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
  const isCustomerOrClient = userRole === UserRole.CUSTOMER || userRole === UserRole.CLIENT;
  const isDeveloper = userRole === UserRole.DEVELOPER;
  const isStaff = userRole === UserRole.STAFF;
  const isManager = userRole === UserRole.MANAGER;
  const isTenantOwner = userRole === UserRole.TENANT_OWNER;

  // Role & Permission based module visibility
  const canSeeM1 = isSuperAdmin || isTenantOwner || isManager || isCustomerOrClient;
  const canSeeM2 = isSuperAdmin || isTenantOwner || isManager || isStaff || isDeveloper;
  const canSeeM3 = isSuperAdmin || isTenantOwner || isManager || isStaff || isCustomerOrClient;
  const canSeeM4 = isSuperAdmin || isTenantOwner || isManager;
  const canSeeM5 = isSuperAdmin || isTenantOwner || isManager || isStaff || isCustomerOrClient;
  const canSeeM6 = isSuperAdmin || isTenantOwner || isManager || isDeveloper;
  const canSeeM7 = isSuperAdmin || isTenantOwner || isDeveloper;
  const canSeeM8 = isSuperAdmin || isTenantOwner;
  const canSeeM9 = isSuperAdmin;

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
  const [openM7, setOpenM7] = useState<boolean>(location.pathname.startsWith('/sql-analyst') || location.pathname.startsWith('/analytics') || location.search.includes('mode=dev'));
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
        {canSeeM1 && (
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
        )}

        {/* MODULE 02: AI Intelligence */}
        {canSeeM2 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM2(!openM2)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                02. AI Intelligence
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM2 ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {openM2 && (
              <div className="pl-2 space-y-1 border-l-2 border-purple-500/30 ml-3">
                {features[FeatureKey.AI_CHAT] !== false && (
                  <NavLink
                    to="/ai-chat"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Assistant Studio</span>
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 03: E-Commerce */}
        {canSeeM3 && (
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
                  <span>Product Catalog</span>
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

                {!isCustomerOrClient && (
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
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 04: Sales & E-Commerce Suite */}
        {canSeeM4 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM4(!openM4)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                04. Sales & E-Commerce Suite
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM4 ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {openM4 && (
              <div className="pl-2 space-y-1 border-l-2 border-amber-500/30 ml-3">
                {features[FeatureKey.SALES_AGENT] !== false && (
                  <>
                    <NavLink
                      to="/sales?tab=pipeline"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && (!location.search || location.search.includes('tab=pipeline'))
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sales Leads & CRM</span>
                    </NavLink>

                    <NavLink
                      to="/sales?tab=catalog"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && location.search.includes('tab=catalog')
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>Products & Inventory</span>
                    </NavLink>

                    <NavLink
                      to="/sales?tab=ai-sales"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && location.search.includes('tab=ai-sales')
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI Sales Studio</span>
                    </NavLink>

                    <NavLink
                      to="/sales?tab=analytics"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && location.search.includes('tab=analytics')
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Revenue Analytics</span>
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 05: Customer Support Agent */}
        {canSeeM5 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM5(!openM5)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-purple-400" />
                05. Customer Support Agent
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM5 ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {openM5 && (
              <div className="pl-2 space-y-1 border-l-2 border-purple-500/30 ml-3">
                {features[FeatureKey.SUPPORT_AGENT] !== false && (
                  <>
                    <NavLink
                      to="/support"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && (!location.search || !location.search.includes('tab=') || location.search.includes('tab=inbox'))
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Headphones className="w-3.5 h-3.5 text-purple-400" />
                      <span>Support Inbox & Tickets</span>
                    </NavLink>

                    {!isCustomerOrClient && (
                      <NavLink
                        to="/support?tab=customers"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isActive && location.search.includes('tab=customers')
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`
                        }
                      >
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Customer 360 & Orders</span>
                      </NavLink>
                    )}

                    <NavLink
                      to="/support?tab=faqs"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && location.search.includes('tab=faqs')
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>FAQs & Knowledge Base</span>
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 06: RAG & Document Intelligence */}
        {canSeeM6 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM6(!openM6)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                06. RAG & Document Intelligence
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM6 ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {openM6 && (
              <div className="pl-2 space-y-1 border-l-2 border-cyan-500/30 ml-3">
                {features[FeatureKey.RAG_DOCUMENTS] !== false && (
                  <NavLink
                    to="/documents?tab=library"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Knowledge Base & Files</span>
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 07: Business Intelligence & SQL Agent */}
        {canSeeM7 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM7(!openM7)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                07. 📊 BI & SQL Agent
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM7 ? 'rotate-180 text-violet-400' : ''}`} />
            </button>

            {openM7 && (
              <div className="pl-2 space-y-1 border-l-2 border-violet-500/30 ml-3">
                <NavLink
                  to="/sql-analyst?tab=analyst"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && (!location.search || location.search.includes('tab=analyst'))
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Bot className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI SQL Analyst</span>
                </NavLink>

                <NavLink
                  to="/sql-analyst?tab=schema"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=schema')
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Database className="w-3.5 h-3.5 text-violet-400" />
                  <span>Schema Explorer</span>
                </NavLink>

                <NavLink
                  to="/sql-analyst?tab=sandbox"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=sandbox')
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Read-Only Sandbox</span>
                </NavLink>

                <NavLink
                  to="/sql-analyst?tab=dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=dashboard')
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>BI Dashboards & KPIs</span>
                </NavLink>

                <NavLink
                  to="/sql-analyst?tab=reports"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=reports')
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reports & Schedules</span>
                </NavLink>

                <NavLink
                  to="/sql-analyst?tab=history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=history')
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Query Audit History</span>
                </NavLink>

                <NavLink
                  to="/ai-chat?mode=dev"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Developer & Supervisor</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 08: Management */}
        {canSeeM8 && (
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
                {isSuperAdmin && (
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
                )}
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
                {isSuperAdmin && (
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
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 09: System Settings */}
        {canSeeM9 && (
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
                  <span>Super Admin Control Center</span>
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
                  <span>AWS & AI Provider Keys</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

      </div>
    </aside>
  );
};
