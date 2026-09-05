import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Radio, 
  Gauge, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { AiSettings } from '../types/ai.types';
import { useToast } from '../../../context/ToastContext';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (settings: AiSettings) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'keys' | 'system'>('general');
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await aiApi.getSettings();
      if (res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err: any) {
      toast.error('Failed to load settings', err.message || 'Could not retrieve AI settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const res = await aiApi.updateSettings(settings);
      if (res.data?.settings) {
        setSettings(res.data.settings);
        if (onSettingsSaved) {
          onSettingsSaved(res.data.settings);
        }
      }
      toast.success('Settings Saved', 'AI configuration updated successfully.');
      onClose();
    } catch (err: any) {
      toast.error('Save failed', err.message || 'Error updating AI settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">AI Assistant & Provider Settings</h2>
              <p className="text-xs text-slate-400">Configure LLM models, API keys, temperature, memory, and system prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 gap-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Model & Parameters</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>System Prompt & Memory</span>
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Provider API Keys</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {loading || !settings ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading AI configuration...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: General Model & Params */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Default AI Provider
                      </label>
                      <select
                        value={settings.default_provider}
                        onChange={(e) => setSettings({ ...settings, default_provider: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="GEMINI">Google Gemini (Free Tier)</option>
                        <option value="OPENAI">OpenAI (GPT-4o)</option>
                        <option value="GROQ">Groq LPU (Ultra-Fast)</option>
                        <option value="CLAUDE">Anthropic Claude</option>
                        <option value="OPENROUTER">OpenRouter (Multi-Model)</option>
                        <option value="OLLAMA">Ollama (Local Free)</option>
                        <option value="AURA">AURA Multi-Agent Core</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Default Model Identifier
                      </label>
                      <input
                        type="text"
                        value={settings.default_model}
                        onChange={(e) => setSettings({ ...settings, default_model: e.target.value })}
                        placeholder="e.g. gemini-3.7-flash, gpt-4o"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        Temperature: <span className="text-white font-mono">{settings.temperature}</span>
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {settings.temperature <= 0.3 ? '🎯 Precise & Deterministic' : settings.temperature <= 0.7 ? '⚖️ Balanced' : '🎨 Highly Creative'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.temperature}
                      onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Max Tokens & Rate Limit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Max Output Tokens
                      </label>
                      <input
                        type="number"
                        min="256"
                        max="8192"
                        step="256"
                        value={settings.max_tokens}
                        onChange={(e) => setSettings({ ...settings, max_tokens: parseInt(e.target.value) || 4096 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-[10px] text-slate-500">Max tokens per single AI generation.</p>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-amber-400" />
                        Rate Limit (RPM)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="500"
                        value={settings.rate_limit_rpm}
                        onChange={(e) => setSettings({ ...settings, rate_limit_rpm: parseInt(e.target.value) || 60 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-[10px] text-slate-500">Max requests per minute per tenant.</p>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                      <span className="text-xs font-medium text-slate-300">
                        ⚡ Real-Time SSE Streaming
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.streaming_enabled}
                        onChange={(e) => setSettings({ ...settings, streaming_enabled: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                      <span className="text-xs font-medium text-slate-300">
                        🧠 Contextual AI Memory
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.memory_enabled}
                        onChange={(e) => setSettings({ ...settings, memory_enabled: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: System Prompt */}
              {activeTab === 'system' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Default System Prompt</span>
                      <span className="text-[10px] text-indigo-400 font-normal">Instructions given to every AI agent</span>
                    </label>
                    <textarea
                      rows={6}
                      value={settings.system_prompt}
                      onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
                      placeholder="You are AURA, an elite AI Business Automation Copilot..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Preset Persona Quick-Inject:</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        You can also switch personas (Architect, BI Analyst, Support, Sales) per message directly in the chat bar without modifying this global default.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Provider API Keys */}
              {activeTab === 'keys' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-relaxed">
                      Custom keys override system defaults. Keys are securely stored and encrypted at rest. If left blank, the platform uses default configured keys.
                    </p>
                  </div>

                  {['gemini', 'openai', 'claude', 'groq', 'openrouter'].map((providerKey) => {
                    const isShown = showKeys[providerKey];
                    const val = settings.api_keys[providerKey as keyof typeof settings.api_keys] || '';

                    return (
                      <div key={providerKey} className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          {providerKey} API Key
                        </label>
                        <div className="relative">
                          <input
                            type={isShown ? 'text' : 'password'}
                            value={val}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                api_keys: {
                                  ...settings.api_keys,
                                  [providerKey]: e.target.value,
                                },
                              })
                            }
                            placeholder={`Enter ${providerKey.toUpperCase()} API Key`}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white pr-10 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowKey(providerKey)}
                            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                          >
                            {isShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            onClick={fetchSettings}
            disabled={loading || saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
