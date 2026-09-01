import React, { useState, useEffect } from 'react';
import { Customer360Profile } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import {
  Users,
  User,
  Search,
  ShoppingBag,
  Ticket,
  Mail,
  Phone,
  Building,
  DollarSign,
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface CustomerLookupWorkbenchProps {
  onOpenCustomer360: (customerId: string) => void;
}

export const CustomerLookupWorkbench: React.FC<CustomerLookupWorkbenchProps> = ({ onOpenCustomer360 }) => {
  const [query, setQuery] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await supportApi.lookupOrder(query);
      setOrders(res);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Customer 360 & Order Lookup Workbench</h3>
            <p className="text-xs text-slate-400">Search customer profiles, total spend telemetry, and recent order transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by customer name, email, phone, or order #..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Searching customer & order telemetry...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">No matching orders or customer profiles found.</p>
          <p className="text-[11px] text-slate-500">Try searching for customer names like "Bikram", "Priya", or order numbers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-3 transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-xs text-indigo-400">Order #{o.order_number}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {o.status || 'PAID'}
                  </span>
                </div>
                <span className="text-sm font-extrabold text-white">${o.total_amount}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    {o.customer?.name || 'Guest Customer'}
                  </span>
                  {o.customer?.id && (
                    <button
                      onClick={() => onOpenCustomer360(o.customer.id)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <span>View 360</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>{o.customer?.email || 'N/A'}</span>
                </div>
              </div>

              {o.items && o.items.length > 0 && (
                <div className="text-[11px] text-slate-400 pt-1">
                  <span className="font-semibold text-slate-500 block mb-0.5">Purchased Items:</span>
                  <p className="truncate text-slate-300">
                    {o.items.map((i: any) => i.product_name || 'Item').join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
