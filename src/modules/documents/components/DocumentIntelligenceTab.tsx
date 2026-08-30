import React, { useState } from 'react';
import { KnowledgeDocument, DocumentAnalysis } from '../types/document.types';
import { 
  Sparkles, 
  BrainCircuit, 
  FileText, 
  Layers, 
  GitCompare, 
  Tag, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check, 
  Code
} from 'lucide-react';
import { ragApi } from '../api/ragApi';

interface Props {
  documents: KnowledgeDocument[];
  onOpenCompare: () => void;
}

export const DocumentIntelligenceTab: React.FC<Props> = ({ documents, onOpenCompare }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [activeTool, setActiveTool] = useState<'summary' | 'schema' | 'classify'>('summary');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [schemaResult, setSchemaResult] = useState<any | null>(null);
  const [classifyResult, setClassifyResult] = useState<any | null>(null);
  const [schemaTemplate, setSchemaTemplate] = useState<string>(
    JSON.stringify(
      {
        effective_date: "string",
        parties_involved: ["string"],
        contract_value: "string or amount",
        key_obligations: ["string"],
        cancellation_clause: "string",
        risk_factors: ["string"]
      },
      null,
      2
    )
  );

  const handleRunSummarize = async () => {
    if (!selectedDocId) return;
    try {
      setLoading(true);
      const res = await ragApi.summarize(selectedDocId);
      setAnalysisResult(res);
    } catch (err) {
      console.error('Summarization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSchemaExtraction = async () => {
    if (!selectedDocId) return;
    try {
      setLoading(true);
      let parsedSchema = {};
      try {
        parsedSchema = JSON.parse(schemaTemplate);
      } catch {
        parsedSchema = { default_extraction: "string" };
      }
      const res = await ragApi.extractSchema(selectedDocId, parsedSchema);
      setSchemaResult(res);
    } catch (err) {
      console.error('Schema extraction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunClassify = async () => {
    if (!selectedDocId) return;
    try {
      setLoading(true);
      const res = await ragApi.classify(selectedDocId);
      setClassifyResult(res);
    } catch (err) {
      console.error('Classification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Selector Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Document Intelligence & Schema Extraction</h3>
            <p className="text-xs text-slate-400">Executive insights, structured entity mining, classification & diff comparison</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCompare}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 flex items-center gap-2 transition-all shadow"
          >
            <GitCompare className="w-4 h-4 text-indigo-400" />
            Compare 2 Documents
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Target Document & Action Tabs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 h-fit">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select Target Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  📄 {d.title} ({d.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 border-t border-slate-800 pt-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select Analysis Task
            </label>
            <button
              onClick={() => setActiveTool('summary')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTool === 'summary'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Executive Summarizer & Insights
            </button>

            <button
              onClick={() => setActiveTool('schema')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTool === 'schema'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              Structured Schema Extractor (JSON)
            </button>

            <button
              onClick={() => setActiveTool('classify')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTool === 'classify'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              Automatic Category Classifier
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTool === 'summary') handleRunSummarize();
              else if (activeTool === 'schema') handleRunSchemaExtraction();
              else handleRunClassify();
            }}
            disabled={loading || !selectedDocId}
            className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Run AI Intelligence Analysis
          </button>
        </div>

        {/* Right Column: Output Viewer */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 min-h-[450px] flex flex-col">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              Intelligence Output Console
            </h4>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-16">
                <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                <span className="text-xs font-medium">Synthesizing document intelligence with Gemini LLM...</span>
              </div>
            ) : activeTool === 'summary' && analysisResult ? (
              <div className="space-y-5">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Executive Summary
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {analysisResult.executive_summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400">Key Insights & Takeaways</h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.key_insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-amber-400">Recommended Action Items</h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.action_items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : activeTool === 'schema' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    JSON Extraction Schema Template (Customizable)
                  </label>
                  <textarea
                    rows={4}
                    value={schemaTemplate}
                    onChange={(e) => setSchemaTemplate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {schemaResult && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400">Extracted Structured JSON Result</h5>
                    <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {JSON.stringify(schemaResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : activeTool === 'classify' && classifyResult ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Primary Classification</span>
                  <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold text-xs rounded-full">
                    {classifyResult.primary_category || 'General'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{classifyResult.reasoning}</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Click "Run AI Intelligence Analysis" to process the selected document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
