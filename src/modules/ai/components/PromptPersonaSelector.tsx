import React, { useState } from 'react';
import { Bot, Cpu, BarChart3, Headphones, TrendingUp, Sparkles, ChevronDown, Check } from 'lucide-react';
import { PromptPersona } from '../types/ai.types';

interface PromptPersonaSelectorProps {
  selectedPersonaId: string;
  onSelectPersona: (persona: PromptPersona) => void;
  personas?: PromptPersona[];
}

const DEFAULT_PERSONAS: PromptPersona[] = [
  {
    id: 'general',
    name: 'AURA Executive Copilot',
    description: 'Universal enterprise intelligence & automation',
    icon: 'Bot',
    system_prompt: 'You are AURA, an elite AI Business Automation Copilot. Provide concise, high-value, structured business responses with actionable insights.',
  },
  {
    id: 'architect',
    name: 'Senior Full-Stack Architect',
    description: 'TypeScript, clean architecture, system design',
    icon: 'Cpu',
    system_prompt: 'You are a Principal Software Engineer and Full-Stack Architect. Analyze code rigorously, use TypeScript best practices, design patterns, and provide production-ready solutions with complete explanations.',
  },
  {
    id: 'bi_analyst',
    name: 'Financial & SQL Data Analyst',
    description: 'SQL queries, revenue metrics & KPI forecasts',
    icon: 'BarChart3',
    system_prompt: 'You are a Senior Data Analyst and BI Specialist. Provide comprehensive SQL query explanations, statistical summaries, revenue growth calculations, and executive KPI reports.',
  },
  {
    id: 'support_expert',
    name: 'Customer Success Specialist',
    description: 'Ticket triage, empathy & customer retention',
    icon: 'Headphones',
    system_prompt: 'You are a tier-3 Customer Success Specialist. Communicate empathetically, clarify client questions proactively, and formulate polite, professional customer resolutions.',
  },
];

export const PromptPersonaSelector: React.FC<PromptPersonaSelectorProps> = ({
  selectedPersonaId,
  onSelectPersona,
  personas = DEFAULT_PERSONAS,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activePersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-3.5 h-3.5 text-pink-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Bot className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800/80 shadow-sm"
      >
        {getIcon(activePersona.icon)}
        <span className="truncate max-w-[140px]">{activePersona.name}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 bottom-full mb-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
            <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Select System Persona</span>
            </div>

            {personas.map((p) => {
              const isSelected = p.id === activePersona.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPersona(p);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="mt-0.5">{getIcon(p.icon)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {p.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
