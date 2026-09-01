import React, { useState, useEffect } from 'react';
import { SalesLead, SalesOpportunity } from '../types/sales.types';
import { salesApi } from '../services/salesApi';
import {
  TrendingUp,
  UserCheck,
  Plus,
  Sparkles,
  Search,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  RefreshCw,
  Zap,
  Tag
} from 'lucide-react';

export const SalesPipelineKanban: React.FC = () => {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'leads' | 'deals'>('leads');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [qualifyingId, setQualifyingId] = useState<string | null>(null);

  // New Lead Modal State
  const [isNewLeadOpen, setIsNewLeadOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [leadSource, setLeadSource] = useState<string>('Website Inbound');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsRes, opsRes] = await Promise.all([
        salesApi.getLeads({ search: searchQuery }),
        salesApi.getOpportunities(),
      ]);
      setLeads(leadsRes.data || []);
      setOpportunities(opsRes || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleQualifyLead = async (id: string) => {
    try {
      setQualifyingId(id);
      await salesApi.qualifyLead(id);
      await loadData();
    } catch (err) {
      alert('Failed to qualify lead');
    } finally {
      setQualifyingId(null);
    }
  };

  const handleCreateLead = async () => {
    if (!name || !email) return;
    try {
      await salesApi.createLead({
        name,
        email,
        company,
        phone,
        lead_source: leadSource,
      });
      setIsNewLeadOpen(false);
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      loadData();
    } catch (err) {
      alert('Failed to create sales lead');
    }
  };

  const handleStageChange = async (opId: string, newStage: any) => {
    try {
      await salesApi.updateOpportunity(opId, { stage: newStage });
      loadData();
    } catch (err) {
      alert('Failed to update deal stage');
    }
  };

  const dealStages = [
    { key: 'QUALIFICATION', title: 'Qualification', color: 'border-slate-700 bg-slate-900/60' },
    { key: 'PROPOSAL', title: 'Proposal Sent', color: 'border-indigo-500/30 bg-indigo-950/30' },
    { key: 'NEGOTIATION', title: 'Negotiation', color: 'border-purple-500/30 bg-purple-950/30' },
    { key: 'CLOSED_WON', title: 'Closed Won 🎉', color: 'border-emerald-500/30 bg-emerald-950/30' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'leads' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sales Leads & CRM ({leads.length})
            </button>
            <button
              onClick={() => setActiveView('deals')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'deals' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deals Pipeline ({opportunities.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              placeholder="Search leads..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sales Lead</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SALES LEADS TABLE / GRID */}
      {activeView === 'leads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/50 transition-all shadow-xl group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                    {lead.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lead.company || 'Private Business'}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Score: {lead.score}/100
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    lead.qualification_status === 'SALES_QUALIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    lead.qualification_status === 'MARKETING_QUALIFIED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {lead.qualification_status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 border-t border-b border-slate-800/60 py-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Source: {lead.lead_source}</span>
                </div>
              </div>

              {lead.notes && (
                <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
                  "{lead.notes}"
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Added: {new Date(lead.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleQualifyLead(lead.id)}
                  disabled={qualifyingId === lead.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
                  title="Run AI Qualification & Intent Analysis"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${qualifyingId === lead.id ? 'animate-spin' : ''}`} />
                  <span>{qualifyingId === lead.id ? 'AI Scoring...' : 'AI Qualify'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: DEALS PIPELINE KANBAN */}
      {activeView === 'deals' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dealStages.map((stage) => {
            const stageDeals = opportunities.filter((o) => o.stage === stage.key);
            const totalStageValue = stageDeals.reduce((sum, d) => sum + Number(d.value), 0);

            return (
              <div
                key={stage.key}
                className={`p-4 rounded-2xl border ${stage.color} space-y-4 flex flex-col h-[75vh] overflow-hidden`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">{stage.title}</h4>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      ${totalStageValue.toLocaleString()}
                    </span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl space-y-3 shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-white leading-snug">{deal.title}</h5>
                        <span className="text-xs font-extrabold font-mono text-emerald-400">
                          ${Number(deal.value).toLocaleString()}
                        </span>
                      </div>

                      {deal.lead && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{deal.lead.name} ({deal.lead.company || 'Client'})</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-500 font-mono">Prob: {deal.probability}%</span>
                        <select
                          value={deal.stage}
                          onChange={(e) => handleStageChange(deal.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-300 focus:outline-none"
                        >
                          <option value="QUALIFICATION">Qualify</option>
                          <option value="PROPOSAL">Proposal</option>
                          <option value="NEGOTIATION">Negotiate</option>
                          <option value="CLOSED_WON">WON 🎉</option>
                          <option value="CLOSED_LOST">LOST ❌</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Add New Sales Lead
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="TechCorp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsNewLeadOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateLead} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
