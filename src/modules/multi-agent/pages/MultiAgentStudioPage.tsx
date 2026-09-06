import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Code2,
  TestTube,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Sparkles,
  Bot,
  Zap,
  Check,
  Terminal,
  FileCode,
  AlertTriangle,
  RotateCw,
  Search,
} from 'lucide-react';
import { multiAgentApi } from '../services/multiAgentApi';
import {
  RegisteredAgent,
  AgentWorkflowExecution,
  AgentApproval,
  CodeAnalysisResult,
  CodeReviewResult,
  TestGenerationResult,
  SandboxTestResult,
} from '../types/multiAgent.types';

export const MultiAgentStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orchestrator' | 'developer' | 'qa_testing' | 'approvals'>('orchestrator');

  // Multi-Agent Supervisor state
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [userGoal, setUserGoal] = useState<string>('Refactor authentication endpoint to add multi-tenant rate limiting and generate unit tests');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentExecution, setCurrentExecution] = useState<AgentWorkflowExecution | null>(null);
  const [executions, setExecutions] = useState<AgentWorkflowExecution[]>([]);

  // Developer Agent Studio state
  const [codeSnippet, setCodeSnippet] = useState<string>(`<?php
namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;

class UserController extends Controller {
    public function getUser(Request \$request) {
        \$id = \$request->input('id');
        return \\DB::select("SELECT * FROM users WHERE id = '\$id'");
    }
}`);
  const [codeLanguage, setCodeLanguage] = useState<string>('php');
  const [devAction, setDevAction] = useState<'analyze' | 'explain' | 'review' | 'fix'>('analyze');
  const [devLoading, setDevLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
  const [explainResult, setExplainResult] = useState<string | null>(null);

  // QA & Tester Agent state
  const [testFramework, setTestFramework] = useState<'phpunit' | 'pest' | 'vitest'>('phpunit');
  const [testGenerating, setTestGenerating] = useState<boolean>(false);
  const [generatedTests, setGeneratedTests] = useState<TestGenerationResult | null>(null);
  const [sandboxRunning, setSandboxRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<SandboxTestResult | null>(null);

  // Approvals state
  const [approvals, setApprovals] = useState<AgentApproval[]>([]);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [agentList, execRes, appRes] = await Promise.all([
        multiAgentApi.getAgents().catch(() => []),
        multiAgentApi.getExecutions().catch(() => ({ data: [] })),
        multiAgentApi.getApprovals().catch(() => []),
      ]);
      setAgents(Array.isArray(agentList) ? agentList : []);
      if (execRes && Array.isArray(execRes.data)) {
        setExecutions(execRes.data);
        if (execRes.data.length > 0) {
          setCurrentExecution(execRes.data[0]);
        }
      }
      setApprovals(Array.isArray(appRes) ? appRes : []);
    } catch (e) {
      console.error('Failed to load initial multi-agent data', e);
    }
  };

  const handleLaunchWorkflow = async () => {
    if (!userGoal.trim()) return;
    setIsExecuting(true);
    try {
      const execution = await multiAgentApi.executeWorkflow(userGoal);
      setCurrentExecution(execution);
      setExecutions((prev) => [execution, ...prev]);
    } catch (e) {
      console.error('Workflow execution failed', e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDevAction = async (action: 'analyze' | 'review' | 'explain') => {
    if (!codeSnippet.trim()) return;
    setDevAction(action);
    setDevLoading(true);
    setAnalysisResult(null);
    setReviewResult(null);
    setExplainResult(null);

    try {
      if (action === 'analyze') {
        const res = await multiAgentApi.analyzeCode(codeSnippet, codeLanguage);
        setAnalysisResult(res);
      } else if (action === 'review') {
        const res = await multiAgentApi.reviewCode(codeSnippet, codeLanguage);
        setReviewResult(res);
      } else if (action === 'explain') {
        const res = await multiAgentApi.explainCode(codeSnippet, codeLanguage);
        setExplainResult(res?.content || 'No explanation generated.');
      }
    } catch (e) {
      console.error('Developer agent action failed', e);
    } finally {
      setDevLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!codeSnippet.trim()) return;
    setTestGenerating(true);
    setSandboxResult(null);
    try {
      const res = await multiAgentApi.generateTests(codeSnippet, testFramework, 'UserControllerTest');
      setGeneratedTests(res);
    } catch (e) {
      console.error('Test generation failed', e);
    } finally {
      setTestGenerating(false);
    }
  };

  const handleRunSandbox = async () => {
    if (!generatedTests?.test_code) return;
    setSandboxRunning(true);
    try {
      const res = await multiAgentApi.runSandboxTest(generatedTests.test_code, testFramework);
      setSandboxResult(res);
    } catch (e) {
      console.error('Sandbox test run failed', e);
    } finally {
      setSandboxRunning(false);
    }
  };

  const handleActionApproval = async (id: string, action: 'approve' | 'reject') => {
    setApprovalLoading(true);
    try {
      await multiAgentApi.actionApproval(id, action, `Actioned via Studio by developer`);
      const updated = await multiAgentApi.getApprovals();
      setApprovals(updated);
    } catch (e) {
      console.error('Approval action failed', e);
    } finally {
      setApprovalLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-slate-100 min-h-screen">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-wide">Multi-Agent & Developer Studio</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Module 08
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous Multi-Agent Supervisor • Code Analysis & Review • Test Automation • Safety Governance
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('orchestrator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orchestrator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Supervisor Orchestration</span>
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'developer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Developer Agent</span>
          </button>
          <button
            onClick={() => setActiveTab('qa_testing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'qa_testing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TestTube className="w-4 h-4" />
            <span>QA & Tester Agent</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'approvals'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approvals ({(approvals || []).filter((a) => a.status === 'pending').length})</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: MULTI-AGENT SUPERVISOR & ORCHESTRATION ── */}
      {activeTab === 'orchestrator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Goal Formulation & Live DAG Subtask Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goal Input Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Define Multi-Agent Goal / Task
                </span>
                <span className="text-xs text-slate-500">Autonomous Task Decomposition & DAG Routing</span>
              </div>

              <textarea
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                rows={3}
                placeholder="Describe a software engineering, data analytics, or multi-step workflow..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-medium"
              />

              {/* Quick Template Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Refactor auth endpoint with rate limiting and unit tests',
                  'Analyze revenue SQL schema and generate executive dashboard query',
                  'Audit codebase security against OWASP and multi-tenant isolation',
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserGoal(tmpl)}
                    className="text-[11px] bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
                  >
                    + {tmpl}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    Supervisor: <strong>Gemini Flash Lite</strong>
                  </span>
                  <span>•</span>
                  <span>Active Agents: <strong>{(agents || []).length}</strong></span>
                </div>

                <button
                  onClick={handleLaunchWorkflow}
                  disabled={isExecuting || !userGoal.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs"
                >
                  {isExecuting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isExecuting ? 'Orchestrating Subtasks...' : 'Execute Multi-Agent Workflow'}</span>
                </button>
              </div>
            </div>

            {/* Current Execution DAG & Subtasks */}
            {currentExecution && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{currentExecution.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Execution ID: <span className="font-mono text-slate-300">{currentExecution.id}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        currentExecution.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : currentExecution.status === 'waiting_approval'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {currentExecution.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ⏱️ {currentExecution.total_latency_sec}s | 🪙 {currentExecution.total_tokens} tokens
                    </span>
                  </div>
                </div>

                {/* Subtask Timeline Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Subtask Progression (DAG)</h3>
                  {currentExecution.steps && currentExecution.steps.map((step) => (
                    <div
                      key={step.id}
                      className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mt-0.5 ${
                            step.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : step.status === 'waiting_approval'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}
                        >
                          {step.step_order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{step.task_name}</h4>
                            <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded font-mono">
                              @{step.assigned_agent}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{step.task_description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            step.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : step.status === 'waiting_approval'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-indigo-500/10 text-indigo-400'
                          }`}
                        >
                          {step.status}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          {step.latency_sec}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inter-Agent Communication Bus Terminal */}
                <div className="space-y-2">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    Inter-Agent Communication Bus Stream
                  </span>
                  <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
                    {currentExecution.communication_logs && currentExecution.communication_logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2">
                        <span className="text-slate-500">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                        <span className="text-indigo-400 font-semibold">[{log.sender_agent} → {log.receiver_agent}]</span>
                        <span className="text-purple-300">[{log.message_type}]:</span>
                        <span className="text-slate-300">{log.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Synthesized Output */}
                {currentExecution.final_output?.summary_markdown && (
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supervisor Deliverable</h3>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {currentExecution.final_output.summary_markdown}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Col: Registered Agent Registry Catalog */}
          <div className="space-y-4">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  Agent Registry ({agents.length})
                </h3>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  All Active
                </span>
              </div>

              <div className="space-y-3">
                {(agents || []).map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-400" />
                        {ag.name}
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {ag.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{ag.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {ag.capabilities.slice(0, 3).map((cap, i) => (
                        <span key={i} className="text-[10px] bg-indigo-950/80 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/40">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: DEVELOPER AGENT STUDIO (ANALYSIS, REVIEW, EXPLANATION) ── */}
      {activeTab === 'developer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input & Action Controls */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
                <FileCode className="w-4 h-4" />
                Source Code Editor
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2.5 py-1 rounded-lg focus:outline-none"
                >
                  <option value="php">PHP (Laravel)</option>
                  <option value="typescript">TypeScript (React)</option>
                  <option value="sql">SQL Query</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div>

            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 p-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            />

            {/* Developer Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDevAction('analyze')}
                disabled={devLoading}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  devAction === 'analyze' && !devLoading
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Code Analysis</span>
              </button>
              <button
                onClick={() => handleDevAction('review')}
                disabled={devLoading}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  devAction === 'review' && !devLoading
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Security & Review</span>
              </button>
              <button
                onClick={() => handleDevAction('explain')}
                disabled={devLoading}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  devAction === 'explain' && !devLoading
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explain Code</span>
              </button>
            </div>
          </div>

          {/* Analysis & Review Findings Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              Developer Agent Findings & Diagnostics
            </h3>

            {devLoading && (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <RotateCw className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="text-xs font-semibold">DeveloperAgent analyzing AST & security boundaries...</span>
              </div>
            )}

            {/* Analysis Result */}
            {!devLoading && analysisResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Complexity</span>
                    <p className="text-lg font-black text-indigo-400">{analysisResult.complexity_score} / 10</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Maintainability</span>
                    <p className="text-lg font-black text-emerald-400">{analysisResult.maintainability_rating}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Pattern</span>
                    <p className="text-xs font-bold text-purple-300 mt-1">{analysisResult.architecture_pattern}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Architecture Summary</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {analysisResult.potential_risks?.length > 0 && (
                  <div className="bg-rose-950/30 border border-rose-800/40 p-3.5 rounded-xl space-y-1.5">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Detected Risks
                    </span>
                    <ul className="text-xs text-rose-200 list-disc list-inside space-y-1">
                      {analysisResult.potential_risks.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Review Result */}
            {!devLoading && reviewResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">Quality Score</span>
                    <p className="text-2xl font-black text-emerald-400">{reviewResult.quality_score}%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Verdict</span>
                    <p className="text-sm font-bold text-indigo-300">{reviewResult.verdict}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap">
                  {reviewResult.review_summary_markdown}
                </div>
              </div>
            )}

            {/* Explain Result */}
            {!devLoading && explainResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                {explainResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: QA & TEST AUTOMATION AGENT ── */}
      {activeTab === 'qa_testing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Generation Config */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
                <TestTube className="w-4 h-4" />
                Automated Test Generator
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={testFramework}
                  onChange={(e) => setTestFramework(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2.5 py-1 rounded-lg focus:outline-none"
                >
                  <option value="phpunit">PHPUnit (Laravel)</option>
                  <option value="pest">Pest PHP</option>
                  <option value="vitest">Vitest (React)</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Generates unit, edge-case, and multi-tenant isolation tests with mock setups.
            </p>

            <button
              onClick={handleGenerateTests}
              disabled={testGenerating || !codeSnippet.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              {testGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{testGenerating ? 'Synthesizing Test Suite...' : 'Generate Automated Test Suite'}</span>
            </button>

            {generatedTests && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{generatedTests.test_class_name} ({generatedTests.total_test_cases} cases)</span>
                  <span className="text-[11px] text-emerald-400 font-mono">Estimated Coverage: {generatedTests.estimated_coverage_percent}%</span>
                </div>
                <textarea
                  value={generatedTests.test_code}
                  readOnly
                  rows={10}
                  className="w-full bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 p-3.5 rounded-xl resize-none focus:outline-none"
                />

                <button
                  onClick={handleRunSandbox}
                  disabled={sandboxRunning}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  {sandboxRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{sandboxRunning ? 'Running in Sandbox Runner...' : 'Execute in Sandbox Runner'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Sandbox Test Execution Runner Output */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Sandbox Test Runner & Assertion Metrics
            </h3>

            {sandboxResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Status</span>
                    <p className="text-base font-black text-emerald-400">{sandboxResult.status}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Passed / Total</span>
                    <p className="text-base font-black text-indigo-400">{sandboxResult.passed} / {sandboxResult.total_tests}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Line Coverage</span>
                    <p className="text-base font-black text-purple-400">{sandboxResult.coverage_summary.lines}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                  {sandboxResult.raw_output}
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500 text-xs">
                Generate tests and click "Execute in Sandbox Runner" to inspect assertion metrics and live runner terminal logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: HUMAN-IN-THE-LOOP APPROVALS ── */}
      {activeTab === 'approvals' && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Pending Human-In-The-Loop Approval Requests
            </h3>
            <span className="text-xs text-slate-400 font-medium">Safety Gate for Code Modifications & Multi-Agent Decisions</span>
          </div>

          {approvals.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No pending approval requests. All multi-agent actions are in sync.
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.map((appr) => (
                <div
                  key={appr.id}
                  className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{appr.title}</h4>
                      <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        {appr.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{appr.description}</p>
                    <span className="text-[11px] text-slate-500 font-mono">Action Type: {appr.action_type}</span>
                  </div>

                  {appr.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleActionApproval(appr.id, 'approve')}
                        disabled={approvalLoading}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleActionApproval(appr.id, 'reject')}
                        disabled={approvalLoading}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
