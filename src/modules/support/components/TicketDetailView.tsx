import React, { useState, useEffect } from 'react';
import { SupportTicket, TicketMessage } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  Clock,
  RefreshCw,
  Zap,
  MessageSquare,
  AlertCircle,
  UserCheck,
  Tag
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: SupportTicket;
  onTicketUpdated: (updated: SupportTicket) => void;
  onOpenCustomer360: (customerId: string) => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  onTicketUpdated,
  onOpenCustomer360,
}) => {
  const [replyText, setReplyText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  useEffect(() => {
    loadSuggestions();
  }, [ticket.id]);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await supportApi.getSuggestions(ticket.id);
      setSuggestions(res);
    } catch (err) {
      // silent
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      setIsSending(true);
      await supportApi.addMessage(ticket.id, {
        message: replyText,
        sender_type: 'HUMAN_AGENT',
        sender_name: 'Human Agent',
        status: ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status,
      });
      setReplyText('');
      const updated = await supportApi.getTicketById(ticket.id);
      onTicketUpdated(updated);
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateAIResponse = async () => {
    try {
      setIsGeneratingAI(true);
      await supportApi.generateAIResponse(ticket.id);
      const updated = await supportApi.getTicketById(ticket.id);
      onTicketUpdated(updated);
    } catch (err) {
      alert('Failed to generate AI support response');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAnalyzeTicket = async () => {
    try {
      setIsAnalyzing(true);
      const result = await supportApi.classifyTicket(ticket.id);
      if (result && result.id) {
        onTicketUpdated(result);
      } else {
        const updated = await supportApi.getTicketById(ticket.id);
        onTicketUpdated(updated);
      }
    } catch (err) {
      alert('Failed to analyze ticket sentiment');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanHandoff = async () => {
    try {
      const note = prompt('Enter escalation note for human agent:');
      if (note === null) return;
      const updated = await supportApi.humanHandoff(ticket.id, note);
      onTicketUpdated(updated);
    } catch (err) {
      alert('Failed to perform human handoff');
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    try {
      const updated = await supportApi.updateTicket(ticket.id, { status: newStatus });
      onTicketUpdated(updated);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[80vh] overflow-hidden shadow-2xl">
      
      {/* Sleek Ultra-Clean Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Title & Ticket ID */}
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <h3 className="text-sm font-extrabold text-white truncate">{ticket.subject}</h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
              {ticket.ticket_number}
            </span>
          </div>

          {/* Action Tools & Status Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleAnalyzeTicket}
              disabled={isAnalyzing}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
              title="Run AI Sentiment & Category Analysis"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
            </button>

            <button
              onClick={handleHumanHandoff}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Escalate</span>
            </button>

            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="WAITING_ON_CUSTOMER">WAITING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

        </div>

        {/* Compact Horizontal Meta Badges */}
        <div className="flex items-center gap-3 text-xs flex-wrap text-slate-400 pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1 text-slate-300 font-semibold">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <strong
              onClick={() => ticket.customer_id && onOpenCustomer360(ticket.customer_id)}
              className="text-indigo-300 hover:underline cursor-pointer"
            >
              {ticket.customer?.name || 'Guest Customer'}
            </strong>
          </span>

          <span className="text-slate-600">•</span>

          <span className="flex items-center gap-1 text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {ticket.category || 'General'}
            </span>
          </span>

          <span className="text-slate-600">•</span>

          <span className="flex items-center gap-1 text-slate-300">
            <span>Sentiment:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {ticket.sentiment || 'Neutral'} ({Math.round((ticket.sentiment_score || 0.5) * 100)}%)
            </span>
          </span>

          {ticket.sla_due_at && (
            <>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                SLA Due: {new Date(ticket.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Optional AI Summary Ribbon */}
      {ticket.ai_summary && (
        <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-300">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="truncate"><strong>AI Summary:</strong> {ticket.ai_summary}</p>
        </div>
      )}

      {/* Main Conversation Thread - Spans Full Remaining Vertical Height */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-slate-950/40">
        {ticket.messages && ticket.messages.length > 0 ? (
          ticket.messages.map((m) => {
            const isCustomer = m.sender_type === 'CUSTOMER';
            const isAI = m.sender_type === 'AI_AGENT';
            const isSystem = m.sender_type === 'SYSTEM';

            if (isSystem) {
              return (
                <div key={m.id} className="flex justify-center my-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 border border-amber-500/20 flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {m.message}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[82%] ${isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-md ${
                  isCustomer ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                  isAI ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isCustomer ? <User className="w-4 h-4" /> : isAI ? <Bot className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isCustomer ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-200">{m.sender_name || (isCustomer ? 'Customer' : isAI ? 'AURA AI Agent' : 'Support Staff')}</span>
                    <span>•</span>
                    <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isCustomer ? 'bg-slate-900 border border-slate-800 text-slate-100' :
                    isAI ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-purple-500/30 text-white' :
                    'bg-indigo-600 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No messages recorded in this support thread yet.
          </div>
        )}
      </div>

      {/* AI Smart Reply Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 space-y-1.5 flex-shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              AI Smart Reply Suggestions (Click to insert)
            </span>
            <button onClick={loadSuggestions} className="hover:text-white transition-colors">
              <RefreshCw className={`w-3 h-3 ${loadingSuggestions ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setReplyText(s)}
                className="p-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-[11px] text-slate-300 line-clamp-2 transition-all shadow-sm"
                title={s}
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Response Input Controls Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleGenerateAIResponse}
          disabled={isGeneratingAI}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex-shrink-0 disabled:opacity-50"
          title="Auto-generate grounded AI support response using Knowledge Base & Orders"
        >
          <Bot className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAI ? 'Replying...' : 'AI Auto-Reply'}</span>
        </button>

        <textarea
          rows={2}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your response to the customer..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 resize-none focus:outline-none shadow-inner"
        />

        <button
          onClick={handleSendReply}
          disabled={isSending || !replyText.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>

    </div>
  );
};
