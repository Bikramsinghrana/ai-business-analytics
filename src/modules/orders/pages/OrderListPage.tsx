import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface OrderItem {
  id: string;
  order_number: string;
  total_amount: string | number;
  status: string;
  payment_status: string;
  fulfillment_status?: string;
  customer?: {
    name: string;
    email: string;
  };
  created_at: string;
}

export const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/orders');
      const items = res.data?.data || res.data || [];
      setOrders(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch orders from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-indigo-400" />
            Customer Orders & Automation
          </h1>
          <p className="text-sm text-slate-400">Live order status and fulfillment tracking from Laravel Backend</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading orders from Laravel backend...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No orders found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-semibold text-indigo-400">{o.order_number}</td>
                  <td className="p-3 font-medium text-white">{o.customer?.name || 'Guest'}</td>
                  <td className="p-3 font-bold text-white">${Number(o.total_amount).toFixed(2)}</td>
                  <td className="p-3">
                    <Badge variant={o.payment_status === 'PAID' ? 'success' : 'warning'}>
                      {o.payment_status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={o.status === 'COMPLETED' ? 'success' : 'purple'}>
                      {o.status}
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
