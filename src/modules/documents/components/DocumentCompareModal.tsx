import React, { useState } from 'react';
import { KnowledgeDocument } from '../types/document.types';
import { 
  X, 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { ragApi } from '../api/ragApi';

interface Props {
  documents: KnowledgeDocument[];
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentCompareModal: React.FC<Props> = ({ documents, isOpen, onClose }) => {
  const [docA, setDocA] = useState<string>(documents[0]?.id || '');
  const [docB, setDocB] = useState<string>(documents[1]?.id || documents[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleCompare = async () => {
    if (!docA || !docB) return;
    try {
      setLoading(true);
      const res = await ragApi.compare(docA, docB);
      setComparisonResult(res);
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Document Comparison & Clause Diff Engine</h2>
              <p className="text-xs text-slate-400">Analyze discrepancies, omitted terms, and modifications between 2 documents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Document A (Base Reference)</label>
            <select
              value={docA}
              onChange={(e) => setDocA(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.version})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-indigo-400">
            <ArrowRight className="w-5 h-5 hidden md:block" />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Document B (Comparison Target)</label>
            <select
              value={docB}
              onChange={(e) => setDocB(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.version})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 flex justify-end">
            <button
              onClick={handleCompare}
              disabled={loading || !docA || !docB}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Compare Documents
            </button>
          </div>
        </div>

        {/* Comparison Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-400" />
              <p className="text-xs">Analyzing semantic clauses, contract modifications & term diffs...</p>
            </div>
          ) : comparisonResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Executive Comparison Summary
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {comparisonResult.comparison?.executive_comparison_summary ||
                    'Analyzed clause differences, mutual requirements, and terms.'}
                </p>
              </div>

              {comparisonResult.comparison?.key_differences && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Key Discrepancies & Modifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {Array.isArray(comparisonResult.comparison.key_differences) &&
                      comparisonResult.comparison.key_differences.map((diff: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span>{typeof diff === 'string' ? diff : JSON.stringify(diff)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              Select 2 documents above and click "Compare Documents".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
