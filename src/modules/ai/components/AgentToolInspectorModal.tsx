import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Wrench, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Search, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Terminal,
  Layers
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { AgentMeta, ToolMeta } from '../types/ai.types';
import { useToast } from '../../../context/ToastContext';

interface AgentToolInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentToolInspectorModal: React.FC<AgentToolInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'tools'>('agents');
  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [tools, setTools] = useState<ToolMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [toolParams, setToolParams] = useState<string>('{\n  "query": "AAPL"\n}');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchRegistries();
    }
  }, [isOpen]);

  const fetchRegistries = async () => {
    try {
      setLoading(true);
      const [agentsRes, toolsRes] = await Promise.all([
        aiApi.getAgents(),
        aiApi.getTools(),
      ]);

      if (agentsRes.data?.agents) {
        setAgents(agentsRes.data.agents);
      }
      if (toolsRes.data?.tools) {
        setTools(toolsRes.data.tools);
        if (toolsRes.data.tools.length > 0 && !selectedTool) {
          setSelectedTool(toolsRes.data.tools[0].name);
        }
      }
    } catch (err: any) {
      toast.error('Failed to load registries', err.message || 'Error fetching agents and tools.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTool = async () => {
    if (!selectedTool) return;

    let parsedParams: Record<string, any> = {};
    try {
      if (toolParams.trim()) {
        parsedParams = JSON.parse(toolParams);
      }
    } catch (e: any) {
      toast.error('Invalid JSON', 'Please format tool parameters as valid JSON.');
      return;
    }

    try {
      setExecuting(true);
      setExecutionResult(null);
      const res = await aiApi.executeTool(selectedTool, parsedParams);
      setExecutionResult(res.data?.data || res.data);
      toast.success('Tool Executed', `Executed ${selectedTool} successfully.`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Execution failed';
      setExecutionResult({ error: errMsg });
      toast.error('Tool Execution Failed', errMsg);
    } finally {
      setExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-600/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">Agent & Tool Inspection Console</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Registry
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect registered specialized agents, live tools, and run test executions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRegistries}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Refresh registries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'agents'
                ? 'border-indigo-500 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            Specialized Agents
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300">
              {agents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'tools'
                ? 'border-indigo-500 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            Registered Tools & Runner
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300">
              {tools.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900/60">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400">Querying Agent & Tool Registries...</p>
            </div>
          ) : activeTab === 'agents' ? (
            /* Agents Registry Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">
                          {agent.name}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
                      Supported Search Domains
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.supported_search_types.map((st) => (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Tools Registry & Direct Execution Runner */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Tool List */}
              <div className="lg:col-span-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Registered Capabilities ({tools.length})
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                  {tools.map((tool) => {
                    const isSelected = selectedTool === tool.name;
                    return (
                      <button
                        key={tool.name}
                        onClick={() => {
                          setSelectedTool(tool.name);
                          setExecutionResult(null);
                          if (tool.name === 'market_data_tool') {
                            setToolParams('{\n  "query": "AAPL"\n}');
                          } else if (tool.name === 'weather_data_tool') {
                            setToolParams('{\n  "location": "New York"\n}');
                          } else if (tool.name === 'business_database_tool') {
                            setToolParams('{\n  "prompt": "check inventory stock and revenue"\n}');
                          } else {
                            setToolParams('{\n  "query": "technology"\n}');
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col space-y-1.5 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md shadow-indigo-600/10'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wrench className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {tool.name}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Execution Console */}
              <div className="lg:col-span-7 flex flex-col space-y-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Direct Tool Runner</span>
                    <code className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                      POST /api/v1/ai/tools/execute
                    </code>
                  </div>

                  <button
                    onClick={handleExecuteTool}
                    disabled={executing || !selectedTool}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white transition shadow-sm"
                  >
                    <Play className={`w-3 h-3 ${executing ? 'animate-spin' : ''}`} />
                    <span>{executing ? 'Executing...' : 'Run Tool'}</span>
                  </button>
                </div>

                {/* Parameters Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>Input Parameters (JSON payload)</span>
                    <span className="text-[10px] text-slate-500 font-mono">Tool: {selectedTool}</span>
                  </label>
                  <textarea
                    rows={4}
                    value={toolParams}
                    onChange={(e) => setToolParams(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
                    placeholder='{"query": "..."}'
                  />
                </div>

                {/* Execution Output */}
                <div className="flex-1 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>Execution Output</span>
                    {executionResult && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        executionResult.error ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {executionResult.error ? 'Failed' : 'Success'}
                      </span>
                    )}
                  </div>

                  <div className="h-[210px] overflow-y-auto custom-scrollbar bg-slate-900/90 border border-slate-800 rounded-xl p-3 font-mono text-xs">
                    {executing ? (
                      <div className="h-full flex items-center justify-center text-slate-500 gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>Running tool through ToolExecutor...</span>
                      </div>
                    ) : executionResult ? (
                      <pre className="text-slate-300 whitespace-pre-wrap text-[11px]">
                        {JSON.stringify(executionResult, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                        <Play className="w-6 h-6 mb-1 text-slate-600" />
                        <p className="text-xs">Click "Run Tool" to test live API execution and inspect response payload.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AURA Agentic Intelligence & Dynamic Tool Dispatch Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
