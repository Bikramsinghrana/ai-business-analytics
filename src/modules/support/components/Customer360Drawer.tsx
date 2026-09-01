import React, { useState, useEffect } from 'react';
import { Customer360Profile } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import {
  X,
  User,
  ShoppingBag,
  Ticket,
  DollarSign,
  Building,
  Mail,
  Phone,
  Clock,
  Loader2,
  PackageCheck
} from 'lucide-react';

interface Customer360DrawerProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  customerId,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<Customer360Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && customerId) {
      loadProfile();
    }
  }, [isOpen, customerId]);

  const loadProfile = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const res = await supportApi.getCustomer360(customerId);
      setProfile(res);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Customer 360 Profile</h3>
              <p className="text-xs text-slate-400">Complete customer history & purchase telemetry</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs font-medium">Fetching Customer 360 Telemetry...</span>
            </div>
          ) : profile ? (
            <>
              {/* Customer Info Card */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{profile.customer.name}</h4>
                  {profile.customer.company && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                      <Building className="w-3 h-3" /> {profile.customer.company}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.customer.email}</span>
                  </div>
                  {profile.customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{(profile.customer.country_code || '+91') + ' ' + profile.customer.phone}</span>
                    </div>
                  )}
                </div>

                {profile.customer.notes && (
                  <div className="p-2.5 bg-slate-900 rounded-xl text-xs text-slate-400 italic">
                    "{profile.customer.notes}"
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Orders</span>
                  <span className="text-base font-extrabold text-white block">{profile.total_orders}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Spent</span>
                  <span className="text-base font-extrabold text-emerald-400 block">${profile.total_spent.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Tickets</span>
                  <span className="text-base font-extrabold text-amber-400 block">{profile.active_tickets_count}</span>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    Recent Orders ({profile.orders.length})
                  </span>
                </div>

                {profile.orders.length > 0 ? (
                  <div className="space-y-2">
                    {profile.orders.map((o) => (
                      <div key={o.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-indigo-400">Order #{o.order_number}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {o.status || 'DELIVERED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Total: <strong className="text-white">${o.total_amount}</strong></span>
                          <span>{new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
                    No orders recorded for this customer.
                  </div>
                )}
              </div>

              {/* Support Tickets History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-purple-400" />
                    Support History ({profile.tickets.length})
                  </span>
                </div>

                {profile.tickets.length > 0 ? (
                  <div className="space-y-2">
                    {profile.tickets.map((t) => (
                      <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-300">{t.ticket_number}</span>
                          <span className="text-[10px] font-bold text-amber-400">{t.status}</span>
                        </div>
                        <p className="text-xs font-semibold text-white truncate">{t.subject}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
                    No past support tickets.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Customer telemetry unavailable.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
