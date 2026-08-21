import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { TrendingUp, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface SalesLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  score: number;
  status: string;
}

export const SalesLeadListPage: React.FC = () => {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/sales/leads');
      const items = res.data?.data || res.data || [];
      setLeads(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch sales leads from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            AI Sales Agent Pipeline
          </h1>
          <p className="text-sm text-slate-400">Live lead scoring & AI sales qualification from Laravel Backend</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading sales leads from Laravel backend...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No sales leads found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Lead Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Company</th>
                <th className="p-3">AI Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{l.name}</td>
                  <td className="p-3 text-slate-400">{l.email}</td>
                  <td className="p-3">{l.company || '-'}</td>
                  <td className="p-3">
                    <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {l.score} / 100
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={l.status === 'QUALIFIED' ? 'success' : 'purple'}>
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};
