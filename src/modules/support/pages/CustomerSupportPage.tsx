import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SupportTicket } from '../types/support.types';
import { supportApi } from '../services/supportApi';
import { TicketInbox } from '../components/TicketInbox';
import { TicketDetailView } from '../components/TicketDetailView';
import { Customer360Drawer } from '../components/Customer360Drawer';
import { CustomerLookupWorkbench } from '../components/CustomerLookupWorkbench';
import { AIAgentStudio } from '../components/AIAgentStudio';
import { FaqKnowledgeManager } from '../components/FaqKnowledgeManager';
import { SupportAnalyticsDashboard } from '../components/SupportAnalyticsDashboard';
import {
  MessageSquare,
  Users,
  Bot,
  HelpCircle,
  BarChart3,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Zap,
  Headphones
} from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'inbox';

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Customer 360 Drawer
  const [drawerCustomerId, setDrawerCustomerId] = useState<string | null>(null);

  // New Ticket Modal
  const [isNewTicketOpen, setIsNewTicketOpen] = useState<boolean>(false);
  const [newSubject, setNewSubject] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');
  const [newPriority, setNewPriority] = useState<string>('MEDIUM');

  useEffect(() => {
    if (currentTab === 'inbox') {
      loadTickets();
    }
  }, [currentTab, statusFilter, priorityFilter, categoryFilter]);

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await supportApi.getTickets({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
      });
      setTickets(res.data);
      if (res.data.length > 0 && !selectedTicket) {
        setSelectedTicket(res.data[0]);
      }
    } catch (err) {
      // silent
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !newDescription.trim()) return;
    try {
      const created = await supportApi.createTicket({
        subject: newSubject,
        description: newDescription,
        category: newCategory,
        priority: newPriority as any,
      });
      setIsNewTicketOpen(false);
      setNewSubject('');
      setNewDescription('');
      loadTickets();
      setSelectedTicket(created);
    } catch (err) {
      alert('Failed to create ticket');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Customer Support Agent</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                Module 10
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-assisted ticketing, Customer 360, SLA telemetry, automated responses & sentiment analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => handleTabChange('inbox')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'inbox'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support Inbox & Tickets</span>
        </button>

        <button
          onClick={() => handleTabChange('customers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'customers'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Customer 360 & Order Lookup</span>
        </button>

        <button
          onClick={() => handleTabChange('ai-agent')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'ai-agent'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Bot className="w-4 h-4 text-pink-400" />
          <span>AI Support Agent Studio</span>
        </button>

        <button
          onClick={() => handleTabChange('faqs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'faqs'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>FAQs & Knowledge Base</span>
        </button>

        <button
          onClick={() => handleTabChange('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            currentTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>SLA & Support Analytics</span>
        </button>
      </div>

      {/* TAB 1: SUPPORT INBOX & TICKETS */}
      {currentTab === 'inbox' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadTickets()}
                placeholder="Search tickets by ID, subject, customer..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="">All Priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              <button
                onClick={loadTickets}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                title="Refresh Tickets"
              >
                <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Master Detail Split Inbox Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              {loadingTickets ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>Loading support tickets...</span>
                </div>
              ) : (
                <TicketInbox
                  tickets={tickets}
                  selectedTicketId={selectedTicket?.id || null}
                  onSelectTicket={(t) => setSelectedTicket(t)}
                  onOpenCustomer360={(cid) => setDrawerCustomerId(cid)}
                />
              )}
            </div>

            <div className="lg:col-span-7">
              {selectedTicket ? (
                <TicketDetailView
                  ticket={selectedTicket}
                  onTicketUpdated={(updated) => {
                    setSelectedTicket(updated);
                    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
                  }}
                  onOpenCustomer360={(cid) => setDrawerCustomerId(cid)}
                />
              ) : (
                <div className="p-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400 h-[78vh] flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="w-8 h-8 text-indigo-400" />
                  <p>Select a support ticket from the inbox list to view thread & AI tools.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER 360 & ORDER LOOKUP */}
      {currentTab === 'customers' && (
        <CustomerLookupWorkbench onOpenCustomer360={(cid) => setDrawerCustomerId(cid)} />
      )}

      {/* TAB 3: AI SUPPORT AGENT STUDIO */}
      {currentTab === 'ai-agent' && (
        <AIAgentStudio />
      )}

      {/* TAB 4: FAQS & KNOWLEDGE BASE */}
      {currentTab === 'faqs' && (
        <FaqKnowledgeManager />
      )}

      {/* TAB 5: SLA & SUPPORT ANALYTICS */}
      {currentTab === 'analytics' && (
        <SupportAnalyticsDashboard />
      )}

      {/* Customer 360 Drawer */}
      <Customer360Drawer
        customerId={drawerCustomerId}
        isOpen={!!drawerCustomerId}
        onClose={() => setDrawerCustomerId(null)}
      />

      {/* Create Support Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Create New Support Ticket
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Summary of customer issue..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="General">General Query</option>
                    <option value="Technical">Technical Support</option>
                    <option value="Billing">Billing & Subscriptions</option>
                    <option value="Shipping">Shipping & Orders</option>
                    <option value="Account">Account & Security</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="API Integration">API & RAG Integration</option>
                    <option value="Enterprise SaaS">Enterprise SaaS</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Full customer issue details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsNewTicketOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateTicket} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
