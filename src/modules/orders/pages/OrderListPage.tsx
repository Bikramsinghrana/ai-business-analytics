import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShoppingCart } from 'lucide-react';
import { OrderStatus } from '../../../types/enums';

export const OrderListPage: React.FC = () => {
  const orders = [
    { id: 'ORD-9021', customer: 'Global Technologies', total: '$1,498.00', status: OrderStatus.SHIPPED, date: '2026-08-20' },
    { id: 'ORD-9022', customer: 'Apex Data Labs', total: '$2,499.00', status: OrderStatus.PROCESSING, date: '2026-08-20' },
    { id: 'ORD-9023', customer: 'Vanguard Systems', total: '$499.00', status: OrderStatus.DELIVERED, date: '2026-08-19' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-indigo-400" />
            Customer Orders & Automation
          </h1>
          <p className="text-sm text-slate-400">AI-assisted order status and fulfillment tracking</p>
        </div>
      </div>

      <Card>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/30">
                <td className="p-3 font-mono font-semibold text-indigo-400">{o.id}</td>
                <td className="p-3 font-medium text-white">{o.customer}</td>
                <td className="p-3 font-bold text-white">{o.total}</td>
                <td className="p-3">
                  <Badge variant={o.status === OrderStatus.DELIVERED ? 'success' : 'purple'}>
                    {o.status}
                  </Badge>
                </td>
                <td className="p-3 text-slate-400 text-xs">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
