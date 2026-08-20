import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { TrendingUp } from 'lucide-react';
import { LeadStatus } from '../../../types/enums';

export const SalesLeadListPage: React.FC = () => {
  const leads = [
    { id: '1', name: 'Alexander Vance', email: 'vance@enterprise.io', company: 'Enterprise Corp', score: 94, status: LeadStatus.QUALIFIED },
    { id: '2', name: 'Sophia Martinez', email: 'sophia@techflow.net', company: 'TechFlow Systems', score: 78, status: LeadStatus.CONTACTED },
    { id: '3', name: 'Liam Gallagher', email: 'liam@oasislogistics.com', company: 'Oasis Logistics', score: 62, status: LeadStatus.NEW },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            AI Sales Agent Pipeline
          </h1>
          <p className="text-sm text-slate-400">Automated lead scoring & AI sales qualification</p>
        </div>
      </div>

      <Card>
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
                <td className="p-3">{l.company}</td>
                <td className="p-3">
                  <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {l.score} / 100
                  </span>
                </td>
                <td className="p-3">
                  <Badge variant={l.status === LeadStatus.QUALIFIED ? 'success' : 'purple'}>
                    {l.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
