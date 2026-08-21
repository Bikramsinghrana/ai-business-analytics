import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Headphones, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description?: string;
  priority: string;
  status: string;
  customer?: {
    name: string;
    email: string;
  };
  created_at: string;
}

export const SupportTicketListPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/support/tickets');
      const items = res.data?.data || res.data || [];
      setTickets(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch support tickets from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Headphones className="w-7 h-7 text-indigo-400" />
            AI-Assisted Customer Support Queue
          </h1>
          <p className="text-sm text-slate-400">Live support tickets fetched from Laravel Backend</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading support tickets from Laravel backend...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No support tickets found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-semibold text-indigo-400">{t.ticket_number || t.id}</td>
                  <td className="p-3 font-medium text-white">{t.subject}</td>
                  <td className="p-3 text-slate-300">{t.customer?.name || 'Guest'}</td>
                  <td className="p-3">
                    <Badge variant={t.priority === 'HIGH' ? 'danger' : 'warning'}>
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={t.status === 'RESOLVED' ? 'success' : 'purple'}>
                      {t.status}
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
