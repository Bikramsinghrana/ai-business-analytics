import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

const ACCENT: Record<string, string> = {
  AUTO: 'text-indigo-400 bg-indigo-600/20',
  PROJECT: 'text-violet-400 bg-violet-600/20',
  SPORTS: 'text-emerald-400 bg-emerald-600/20',
  FINANCE: 'text-yellow-400 bg-yellow-600/20',
  BUSINESS_DATA: 'text-blue-400 bg-blue-600/20',
  ECOMMERCE: 'text-pink-400 bg-pink-600/20',
  NEWS: 'text-orange-400 bg-orange-600/20',
  WEATHER: 'text-sky-400 bg-sky-600/20',
  WEB: 'text-cyan-400 bg-cyan-600/20',
  KNOWLEDGE: 'text-rose-400 bg-rose-600/20',
  GENERAL: 'text-slate-400 bg-slate-700/40',
  DEVELOPER: 'text-violet-400 bg-violet-600/20',
};

export const SearchTypeSelector: React.FC<SearchTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption: SearchTypeOption =
    SEARCH_TYPE_OPTIONS.find((opt) => opt.value === value) || SEARCH_TYPE_OPTIONS[0];

  const SelectedIcon = ICONS[selectedOption.iconName] || Sparkles;
  const selectedAccent = ACCENT[selectedOption.value] || ACCENT.AUTO;

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const left = Math.min(rect.left, window.innerWidth - 300);
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(12, left),
      });
    }
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      updateCoords();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      // Ignore scroll events originating from inside the dropdown itself so users can scroll the options list!
      if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleResize = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl text-xs text-slate-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-md group disabled:opacity-50"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition ${selectedAccent}`}>
          <SelectedIcon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold text-white hidden sm:block">{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      {/* Render via Portal to document.body so background is 100% solid and z-index is top */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[70vh] flex flex-col"
          >
            <div className="px-3 py-2 flex items-center justify-between bg-slate-850 border-b border-slate-800 flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Search Domain
              </span>
              <span className="text-[9px] text-indigo-400 font-semibold">click to activate</span>
            </div>

            <div className="p-1.5 overflow-y-auto space-y-0.5 custom-scrollbar flex-1">
              {SEARCH_TYPE_OPTIONS.map((opt) => {
                const Icon = ICONS[opt.iconName] || Sparkles;
                const isSelected = opt.value === value;
                const accent = ACCENT[opt.value] || ACCENT.AUTO;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/25 border border-indigo-500/50'
                        : 'border border-transparent hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-indigo-500 text-white' : accent
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-indigo-200' : 'text-slate-100'
                          }`}
                        >
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};