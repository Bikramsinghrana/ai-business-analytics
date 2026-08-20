import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Headphones } from 'lucide-react';
import { TicketStatus, TicketPriority } from '../../../types/enums';

export const SupportTicketListPage: React.FC = () => {
  const tickets = [
    { id: 'TCK-1001', subject: 'API Authentication Latency', customer: 'Acme Corp', priority: TicketPriority.HIGH, status: TicketStatus.OPEN, date: '2026-08-20' },
    { id: 'TCK-1002', subject: 'Document Embedding Sync Fail', customer: 'Starlight Retail', priority: TicketPriority.URGENT, status: TicketStatus.IN_PROGRESS, date: '2026-08-20' },
    { id: 'TCK-1003', subject: 'Billing Invoice Request', customer: 'Nexus Logistics', priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, date: '2026-08-19' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Headphones className="w-7 h-7 text-indigo-400" />
            AI-Assisted Customer Support Queue
          </h1>
          <p className="text-sm text-slate-400">Manage customer tickets, AI autocompletions & human handoffs</p>
        </div>
      </div>

      <Card>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30">
                <td className="p-3 font-mono font-semibold text-indigo-400">{t.id}</td>
                <td className="p-3 font-medium text-white">{t.subject}</td>
                <td className="p-3 text-slate-300">{t.customer}</td>
                <td className="p-3">
                  <Badge variant={t.priority === TicketPriority.URGENT ? 'danger' : 'warning'}>
                    {t.priority}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant={t.status === TicketStatus.RESOLVED ? 'success' : 'purple'}>
                    {t.status}
                  </Badge>
                </td>
                <td className="p-3 text-slate-400 text-xs">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
