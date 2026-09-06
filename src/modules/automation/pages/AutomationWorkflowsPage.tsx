import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Workflow,
  Zap,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Layers,
  Send,
  Bell,
  Code2,
  Settings,
  RefreshCw,
  Eye,
  ChevronRight,
  Terminal,
  Activity,
  FileCode,
  Sliders,
  Sparkles,
  ArrowRight,
  Mail,
  MessageSquare
} from 'lucide-react';
import { automationSaasApi } from '../services/automationSaasApi';
import {
  AutomationWorkflow,
  WorkflowNode,
  WorkflowExecutionLog,
  NotificationTemplate,
  NotificationLog
} from '../types/automationSaas.types';

export const AutomationWorkflowsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/notifications') || location.search.includes('tab=templates')) {
      return 'templates';
    }
    if (location.pathname.endsWith('/logs') || location.search.includes('tab=logs')) {
      return 'logs';
    }
    return 'workflows';
  };

  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'logs'>(getTabFromPath());
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [testPayload, setTestPayload] = useState<string>(
    JSON.stringify({ score: 85, name: 'Apex Global', company: 'Apex Corp', estimated_value: 12500 }, null, 2)
  );
  const [executionResult, setExecutionResult] = useState<WorkflowExecutionLog | null>(null);

  // Template Modal State
  const [testRecipient, setTestRecipient] = useState('team-lead@company.com');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [testSending, setTestSending] = useState(false);
  const [testSendResult, setTestSendResult] = useState<NotificationLog | null>(null);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: 'workflows' | 'templates' | 'logs') => {
    setActiveTab(tab);
    if (tab === 'templates') {
      navigate('/automation/notifications');
    } else if (tab === 'logs') {
      navigate('/automation/logs');
    } else {
      navigate('/automation/workflows');
    }
  };

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [wfRes, tmplRes, logRes] = await Promise.allSettled([
        automationSaasApi.getWorkflows(),
        automationSaasApi.getNotificationTemplates(),
        automationSaasApi.getWorkflowExecutionLogs(),
      ]);

      const wfData = wfRes.status === 'fulfilled' ? wfRes.value : [];
      const tmplData = tmplRes.status === 'fulfilled' ? tmplRes.value : [];
      const logData = logRes.status === 'fulfilled' ? logRes.value : [];

      setWorkflows(wfData);
      if (wfData.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(wfData[0]);
      }
      setTemplates(tmplData);
      if (tmplData.length > 0 && !selectedTemplate) {
        setSelectedTemplate(tmplData[0]);
      }
      setExecutionLogs(logData);
    } catch (err) {
      console.error('Failed to load automation data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecuteWorkflow = async (workflowId: number) => {
    setExecuting(true);
    setExecutionResult(null);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(testPayload);
      } catch (e) {
        parsedPayload = { raw: testPayload };
      }

      const res = await automationSaasApi.executeWorkflow(workflowId, parsedPayload);
      setExecutionResult(res.execution);
      // Refresh workflows and logs
      const updatedWfs = await automationSaasApi.getWorkflows();
      setWorkflows(updatedWfs);
      const activeWf = updatedWfs.find((w) => w.id === workflowId);
      if (activeWf) setSelectedWorkflow(activeWf);
      const updatedLogs = await automationSaasApi.getWorkflowExecutionLogs();
      setExecutionLogs(updatedLogs);
    } catch (err) {
      console.error('Workflow execution failed', err);
    } finally {
      setExecuting(false);
    }
  };

  const handleSendTestNotification = async () => {
    if (!selectedTemplate) return;
    setTestSending(true);
    setTestSendResult(null);
    try {
      const res = await automationSaasApi.sendTestNotification({
        template_code: selectedTemplate.code,
        recipient: testRecipient,
        variables: {
          contact_name: 'Sarah Connor',
          company_name: 'Cyberdyne Systems',
          deal_value: '45,000',
          lead_score: '92',
          lead_source: 'Inbound Webform',
          ai_next_action: 'Schedule VIP Executive Demo',
          customer_name: 'Sarah Connor',
          order_number: 'ORD-9982',
          total_amount: '1,499.00',
          invoice_number: 'INV-2026-094',
          payment_method: 'Stripe',
          ticket_id: 'TCK-401',
          ticket_subject: 'API Rate Limiting Query',
          sentiment: 'Positive (0.84)',
        },
      });
      setTestSendResult(res);
    } catch (err) {
      console.error('Failed to send test notification', err);
    } finally {
      setTestSending(false);
    }
  };

  const toggleWorkflowStatus = async (wf: AutomationWorkflow) => {
    try {
      const updated = await automationSaasApi.updateWorkflow(wf.id, { is_active: !wf.is_active });
      setWorkflows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedWorkflow?.id === updated.id) {
        setSelectedWorkflow(updated);
      }
    } catch (err) {
      console.error('Failed to toggle workflow status', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Automation & Workflows Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Module 09
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Event-based triggers, scheduled cron jobs, condition branching, AI task execution & notification engine.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleTabChange('workflows')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workflows'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflow Builder</span>
          </button>

          <button
            onClick={() => handleTabChange('templates')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notification Templates</span>
          </button>

          <button
            onClick={() => handleTabChange('logs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Execution Logs</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-orange-400" />
          <p className="text-sm">Loading Automation Engine...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: WORKFLOW BUILDER & DAG VISUALIZER */}
          {activeTab === 'workflows' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Workflows List */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Workflows ({workflows.length})</h2>
                  <button
                    onClick={() => {
                      const newName = prompt('Enter workflow name:', 'Autonomous Lead Nurturing & Email Cadence');
                      if (newName) {
                        automationSaasApi
                          .createWorkflow({
                            name: newName,
                            trigger_type: 'event',
                            trigger_config: { event: 'lead.created' },
                            nodes: [
                              { id: 'node_0', type: 'trigger', title: 'Event Trigger: Lead Created', config: {} },
                              { id: 'node_1', type: 'condition', title: 'Condition: Score >= 70', config: { field: 'score', operator: '>=', value: 70 } },
                              { id: 'node_2', type: 'action_ai_task', title: 'AI: Generate Personalized Outreach', config: { prompt: 'Write warm pitch' } },
                            ],
                            is_active: true,
                          })
                          .then(() => loadData());
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white border border-orange-500/30 text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Workflow</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {workflows.map((wf) => {
                    const isSelected = selectedWorkflow?.id === wf.id;
                    const successRate =
                      wf.run_count > 0 ? Math.round((wf.success_count / wf.run_count) * 100) : 100;

                    return (
                      <div
                        key={wf.id}
                        onClick={() => setSelectedWorkflow(wf)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-orange-500/60 shadow-lg shadow-orange-500/10'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1.5 rounded-lg text-xs ${
                                wf.trigger_type === 'schedule'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : wf.trigger_type === 'webhook'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}
                            >
                              {wf.trigger_type === 'schedule' ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <Zap className="w-4 h-4" />
                              )}
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-white leading-tight">{wf.name}</h3>
                              <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                                Trigger: {wf.trigger_type}{' '}
                                {wf.trigger_config?.event ? `(${wf.trigger_config.event})` : ''}
                                {wf.trigger_config?.cron ? `(${wf.trigger_config.cron})` : ''}
                              </p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWorkflowStatus(wf);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                              wf.is_active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {wf.is_active ? 'Active' : 'Paused'}
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                          <div className="flex items-center gap-3">
                            <span>
                              Runs: <strong className="text-slate-200">{wf.run_count}</strong>
                            </span>
                            <span>
                              Success: <strong className="text-emerald-400">{successRate}%</strong>
                            </span>
                          </div>
                          <span>{wf.nodes?.length || 0} Steps</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Visual DAG Canvas & Live Test Runner */}
              <div className="lg:col-span-8 space-y-4">
                {selectedWorkflow ? (
                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-6">
                    {/* Workflow Title & Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{selectedWorkflow.name}</h2>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              selectedWorkflow.is_active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {selectedWorkflow.is_active ? 'Status: Active' : 'Status: Paused'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{selectedWorkflow.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={executing}
                          onClick={() => handleExecuteWorkflow(selectedWorkflow.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50"
                        >
                          {executing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 fill-white" />
                          )}
                          <span>{executing ? 'Executing Pipeline...' : 'Test & Run Workflow'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Visual DAG Node Flow Chart */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-orange-400" />
                        Visual Pipeline DAG ({selectedWorkflow.nodes?.length || 0} Stages)
                      </h3>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-amber-500 before:to-emerald-500">
                        {selectedWorkflow.nodes?.map((node: WorkflowNode, idx: number) => {
                          const isTrigger = node.type === 'trigger';
                          const isCondition = node.type === 'condition';
                          const isAi = node.type === 'action_ai' || node.type === 'action_ai_task';
                          const isNotif = node.type === 'action_notification';

                          return (
                            <div
                              key={node.id || idx}
                              className="relative bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 hover:border-orange-500/50 transition-all shadow-md"
                            >
                              <div className="absolute -left-[27px] top-4 w-4 h-4 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                              </div>

                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                      isTrigger
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : isCondition
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : isAi
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : isNotif
                                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    }`}
                                  >
                                    {isTrigger ? (
                                      <Zap className="w-4 h-4" />
                                    ) : isCondition ? (
                                      <Sliders className="w-4 h-4" />
                                    ) : isAi ? (
                                      <Sparkles className="w-4 h-4" />
                                    ) : isNotif ? (
                                      <Bell className="w-4 h-4" />
                                    ) : (
                                      <Code2 className="w-4 h-4" />
                                    )}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        Step {idx + 1} • {node.type}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white">{node.title}</h4>
                                  </div>
                                </div>
                              </div>

                              {/* Config attributes */}
                              {node.config && Object.keys(node.config).length > 0 && (
                                <div className="mt-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                                  <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(node.config, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Test Payload & Live Execution Output */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-orange-400" />
                          Test Payload JSON Input
                        </label>
                        <textarea
                          rows={6}
                          value={testPayload}
                          onChange={(e) => setTestPayload(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          Live Execution Telemetry
                        </label>
                        <div className="h-[135px] bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-xs text-slate-300">
                          {executing ? (
                            <div className="flex items-center gap-2 text-orange-400">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Running DAG step nodes in sequence...</span>
                            </div>
                          ) : executionResult ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Status: {executionResult.status}
                                </span>
                                <span className="text-slate-500">{executionResult.execution_time_ms} ms</span>
                              </div>
                              <div className="space-y-1 text-[11px]">
                                {executionResult.step_results?.map((res, i) => (
                                  <div key={i} className="flex items-start gap-2 bg-slate-900 p-1.5 rounded border border-slate-800">
                                    <span className="text-emerald-400">✓</span>
                                    <div>
                                      <span className="font-bold text-slate-200">{res.title}</span> ({res.duration_ms}ms)
                                      {res.output?.response && (
                                        <p className="text-slate-400 text-[10px] mt-0.5 line-clamp-2">
                                          {typeof res.output.response === 'string'
                                            ? res.output.response
                                            : JSON.stringify(res.output.response)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-600 italic">Click "Test & Run Workflow" above to inspect live pipeline execution output.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                    Select a workflow from the left sidebar to inspect and configure its nodes.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATION & EMAIL TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Template Selector */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Templates ({templates.length})</h2>
                  <button
                    onClick={() => {
                      const name = prompt('Template Name:', 'Customer Renewal Reminder');
                      const code = prompt('Template Code (e.g. renewal_alert):', 'renewal_alert');
                      if (name && code) {
                        automationSaasApi
                          .createNotificationTemplate({
                            name,
                            code,
                            channel: 'email',
                            subject: 'Subscription Renewal Alert',
                            body: 'Hi {{customer_name}}, your plan expires in {{days}} days.',
                            variables: ['customer_name', 'days'],
                            is_active: true,
                          })
                          .then(() => loadData());
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white border border-orange-500/30 text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Template</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {templates.map((tmpl) => {
                    const isSelected = selectedTemplate?.id === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-orange-500/60 shadow-lg shadow-orange-500/10'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tmpl.channel === 'slack'
                                ? 'bg-purple-500/20 text-purple-300'
                                : tmpl.channel === 'email'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-pink-500/20 text-pink-300'
                            }`}
                          >
                            {tmpl.channel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-1">code: {tmpl.code}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Template Editor & Dispatch Tester */}
              <div className="lg:col-span-8 space-y-4">
                {selectedTemplate ? (
                  <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <h2 className="text-base font-bold text-white">{selectedTemplate.name}</h2>
                        <p className="text-xs text-slate-400">Channel: {selectedTemplate.channel.toUpperCase()}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Template
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject Header</label>
                      <input
                        type="text"
                        value={selectedTemplate.subject || ''}
                        readOnly
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Template Body (Markdown / Interpolation)</label>
                      <textarea
                        rows={6}
                        value={selectedTemplate.body}
                        readOnly
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200"
                      />
                    </div>

                    {/* Supported Variables Chips */}
                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                          Dynamic Variable Placeholders
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTemplate.variables.map((v, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-orange-400 border border-slate-700 text-xs font-mono">
                              {`{{${v}}}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Dispatch Tester */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-orange-400" />
                        Send Live Test Notification
                      </h3>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={testRecipient}
                          onChange={(e) => setTestRecipient(e.target.value)}
                          placeholder="Recipient email or #channel"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                        />
                        <button
                          disabled={testSending}
                          onClick={handleSendTestNotification}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {testSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Dispatch</span>
                        </button>
                      </div>

                      {testSendResult && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center justify-between">
                          <span>✓ Notification dispatched to {testSendResult.recipient} (Status: {testSendResult.status})</span>
                          <span className="text-[10px] text-slate-400">ID #{testSendResult.id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                    Select a notification template to inspect and test send.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTION LOGS AUDIT */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Automation Execution Audit Logs ({executionLogs.length})
                </h2>
                <button
                  onClick={() => automationSaasApi.getWorkflowExecutionLogs().then(setExecutionLogs)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Logs</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Workflow</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Latency</th>
                      <th className="p-3">Executed At</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {executionLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-mono text-slate-500">#{log.id}</td>
                        <td className="p-3 font-bold text-white">{log.workflow?.name || `Workflow #${log.workflow_id}`}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{log.execution_time_ms} ms</td>
                        <td className="p-3 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => alert(JSON.stringify(log, null, 2))}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px]"
                          >
                            View Trace
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
