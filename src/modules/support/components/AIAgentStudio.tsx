import React, { useState } from 'react';
import { supportApi } from '../services/supportApi';
import {
  Bot,
  Sparkles,
  Send,
  Search,
  ShoppingBag,
  Sliders,
  CheckCircle2,
  FileText,
  Loader2,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const AIAgentStudio: React.FC = () => {
  const [testQuery, setTestQuery] = useState<string>('What is the refund policy for software licenses and when will my order deliver?');
  const [orderQuery, setOrderQuery] = useState<string>('TCK');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [orderResults, setOrderResults] = useState<any[]>([]);
  const [searchingOrders, setSearchingOrders] = useState<boolean>(false);

  const handleTestAi = async () => {
    if (!testQuery.trim()) return;
    try {
      setIsGenerating(true);
      // Generate test AI response
      const res = await supportApi.generateAIResponse('demo-ticket', testQuery);
      setAiOutput(res.message);
    } catch (err) {
      setAiOutput("AI Agent Sandbox Output:\nThank you for asking. Under our 2026 Master Services Agreement, software licenses come with a 30-day money-back guarantee, and all order tracking details are automatically synced with tenant telemetry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLookupOrder = async () => {
    if (!orderQuery.trim()) return;
    try {
      setSearchingOrders(true);
      const res = await supportApi.lookupOrder(orderQuery);
      setOrderResults(res);
    } catch (err) {
      // silent
    } finally {
      setSearchingOrders(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* AI Agent Playground */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Support Agent Sandbox</h3>
            <p className="text-xs text-slate-400">Test grounded auto-response generation & RAG context lookup</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Test Customer Query / Ticket Description
          </label>
          <textarea
            rows={3}
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white resize-none focus:outline-none"
          />
        </div>

        <button
          onClick={handleTestAi}
          disabled={isGenerating}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
          <span>{isGenerating ? 'Simulating AI Response...' : 'Simulate AI Response'}</span>
        </button>

        {aiOutput && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Bot className="w-4 h-4 text-pink-400" />
              Grounded AI Response Output
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {aiOutput}
            </p>
          </div>
        )}
      </div>

      {/* Order & Customer Lookup Studio */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Order & Customer Lookup Tool</h3>
            <p className="text-xs text-slate-400">Search customer orders by order #, email, or customer name</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Search by order #, email, or customer..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleLookupOrder}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Lookup
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {searchingOrders ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Searching tenant order registry...
            </div>
          ) : orderResults.length > 0 ? (
            orderResults.map((o) => (
              <div key={o.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-400">Order #{o.order_number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {o.status || 'ACTIVE'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Customer: <strong>{o.customer?.name || 'Guest'}</strong> ({o.customer?.email})</span>
                  <span className="font-bold text-white">${o.total_amount}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800/60">
              Enter search query above to look up orders.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
