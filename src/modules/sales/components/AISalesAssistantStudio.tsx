import React, { useState } from 'react';
import { salesApi } from '../services/salesApi';
import {
  Sparkles,
  Bot,
  ShoppingCart,
  Send,
  Package,
  Zap,
  TrendingUp,
  Tag,
  DollarSign,
  CheckCircle2,
  Gift
} from 'lucide-react';

export const AISalesAssistantStudio: React.FC = () => {
  const [query, setQuery] = useState<string>('Need high performance edge computing hardware for video analytics');
  const [loadingRecs, setLoadingRecs] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  // Cart Assistance State
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'AURA AI Edge Server Pro X1', price: 3499.00, qty: 1 },
  ]);
  const [cartAssistance, setCartAssistance] = useState<any>(null);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);

  const handleFetchRecommendations = async () => {
    try {
      setLoadingRecs(true);
      const res = await salesApi.getAIProductRecommendations(query);
      setRecommendations(res);
    } catch (err) {
      alert('Failed to fetch AI product recommendations');
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleFetchCartAssistance = async () => {
    try {
      setLoadingCart(true);
      const res = await salesApi.getCartAssistance(cartItems);
      setCartAssistance(res);
    } catch (err) {
      alert('Failed to get cart assistance');
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: AI Product Recommendations Engine */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Product Recommendation Assistant</h3>
            <p className="text-xs text-slate-400">Grounded catalog recommendations based on intent</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">Customer Intent Query</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Enterprise RAG vector engine or hardware..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleFetchRecommendations}
              disabled={loadingRecs}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex-shrink-0 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loadingRecs ? 'animate-spin text-amber-400' : ''}`} />
              <span>{loadingRecs ? 'Analyzing...' : 'Recommend'}</span>
            </button>
          </div>
        </div>

        {recommendations ? (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
              Top AI Matches ({recommendations.recommendations?.length || 0})
            </h4>

            <div className="space-y-3">
              {recommendations.recommendations?.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold text-white">{item.name || `Recommendation #${idx + 1}`}</h5>
                    {item.price && (
                      <span className="text-xs font-bold font-mono text-emerald-400">${item.price}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{item.reason}</p>
                  {item.cross_sell_tip && (
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold">
                      💡 Cross-sell Tip: {item.cross_sell_tip}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Click 'Recommend' to test the AI product matching engine against active catalog items.
          </div>
        )}
      </div>

      {/* RIGHT: AI Shopping Cart Assistant Sandbox */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Cart Assistance & Upsell Engine</h3>
            <p className="text-xs text-slate-400">Checkout optimization & discount offers</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300">Active Cart Sandbox</h4>
          <div className="space-y-2">
            {cartItems.map((ci) => (
              <div key={ci.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-white font-bold">{ci.name}</span>
                <span className="font-mono text-emerald-400 font-bold">${ci.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleFetchCartAssistance}
            disabled={loadingCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-amber-400 ${loadingCart ? 'animate-spin' : ''}`} />
            <span>{loadingCart ? 'Analyzing Cart...' : 'Run Cart AI Assistant'}</span>
          </button>
        </div>

        {cartAssistance && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 space-y-1">
              <span className="font-bold block">✨ Cart Advice:</span>
              <p>{cartAssistance.cart_summary}</p>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 space-y-1">
              <span className="font-bold block">🚀 Upsell Suggestion:</span>
              <p>{cartAssistance.upsell_suggestion}</p>
            </div>

            {cartAssistance.discount_code_offer && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4" /> Recommended Promo:
                </span>
                <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  {cartAssistance.discount_code_offer}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
