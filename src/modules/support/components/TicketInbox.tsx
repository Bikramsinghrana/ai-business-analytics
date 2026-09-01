import React from 'react';
import { SupportTicket } from '../types/support.types';
import {
  MessageSquare,
  Clock,
  UserCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronRight,
  User,
  Tag,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface TicketInboxProps {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticket: SupportTicket) => void;
  onOpenCustomer360: (customerId: string) => void;
}

export const TicketInbox: React.FC<TicketInboxProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onOpenCustomer360,
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><Flame className="w-3 h-3" /> Urgent</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">High</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
    }
  };

  const getSentimentPill = (sentiment: string) => {
    switch (sentiment) {
      case 'Frustrated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">😡 Frustrated</span>;
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">🚨 Urgent</span>;
      case 'Positive':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">😊 Positive</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">😐 Neutral</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Open</span>;
    }
  };

  return (
    <div className="space-y-2 overflow-y-auto max-h-[72vh] custom-scrollbar pr-1">
      {tickets.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No support tickets matching current filters.
        </div>
      ) : (
        tickets.map((t) => {
          const isSelected = t.id === selectedTicketId;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-bold text-indigo-400">{t.ticket_number}</span>
                  {getPriorityBadge(t.priority)}
                  {getStatusBadge(t.status)}
                  {t.is_escalated && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                      Escalated
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 transition-colors">
                  {t.subject}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {t.ai_summary || t.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (t.customer_id) onOpenCustomer360(t.customer_id);
                    }}
                    className="text-slate-300 hover:text-indigo-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{t.customer?.name || 'Guest Customer'}</span>
                  </button>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{t.category || 'General'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getSentimentPill(t.sentiment)}
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
