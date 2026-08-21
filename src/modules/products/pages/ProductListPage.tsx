import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Plus, Search, Package, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  stock: number;
  status: string;
}

export const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/products', { params: { search } });
      const items = res.data?.data || res.data || [];
      setProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch products from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-7 h-7 text-indigo-400" />
            Tenant Inventory & Products
          </h1>
          <p className="text-sm text-slate-400">Live products fetched directly from Laravel Backend</p>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading products from Laravel backend...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No products found.
          </div>
        ) : (
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
                  <td className="p-3 font-bold text-white">${Number(p.price).toFixed(2)}</td>
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
        )}
      </Card>
    </div>
  );
};
