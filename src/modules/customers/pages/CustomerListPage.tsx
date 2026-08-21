import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Users, Search, Phone, Mail, Building, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  country_code?: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: string;
}

export const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/customers', { params: { search } });
      const items = res.data?.data || res.data || [];
      setCustomers(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch customers from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-400" />
            Customer Management Directory
          </h1>
          <p className="text-sm text-slate-400">Live customer records fetched from Laravel Backend</p>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading customers from Laravel backend...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No customers found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Company</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{c.name}</td>
                  <td className="p-3 text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {c.email}
                  </td>
                  <td className="p-3 font-mono text-xs text-indigo-300">
                    {c.phone ? `${c.country_code || '+91'} ${c.phone}` : '-'}
                  </td>
                  <td className="p-3 text-slate-300">
                    {c.company ? (
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {c.company}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-3">
                    <Badge variant="success">Active Client</Badge>
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
