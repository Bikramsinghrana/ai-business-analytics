import React, { useState, useRef, useEffect } from 'react';
import { SearchType } from '../types/ai.types';
import { SEARCH_TYPE_OPTIONS, SearchTypeOption } from '../constants/aiConstants';
import {
  Sparkles,
  MessageSquare,
  FolderGit2,
  Newspaper,
  Trophy,
  TrendingUp,
  CloudSun,
  Globe,
  FileText,
  Database,
  ShoppingBag,
  Code,
  ChevronDown,
  Check,
} from 'lucide-react';

interface SearchTypeSelectorProps {
  value: SearchType;
  onChange: (type: SearchType) => void;
  disabled?: boolean;
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  MessageSquare,
  FolderGit2,
  Newspaper,
  Trophy,
  TrendingUp,
  CloudSun,
  Globe,
  FileText,
  Database,
  ShoppingBag,
  Code,
};

export const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption: SearchTypeOption =
    SEARCH_TYPE_OPTIONS.find((opt) => opt.value === value) || SEARCH_TYPE_OPTIONS[0];

  const SelectedIcon = ICONS[selectedOption.iconName] || Sparkles;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-xs text-slate-200 font-semibold transition focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-sm disabled:opacity-50 group"
      >
        <div className="p-1 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600/30 transition">
          <SelectedIcon className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <span className="block text-[11px] font-bold text-white leading-tight">
            {selectedOption.label}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Select Active Search Domain</span>
            <span className="text-indigo-400 lowercase text-[9px]">click to activate</span>
          </div>
          {SEARCH_TYPE_OPTIONS.map((opt) => {
            const Icon = ICONS[opt.iconName] || Sparkles;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate leading-snug">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
