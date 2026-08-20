import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Plus, Search, Package } from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const products = [
    { id: '1', name: 'Smart AI Camera Module', sku: 'CAM-AURA-01', price: '$249.00', stock: 45, status: 'IN_STOCK' },
    { id: '2', name: 'IoT Edge Sensor Gateway', sku: 'GW-IOT-99', price: '$499.00', stock: 12, status: 'LOW_STOCK' },
    { id: '3', name: 'Enterprise Neural Processor', sku: 'NP-SAAS-00', price: '$1,299.00', stock: 88, status: 'IN_STOCK' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-400" />
            Tenant Inventory & Products
          </h1>
          <p className="text-sm text-slate-400">Manage catalog products and AI recommendation metadata</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <Card className="space-y-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Product Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-white">{p.name}</td>
                <td className="p-3 font-mono text-slate-400 text-xs">{p.sku}</td>
                <td className="p-3 font-bold text-white">{p.price}</td>
                <td className="p-3">{p.stock} units</td>
                <td className="p-3">
                  <Badge variant={p.status === 'IN_STOCK' ? 'success' : 'warning'}>
                    {p.status}
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
