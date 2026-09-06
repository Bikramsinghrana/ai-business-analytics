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
  Store, 
  BarChart3,
  Briefcase,
  Code2,
  Layers,
  TestTube,
  Zap,
  Globe,
  CreditCard,
  Workflow,
  Image as ImageIcon,
  Menu as MenuIcon,
  Bell,
  Server,
  Sliders,
  Flag,
  MessageSquareCode
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
  const location = useLocation();

  // Role checks
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isTenantOwner = userRole === UserRole.TENANT_OWNER;
  const isManager = userRole === UserRole.MANAGER;
  const isStaff = userRole === UserRole.STAFF;
  const isDeveloper = userRole === UserRole.DEVELOPER || (userRole as any) === 'DEVELOPER';
  const isCustomerOrClient = userRole === UserRole.CUSTOMER || (userRole as any) === 'CLIENT';

  const canSeeM1 = true;
  const canSeeM2 = true;
  const canSeeM3 = isSuperAdmin || isTenantOwner || isManager || isStaff;
  const canSeeM4 = isSuperAdmin || isTenantOwner || isManager || isStaff || isCustomerOrClient;
  const canSeeM5 = isSuperAdmin || isTenantOwner || isManager || isStaff || isCustomerOrClient;
  const canSeeM6 = isSuperAdmin || isTenantOwner || isManager || isStaff;
  const canSeeM7 = isSuperAdmin || isTenantOwner || isManager;
  const canSeeMultiAgent = isSuperAdmin || isTenantOwner || isManager || isStaff;
  const canSeeAutomation = isSuperAdmin || isTenantOwner || isManager || isStaff;
  const canSeeCms = isSuperAdmin || isTenantOwner || isManager || isStaff;
  const canSeeBilling = isSuperAdmin || isTenantOwner || isManager;
  const canSeeSuperAdmin = isSuperAdmin || isTenantOwner;

  // Collapsible dropdown states
  const [openM1, setOpenM1] = useState<boolean>(location.pathname === '/dashboard');
  const [openM2, setOpenM2] = useState<boolean>(location.pathname.startsWith('/ai-chat'));
  const [openM3, setOpenM3] = useState<boolean>(location.pathname.startsWith('/sales'));
  const [openM4, setOpenM4] = useState<boolean>(
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/customers')
  );
  const [openM5, setOpenM5] = useState<boolean>(location.pathname.startsWith('/support'));
  const [openM6, setOpenM6] = useState<boolean>(location.pathname.startsWith('/documents'));
  const [openM7, setOpenM7] = useState<boolean>(location.pathname.startsWith('/sql-analyst') || location.pathname.startsWith('/analytics') || location.pathname.startsWith('/bi'));
  const [openMultiAgent, setOpenMultiAgent] = useState<boolean>(location.pathname.startsWith('/multi-agent') || location.pathname.startsWith('/developer-agent'));
  const [openAutomation, setOpenAutomation] = useState<boolean>(location.pathname.startsWith('/automation'));
  const [openCms, setOpenCms] = useState<boolean>(location.pathname.startsWith('/cms'));
  const [openBilling, setOpenBilling] = useState<boolean>(location.pathname.startsWith('/billing') || location.pathname.startsWith('/subscription') || location.pathname.startsWith('/saas'));
  const [openSuperAdmin, setOpenSuperAdmin] = useState<boolean>(location.pathname.startsWith('/admin'));

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
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5 custom-scrollbar">
        
        {/* MODULE 01: Executive Dashboard */}
        {canSeeM1 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM1(!openM1)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                01. Dashboard
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
                  <span>Executive Overview</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 02: AI Assistant & Copilot */}
        {canSeeM2 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM2(!openM2)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                02. AI Workspace
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM2 ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {openM2 && (
              <div className="pl-2 space-y-1 border-l-2 border-purple-500/30 ml-3">
                {features[FeatureKey.AI_CHAT] !== false && (
                  <>
                    <NavLink
                      to="/ai-chat"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive && !location.search.includes('mode=dev')
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Assistant Studio</span>
                    </NavLink>

                    {isDeveloper && (
                      <NavLink
                        to="/ai-chat?mode=dev"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isActive && location.search.includes('mode=dev')
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`
                        }
                      >
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>Developer & Supervisor</span>
                      </NavLink>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 03: Sales CRM & Deals */}
        {canSeeM3 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM3(!openM3)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                03. Sales CRM & Deals
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM3 ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {openM3 && (
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
                      <span>Sales Pipeline & Leads</span>
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

        {/* MODULE 04: Commerce & Fulfillment */}
        {canSeeM4 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM4(!openM4)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                04. Commerce
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM4 ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            {openM4 && (
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
                    <span>Customers Directory</span>
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 05: Customer Support */}
        {canSeeM5 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM5(!openM5)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-pink-400" />
                05. Customer Support
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openM5 ? 'rotate-180 text-pink-400' : ''}`} />
            </button>

            {openM5 && (
              <div className="pl-2 space-y-1 border-l-2 border-pink-500/30 ml-3">
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
                      <Headphones className="w-3.5 h-3.5 text-pink-400" />
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
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        <span>Customer 360</span>
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
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Knowledge FAQs</span>
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODULE 06: Document Intelligence & RAG */}
        {canSeeM6 && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenM6(!openM6)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                06. Documents & RAG
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
                07. BI & SQL Analytics
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
                  <span>BI Metrics & KPIs</span>
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
              </div>
            )}
          </div>
        )}

        {/* MODULE 08: Multi-Agent & Developer Studio */}
        {canSeeMultiAgent && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenMultiAgent(!openMultiAgent)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                08. Multi-Agent & Dev
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMultiAgent ? 'rotate-180 text-purple-400' : ''}`} />
            </button>

            {openMultiAgent && (
              <div className="pl-2 space-y-1 border-l-2 border-purple-500/30 ml-3">
                <NavLink
                  to="/multi-agent"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Supervisor & DAG</span>
                </NavLink>

                <NavLink
                  to="/developer-agent"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Developer Studio</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 09: Automation & Workflows */}
        {canSeeAutomation && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenAutomation(!openAutomation)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                09. Automation
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openAutomation ? 'rotate-180 text-orange-400' : ''}`} />
            </button>

            {openAutomation && (
              <div className="pl-2 space-y-1 border-l-2 border-orange-500/30 ml-3">
                <NavLink
                  to="/automation/workflows"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Workflow className="w-3.5 h-3.5 text-orange-400" />
                  <span>Workflow Builder</span>
                </NavLink>

                <NavLink
                  to="/automation/notifications"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notification Templates</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 10: Dynamic CMS & Media */}
        {canSeeCms && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenCms(!openCms)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                10. Dynamic CMS
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openCms ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {openCms && (
              <div className="pl-2 space-y-1 border-l-2 border-cyan-500/30 ml-3">
                <NavLink
                  to="/cms/pages"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pages & SEO</span>
                </NavLink>

                <NavLink
                  to="/cms/menus"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <MenuIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Navigation Menus</span>
                </NavLink>

                <NavLink
                  to="/cms/media"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Media Assets</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 11: SaaS Plans & Billing */}
        {canSeeBilling && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenBilling(!openBilling)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                11. SaaS & Billing
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openBilling ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            {openBilling && (
              <div className="pl-2 space-y-1 border-l-2 border-emerald-500/30 ml-3">
                <NavLink
                  to="/billing"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plans & Invoices</span>
                </NavLink>

                <NavLink
                  to="/billing?tab=quotas"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive && location.search.includes('tab=quotas')
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  <span>Usage & Quotas</span>
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* MODULE 12: Super Admin & Production Infrastructure */}
        {canSeeSuperAdmin && (
          <div className="space-y-1">
            <button
              onClick={() => setOpenSuperAdmin(!openSuperAdmin)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                12. Super Admin & Infra
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSuperAdmin ? 'rotate-180 text-rose-400' : ''}`} />
            </button>

            {openSuperAdmin && (
              <div className="pl-2 space-y-1 border-l-2 border-rose-500/30 ml-3">
                {isSuperAdmin && (
                  <>
                    <NavLink
                      to="/admin"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-rose-400" />
                      <span>Admin Overview</span>
                    </NavLink>

                    <NavLink
                      to="/admin/infrastructure"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Server className="w-3.5 h-3.5 text-amber-400" />
                      <span>Production Infrastructure</span>
                    </NavLink>

                    <NavLink
                      to="/admin/ai-providers"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Providers & Models</span>
                    </NavLink>

                    <NavLink
                      to="/admin/feature-flags"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Flag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Feature Flags</span>
                    </NavLink>

                    <NavLink
                      to="/admin/prompts"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>System Prompts</span>
                    </NavLink>

                    <NavLink
                      to="/admin/settings"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Settings className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Platform Settings</span>
                    </NavLink>

                    <NavLink
                      to="/admin/tenants"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Companies / Tenants</span>
                    </NavLink>
                  </>
                )}

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
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
                        isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Roles & Permissions</span>
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </aside>
  );
};
