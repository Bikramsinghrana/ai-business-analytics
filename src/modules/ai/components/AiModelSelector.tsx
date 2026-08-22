import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AIProvider } from '../../../types/enums';
import { AI_PROVIDERS_CONFIG } from '../constants/aiConstants';
import { Cpu, ChevronDown, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface AiModelSelectorProps {
  value: AIProvider;
  onChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

export const AiModelSelector: React.FC<AiModelSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = AI_PROVIDERS_CONFIG[value] || AI_PROVIDERS_CONFIG[AIProvider.GEMINI];

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        right: Math.max(12, window.innerWidth - rect.right),
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
        <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/30 transition flex-shrink-0">
          <Cpu className="w-3.5 h-3.5" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-tight">
              {selected.name}
            </span>
            {selected.isFree ? (
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Free
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Pro
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      {/* Render via Portal to document.body so overflow-hidden doesn't clip it and background is 100% solid */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              right: `${coords.right}px`,
              zIndex: 99999,
            }}
            className="w-80 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto custom-scrollbar"
          >
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Select AI Engine
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Free Endpoints Active
              </span>
            </div>

            <div className="space-y-1">
              {Object.values(AI_PROVIDERS_CONFIG).map((provider) => {
                const isSelected = provider.key === value;
                return (
                  <button
                    key={provider.key}
                    type="button"
                    onClick={() => {
                      onChange(provider.key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/50 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {provider.isFree ? <Zap className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {provider.name}
                          </span>
                          {provider.isFree ? (
                            <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Free
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Pro API
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {provider.description}
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