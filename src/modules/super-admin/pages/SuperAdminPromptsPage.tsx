import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Sparkles,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Tag,
  CheckCircle2,
  Layers,
  Search
} from 'lucide-react';
import { superAdminApi } from '../services/superAdminApi';
import { SystemPromptTemplate } from '../types/superAdmin.types';

export const SuperAdminPromptsPage: React.FC = () => {
  const [prompts, setPrompts] = useState<SystemPromptTemplate[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPromptTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [moduleFilter, setModuleFilter] = useState<string>('');

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getPrompts(moduleFilter || undefined);
      setPrompts(data);
      if (data.length > 0 && !selectedPrompt) {
        setSelectedPrompt(data[0]);
      }
    } catch (err) {
      console.error('Failed to load system prompts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [moduleFilter]);

  const handleSavePrompt = async () => {
    if (!selectedPrompt) return;
    setSaving(true);
    try {
      const updated = await superAdminApi.updatePrompt(selectedPrompt.id, selectedPrompt);
      setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedPrompt(updated);
      alert('System prompt template updated successfully!');
    } catch (err) {
      console.error('Failed to save prompt', err);
      alert('Failed to save system prompt.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePrompt = async () => {
    const title = prompt('Enter Prompt Template Title:', 'Autonomous Customer Support Agent');
    if (!title) return;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const module = prompt('Enter Module Identifier (sales, support, dev, supervisor, bi, cms):', 'support') || 'general';
    try {
      const newPrompt = await superAdminApi.createPrompt({
        title,
        slug,
        module,
        version: '1.0.0',
        prompt_text: `You are the specialized AURA ${title}. Guide the user with high fidelity and verified facts.`,
        is_active: true,
      });
      await loadPrompts();
      setSelectedPrompt(newPrompt);
    } catch (err) {
      console.error('Failed to create prompt', err);
    }
  };

  const handleDeletePrompt = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prompt template?')) return;
    try {
      await superAdminApi.deletePrompt(id);
      await loadPrompts();
      if (selectedPrompt?.id === id) {
        setSelectedPrompt(null);
      }
    } catch (err) {
      console.error('Failed to delete prompt', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              System Prompt Template Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                AI Instructions
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage core persona prompts, agent system instructions, parameter variables, and version history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Agent Modules</option>
            <option value="supervisor">Supervisor & DAG</option>
            <option value="dev">Developer & QA</option>
            <option value="bi">SQL BI Analyst</option>
            <option value="support">Support Agent</option>
            <option value="sales">Sales CRM</option>
          </select>

          <button
            onClick={handleCreatePrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Prompt</span>
          </button>
        </div>
      </div>

      {loading && prompts.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-7 h-7 animate-spin text-pink-400" />
          <p className="text-sm">Loading System Prompts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompts List */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Prompt Templates ({prompts.length})
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {prompts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPrompt(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedPrompt?.id === p.id
                      ? 'bg-pink-950/30 border-pink-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-pink-300">
                      {p.module}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">v{p.version}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{p.title}</h3>
                  <p className="text-[10px] font-mono text-slate-400">{p.slug}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Editor & Details */}
          <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            {selectedPrompt ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedPrompt.title}</h2>
                    <span className="text-xs font-mono text-pink-400">slug: {selectedPrompt.slug}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeletePrompt(selectedPrompt.id)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-950/50 border border-transparent hover:border-red-900 transition-colors"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleSavePrompt}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? 'Saving...' : 'Save Instructions'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Module Area</label>
                    <input
                      type="text"
                      value={selectedPrompt.module}
                      onChange={(e) => setSelectedPrompt({ ...selectedPrompt, module: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Version</label>
                    <input
                      type="text"
                      value={selectedPrompt.version}
                      onChange={(e) => setSelectedPrompt({ ...selectedPrompt, version: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    System Instructions & Guidelines (Markdown)
                  </label>
                  <textarea
                    rows={14}
                    value={selectedPrompt.prompt_text}
                    onChange={(e) => setSelectedPrompt({ ...selectedPrompt, prompt_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500">
                Select a prompt template on the left to edit.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
