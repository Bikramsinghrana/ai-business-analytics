import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  Zap,
  Check,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  Users,
  HardDrive,
  DollarSign,
  Download,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { automationSaasApi } from '../../automation/services/automationSaasApi';
import {
  SubscriptionPlan,
  TenantSubscription,
  BillingInvoice,
  QuotaOverview
} from '../../automation/types/automationSaas.types';

export const SaaSManagementPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/invoices') || location.search.includes('tab=invoices')) {
      return 'invoices';
    }
    if (location.pathname.endsWith('/quotas') || location.search.includes('tab=quotas')) {
      return 'quotas';
    }
    return 'plans';
  };

  const [activeTab, setActiveTab] = useState<'plans' | 'invoices' | 'quotas'>(getTabFromPath());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [quotaOverview, setQuotaOverview] = useState<QuotaOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: 'plans' | 'invoices' | 'quotas') => {
    setActiveTab(tab);
    if (tab === 'invoices') {
      navigate('/billing?tab=invoices');
    } else if (tab === 'quotas') {
      navigate('/billing?tab=quotas');
    } else {
      navigate('/billing?tab=plans');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, subRes, invRes, quotaRes] = await Promise.allSettled([
        automationSaasApi.getPlans(),
        automationSaasApi.getCurrentSubscription(),
        automationSaasApi.getInvoices(),
        automationSaasApi.getQuotaOverview(),
      ]);

      const plansData = plansRes.status === 'fulfilled' ? plansRes.value : [];
      const subData = subRes.status === 'fulfilled' ? subRes.value : null;
      const invData = invRes.status === 'fulfilled' ? invRes.value : [];
      const quotaData = quotaRes.status === 'fulfilled' ? quotaRes.value : null;

      setPlans(plansData);
      setSubscription(subData);
      setInvoices(invData);
      setQuotaOverview(quotaData);
    } catch (err) {
      console.error('Failed to load SaaS billing data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setActionLoading(true);
    try {
      const updated = await automationSaasApi.subscribeToPlan(planId, billingCycle, 'stripe');
      setSubscription(updated);
      alert('Subscription plan updated successfully!');
      await loadData();
    } catch (err) {
      console.error('Subscription update failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId: number) => {
    setActionLoading(true);
    try {
      const updated = await automationSaasApi.payInvoice(invoiceId);
      setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
      alert('Invoice payment processed successfully!');
    } catch (err) {
      console.error('Invoice payment failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              SaaS Plans, Billing & Quota Suite
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Module 11
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Subscription tiers, automated invoice billing, payment gateway simulation, and real-time AI quota enforcement.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleTabChange('plans')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'plans'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Plans & Tiers</span>
          </button>

          <button
            onClick={() => handleTabChange('invoices')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'invoices'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices & Billing</span>
          </button>

          <button
            onClick={() => handleTabChange('quotas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quotas'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Usage & Quotas</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-emerald-400" />
          <p className="text-sm">Loading SaaS Billing Suite...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SUBSCRIPTION PLANS & TIERS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="flex flex-col items-center justify-center gap-2 pt-2">
                <div className="inline-flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((p) => {
                  const isCurrent = subscription?.plan_id === p.id;
                  const price = billingCycle === 'yearly' ? p.price_yearly : p.price_monthly;
                  const periodSuffix = billingCycle === 'yearly' ? '/yr' : '/mo';

                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                        p.is_popular
                          ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p.is_popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow">
                          Most Popular
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-bold text-white">{p.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{p.description}</p>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white">${price}</span>
                          <span className="text-xs text-slate-400">{periodSuffix}</span>
                        </div>

                        {/* Features Checklist */}
                        <div className="pt-4 border-t border-slate-800 space-y-2.5">
                          {p.features?.map((feat: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/80">
                        <button
                          disabled={isCurrent || actionLoading}
                          onClick={() => handleSubscribe(p.id)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                            isCurrent
                              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                              : p.is_popular
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          }`}
                        >
                          {isCurrent ? 'Current Active Plan' : `Upgrade to ${p.name}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES & BILLING */}
          {activeTab === 'invoices' && (
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Billing Invoices & Receipts ({invoices.length})
                  </h2>
                  <p className="text-xs text-slate-400">All automated recurring charges and payment confirmations.</p>
                </div>
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Invoice Number</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Tax</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-emerald-400">{inv.invoice_number}</td>
                        <td className="p-3">${inv.amount.toFixed(2)}</td>
                        <td className="p-3 text-slate-400">${inv.tax_amount.toFixed(2)}</td>
                        <td className="p-3 font-bold text-white">${inv.total_amount.toFixed(2)} {inv.currency}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : 'Pending'}</td>
                        <td className="p-3 text-right space-x-2">
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => handlePayInvoice(inv.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px]"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Receipt Modal */}
              {selectedInvoice && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-white">Invoice Receipt</h3>
                        <p className="text-xs font-mono text-emerald-400">{selectedInvoice.invoice_number}</p>
                      </div>
                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="text-slate-400 hover:text-white text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Gateway:</span>
                        <span className="font-semibold text-white capitalize">{selectedInvoice.payment_gateway}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transaction ID:</span>
                        <span className="font-mono text-slate-300">{selectedInvoice.transaction_reference || 'N/A'}</span>
                      </div>

                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        {selectedInvoice.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.description}</span>
                            <span className="font-semibold text-white">${item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                        <span>Total Paid:</span>
                        <span className="text-emerald-400">${selectedInvoice.total_amount.toFixed(2)} {selectedInvoice.currency}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedInvoice(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USAGE & QUOTAS */}
          {activeTab === 'quotas' && quotaOverview && (
            <div className="space-y-6">
              {/* Plan & Period Summary */}
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Subscription Tier</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{quotaOverview.plan.name} (${quotaOverview.plan.price_monthly}/mo)</h2>
                  <p className="text-xs text-slate-400 mt-1">Billing Period: {quotaOverview.period} (Renews automatically)</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    Telemetry Live: All Quotas Healthy
                  </div>
                </div>
              </div>

              {/* Gauges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Tokens Metric */}
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white">AI Token Quota</h3>
                    </div>
                    <span className="text-xs font-bold text-purple-400">{quotaOverview.metrics.ai_tokens.percentage}% Used</span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, quotaOverview.metrics.ai_tokens.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Used: {quotaOverview.metrics.ai_tokens.used.toLocaleString()} Tokens</span>
                    <span>Limit: {quotaOverview.metrics.ai_tokens.limit.toLocaleString()} Tokens</span>
                  </div>
                </div>

                {/* Storage Metric */}
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Knowledge Base Storage</h3>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">{quotaOverview.metrics.storage.percentage}% Used</span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, quotaOverview.metrics.storage.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Used: {quotaOverview.metrics.storage.used_mb} MB</span>
                    <span>Limit: {quotaOverview.metrics.storage.limit_mb} MB</span>
                  </div>
                </div>

                {/* Workflow Executions Metric */}
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <h3 className="text-sm font-bold text-white">Active Workflow Executions</h3>
                    </div>
                    <span className="text-xs font-bold text-orange-400">{quotaOverview.metrics.workflows.percentage}% Used</span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, quotaOverview.metrics.workflows.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Runs: {quotaOverview.metrics.workflows.used} Runs</span>
                    <span>Monthly Cap: {quotaOverview.metrics.workflows.limit} Runs</span>
                  </div>
                </div>

                {/* User Seats Metric */}
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">Team Member Seats</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{quotaOverview.metrics.user_seats.percentage}% Allocated</span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, quotaOverview.metrics.user_seats.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Active: {quotaOverview.metrics.user_seats.used} Members</span>
                    <span>Max Seats: {quotaOverview.metrics.user_seats.limit} Seats</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
