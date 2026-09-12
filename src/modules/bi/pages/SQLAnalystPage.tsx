import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart3, 
  Bot, 
  Database, 
  Terminal, 
  Bookmark, 
  History, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Headphones, 
  Layers, 
  RefreshCw,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { 
  biService, 
  TableSchema, 
  NaturalQueryResponse, 
  SqlExecutionResponse, 
  SqlExplanationResponse, 
  ExecutiveInsightsResponse, 
  SavedReport, 
  ScheduledReport, 
  QueryHistoryItem 
} from '../../../services/biService';
import { InteractiveChart } from '../components/InteractiveChart';
import { SchemaExplorer } from '../components/SchemaExplorer';
import { SqlSandbox } from '../components/SqlSandbox';
import { NaturalQueryBar } from '../components/NaturalQueryBar';
import { SavedReportsTab } from '../components/SavedReportsTab';
import { QueryHistoryTab } from '../components/QueryHistoryTab';

export const SQLAnalystPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabParam = searchParams.get('tab')?.toUpperCase();
  const validTabs = ['ANALYST', 'SCHEMA', 'SANDBOX', 'DASHBOARD', 'REPORTS', 'HISTORY'] as const;
  type TabType = typeof validTabs[number];

  const defaultTab: TabType = (validTabs.includes(initialTabParam as TabType) ? initialTabParam : 'ANALYST') as TabType;
  const [activeTab, setActiveTabState] = useState<TabType>(defaultTab);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    setSearchParams({ tab: tab.toLowerCase() });
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab')?.toUpperCase();
    if (tabParam && validTabs.includes(tabParam as TabType)) {
      setActiveTabState(tabParam as TabType);
    }
  }, [searchParams]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // States
  const [schema, setSchema] = useState<TableSchema[]>(() => {
    try {
      const cached = sessionStorage.getItem('aura_cached_schema');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingSchema, setIsLoadingSchema] = useState<boolean>(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [insights, setInsights] = useState<ExecutiveInsightsResponse | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

  // Sandbox states
  const [currentSql, setCurrentSql] = useState<string>(
    'SELECT name, price, stock, status FROM products ORDER BY price DESC LIMIT 10;'
  );
  const [naturalResult, setNaturalResult] = useState<NaturalQueryResponse | null>(null);
  const [executionResult, setExecutionResult] = useState<SqlExecutionResponse | null>(null);
  const [explanationResult, setExplanationResult] = useState<SqlExplanationResponse | null>(null);

  // Save Report Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [newReportName, setNewReportName] = useState<string>('');
  const [newReportDescription, setNewReportDescription] = useState<string>('');
  const [newReportChartType, setNewReportChartType] = useState<string>('table');
  const [newReportTags, setNewReportTags] = useState<string>('Analytics, SQL');

  // Fast independent schema fetcher with client-side caching
  const fetchSchema = async (forceRefresh = false) => {
    setIsLoadingSchema(true);
    try {
      const sch = await biService.getSchema(forceRefresh);
      if (sch && sch.length > 0) {
        setSchema(sch);
        try {
          sessionStorage.setItem('aura_cached_schema', JSON.stringify(sch));
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load database schema:', err);
    } finally {
      setIsLoadingSchema(false);
    }
  };

  // Lazy-load executive insights only when the dashboard tab is activated
  const fetchInsights = async () => {
    if (insights || isLoadingInsights) return;
    setIsLoadingInsights(true);
    try {
      const ins = await biService.getInsights();
      setInsights(ins);
    } catch (err) {
      console.error('Failed to load executive insights:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Initial fast load: fetch schema & reports immediately without waiting for slow AI calls
  useEffect(() => {
    fetchSchema();
    biService.getSavedReports().then(setSavedReports).catch(() => []);
    biService.getScheduledReports().then(setScheduledReports).catch(() => []);
    biService.getQueryHistory().then(setQueryHistory).catch(() => []);
  }, []);

  // Lazy load insights only when DASHBOARD tab is opened
  useEffect(() => {
    if (activeTab === 'DASHBOARD' && !insights) {
      fetchInsights();
    }
  }, [activeTab]);

  const handleRefreshAll = () => {
    fetchSchema(true);
    if (activeTab === 'DASHBOARD') {
      fetchInsights();
    }
    biService.getSavedReports().then(setSavedReports).catch(() => []);
    biService.getScheduledReports().then(setScheduledReports).catch(() => []);
    biService.getQueryHistory().then(setQueryHistory).catch(() => []);
  };

  // 1. Natural Language Query Generator
  const handleGenerateNaturalQuery = async (query: string) => {
    setIsLoading(true);
    setStatusMessage('Translating natural language to optimized SQL...');
    try {
      const res = await biService.generateNaturalQuery(query);
      setNaturalResult(res);
      setCurrentSql(res.sql);
      setStatusMessage(null);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Failed to synthesize SQL query'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Execute SQL in Sandbox
  const handleExecuteSql = async (sqlToRun: string, naturalQuery?: string) => {
    setIsLoading(true);
    setStatusMessage('Executing read-only SQL query...');
    try {
      const res = await biService.executeSql(sqlToRun, naturalQuery);
      setExecutionResult(res);
      setStatusMessage(`Success: ${res.row_count} rows in ${res.execution_time_ms}ms`);
      // Refresh history
      biService.getQueryHistory().then(setQueryHistory).catch(() => {});
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Query execution failed.';
      setExecutionResult({
        success: false,
        sql: sqlToRun,
        columns: [],
        rows: [],
        row_count: 0,
        execution_time_ms: 0,
        error: errorMsg,
      });
      setStatusMessage(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. AI Explain & Optimize Query
  const handleExplainSql = async (sqlToExplain: string) => {
    setIsLoading(true);
    try {
      const res = await biService.explainSql(sqlToExplain);
      setExplanationResult(res);
    } catch (err) {
      console.error('Error explaining query:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Save Report
  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim() || !currentSql.trim()) return;

    try {
      const tags = newReportTags.split(',').map((t) => t.trim()).filter(Boolean);
      await biService.saveReport({
        name: newReportName,
        description: newReportDescription,
        sql_query: currentSql,
        chart_type: newReportChartType,
        tags,
      });
      setIsSaveModalOpen(false);
      setStatusMessage('Report saved successfully!');
      biService.getSavedReports().then(setSavedReports).catch(() => {});
    } catch (err: any) {
      setStatusMessage(`Failed to save report: ${err.message}`);
    }
  };

  const handleOpenSaveModal = (sql: string, naturalQuery?: string, chartType?: string) => {
    setCurrentSql(sql);
    setNewReportName(naturalQuery ? `Report: ${naturalQuery.slice(0, 40)}` : 'Custom SQL Report');
    setNewReportDescription(naturalQuery || 'Custom analytical dataset');
    setNewReportChartType(chartType || 'table');
    setIsSaveModalOpen(true);
  };

  // 5. Run Saved Report
  const handleRunSavedReport = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await biService.runSavedReport(id);
      setCurrentSql(res.report.sql_query);
      setExecutionResult(res.result);
      setActiveTab('SANDBOX');
      setStatusMessage(`Loaded and ran saved report: ${res.report.name}`);
    } catch (err: any) {
      setStatusMessage(`Error running saved report: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Delete Saved Report
  const handleDeleteSavedReport = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this saved report?')) {
      try {
        await biService.deleteReport(id);
        setSavedReports((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        setStatusMessage(`Failed to delete: ${err.message}`);
      }
    }
  };

  // 7. Create Schedule
  const handleCreateSchedule = async (data: any) => {
    try {
      await biService.createScheduledReport(data);
      biService.getScheduledReports().then(setScheduledReports).catch(() => {});
      setStatusMessage('Schedule created successfully!');
    } catch (err: any) {
      setStatusMessage(`Error creating schedule: ${err.message}`);
    }
  };

  // 8. Trigger Schedule
  const handleTriggerSchedule = async (id: string) => {
    try {
      const res = await biService.triggerScheduledReport(id);
      setStatusMessage(res.message);
      biService.getScheduledReports().then(setScheduledReports).catch(() => {});
    } catch (err: any) {
      setStatusMessage(`Trigger error: ${err.message}`);
    }
  };

  // 9. Delete Schedule
  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Delete this scheduled report?')) {
      try {
        await biService.deleteScheduledReport(id);
        setScheduledReports((prev) => prev.filter((s) => s.id !== id));
      } catch (err: any) {
        setStatusMessage(`Error: ${err.message}`);
      }
    }
  };

  // 10. Clear History
  const handleClearHistory = async () => {
    if (window.confirm('Clear all SQL query execution history?')) {
      try {
        await biService.clearQueryHistory();
        setQueryHistory([]);
        setStatusMessage('Query history cleared.');
      } catch (err: any) {
        setStatusMessage(`Error clearing history: ${err.message}`);
      }
    }
  };

  // 11. Export CSV
  const handleExportCsv = async (sqlToExport: string) => {
    try {
      await biService.exportCsv(sqlToExport, 'bi_query_export');
      setStatusMessage('Export initiated.');
    } catch (err: any) {
      setStatusMessage(`Export failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/80 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Module 07 • Enterprise Business Intelligence & SQL Agent</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Business Intelligence & SQL Analyst
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ask natural language business questions, inspect database schemas, validate and execute read-only queries with strict AST security, build saved reports, and receive automated AI trend insights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={isLoadingSchema || isLoadingInsights}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSchema || isLoadingInsights ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Global Status Toast */}
        {statusMessage && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between animate-fadeIn">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-500 hover:text-white font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('ANALYST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ANALYST'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI SQL Analyst</span>
        </button>

        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'SCHEMA'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Schema Discovery</span>
        </button>

        <button
          onClick={() => setActiveTab('SANDBOX')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'SANDBOX'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>SQL Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'DASHBOARD'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive BI Dashboards</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'REPORTS'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved & Scheduled Reports</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-indigo-300">
            {savedReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'HISTORY'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Query Audit History</span>
        </button>
      </div>

      {/* TAB 1: AI NATURAL LANGUAGE SQL ANALYST */}
      {activeTab === 'ANALYST' && (
        <div className="space-y-6">
          <NaturalQueryBar
            isLoading={isLoading}
            onGenerate={handleGenerateNaturalQuery}
            result={naturalResult}
            onExecute={(sql, nq) => {
              setCurrentSql(sql);
              handleExecuteSql(sql, nq);
              setActiveTab('SANDBOX');
            }}
            onSaveReportModal={handleOpenSaveModal}
          />

          {/* Quick Dual Explorer: Schema Side-by-Side with Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-[520px]">
              <SchemaExplorer
                schema={schema}
                isLoading={isLoadingSchema}
                onRefresh={() => fetchSchema(true)}
                onInsertText={(text) => {
                  setCurrentSql((prev) => `${prev} ${text}`);
                }}
              />
            </div>

            <div className="lg:col-span-2">
              <SqlSandbox
                sql={currentSql}
                setSql={setCurrentSql}
                isLoading={isLoading}
                onExecute={(sql) => handleExecuteSql(sql)}
                onExplain={handleExplainSql}
                result={executionResult}
                explanation={explanationResult}
                onExportCsv={handleExportCsv}
                onSaveReportModal={(sql) => handleOpenSaveModal(sql)}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEMA DISCOVERY */}
      {activeTab === 'SCHEMA' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400">
                <Database className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Database Architecture & Data Catalog</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                AURA automatically discovers MySQL database tables, field data types, index constraints, and relationship hierarchies. Click any table or column in the explorer to generate an optimized read-only query.
              </p>
            </div>

            <div className="h-[600px]">
              <SchemaExplorer
                schema={schema}
                isLoading={isLoadingSchema}
                onRefresh={() => fetchSchema(true)}
                onInsertText={(text) => {
                  setCurrentSql(text.startsWith('SELECT') ? text : `SELECT * FROM ${text} LIMIT 20;`);
                  setActiveTab('SANDBOX');
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Query Security Blueprint</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Strict Read-Only:</strong> Destructive operations (DROP, DELETE, UPDATE, INSERT, ALTER) are blocked at the engine layer.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Anti-Chaining:</strong> Multiple statements separated by semicolons are disallowed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Automatic Capping:</strong> All queries are protected with a LIMIT 500 ceiling to prevent memory overflow.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Tenant Isolation:</strong> Data rows are segmented by tenant context.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQL SANDBOX */}
      {activeTab === 'SANDBOX' && (
        <SqlSandbox
          sql={currentSql}
          setSql={setCurrentSql}
          isLoading={isLoading}
          onExecute={(sql) => handleExecuteSql(sql)}
          onExplain={handleExplainSql}
          result={executionResult}
          explanation={explanationResult}
          onExportCsv={handleExportCsv}
          onSaveReportModal={(sql) => handleOpenSaveModal(sql)}
        />
      )}

      {/* TAB 4: EXECUTIVE BI & DASHBOARDS */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                  ${insights?.metrics?.total_revenue?.toLocaleString() ?? '148,200'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  ▲ +24.8% <span className="text-slate-500 font-normal">vs last month</span>
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Orders</span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                  {insights?.metrics?.order_count?.toLocaleString() ?? '1,280'}
                </h3>
                <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                  AOV: ${insights?.metrics?.avg_order_value ?? '115.78'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Base</span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                  {insights?.metrics?.customer_count?.toLocaleString() ?? '4,890'}
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  Active VIPs: 41.2%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pipeline Deals</span>
                <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                  ${insights?.metrics?.pipeline_value?.toLocaleString() ?? '142,500'}
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-1">
                  {insights?.metrics?.sales_leads ?? 24} active leads
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* AI Executive Trend Analysis Card */}
          {insights && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {insights.headline}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Window: {insights.period}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {insights.trend_analysis}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Strategic Recommendations */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Strategic Growth Recommendations:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {insights.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">➔</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk / Anomaly Signals */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Risk & Anomaly Observations:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {insights.risk_signals.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">⚠</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <InteractiveChart
                type="bar"
                title="Monthly Revenue Trajectory ($ USD)"
                unit="$"
                height={260}
                color="#6366f1"
                data={[
                  { label: 'Jan', value: 18400 },
                  { label: 'Feb', value: 21900 },
                  { label: 'Mar', value: 25400 },
                  { label: 'Apr', value: 23200 },
                  { label: 'May', value: 28900 },
                  { label: 'Jun', value: 34100 },
                  { label: 'Jul', value: 39500 },
                  { label: 'Aug', value: 44200 },
                ]}
              />
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <InteractiveChart
                type="line"
                title="Customer Conversion & Order Volume Trend"
                height={260}
                color="#10b981"
                data={[
                  { label: 'W1', value: 140 },
                  { label: 'W2', value: 185 },
                  { label: 'W3', value: 210 },
                  { label: 'W4', value: 260 },
                  { label: 'W5', value: 290 },
                  { label: 'W6', value: 340 },
                  { label: 'W7', value: 390 },
                  { label: 'W8', value: 430 },
                ]}
              />
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <InteractiveChart
                type="pie"
                title="Support Ticket Status Distribution"
                height={220}
                data={[
                  { label: 'Resolved', value: 520, color: '#10b981' },
                  { label: 'In Progress', value: 180, color: '#6366f1' },
                  { label: 'Waiting Client', value: 95, color: '#f59e0b' },
                  { label: 'Escalated', value: 45, color: '#ef4444' },
                ]}
              />
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <InteractiveChart
                type="bar"
                title="Sales Pipeline Stages ($ Forecast Value)"
                unit="$"
                height={220}
                color="#8b5cf6"
                data={[
                  { label: 'Qualification', value: 38000 },
                  { label: 'Proposal', value: 54000 },
                  { label: 'Negotiation', value: 42500 },
                  { label: 'Closed Won', value: 89000 },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED & SCHEDULED REPORTS */}
      {activeTab === 'REPORTS' && (
        <SavedReportsTab
          savedReports={savedReports}
          scheduledReports={scheduledReports}
          isLoading={isLoading}
          onRunReport={handleRunSavedReport}
          onDeleteSavedReport={handleDeleteSavedReport}
          onCreateSchedule={handleCreateSchedule}
          onTriggerSchedule={handleTriggerSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onLoadInSandbox={(sql) => {
            setCurrentSql(sql);
            setActiveTab('SANDBOX');
          }}
        />
      )}

      {/* TAB 6: QUERY HISTORY */}
      {activeTab === 'HISTORY' && (
        <QueryHistoryTab
          history={queryHistory}
          isLoading={isLoading}
          onClearHistory={handleClearHistory}
          onLoadInSandbox={(sql) => {
            setCurrentSql(sql);
            setActiveTab('SANDBOX');
          }}
        />
      )}

      {/* MODAL: Save Report */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Save as Reusable Report</h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Report Title</label>
                <input
                  type="text"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Recommended Chart</label>
                  <select
                    value={newReportChartType}
                    onChange={(e) => setNewReportChartType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="table">Table</option>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="kpi">KPI Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newReportTags}
                    onChange={(e) => setNewReportTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">SQL Statement</label>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-indigo-300 border border-slate-800 max-h-28 overflow-y-auto">
                  {currentSql}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
