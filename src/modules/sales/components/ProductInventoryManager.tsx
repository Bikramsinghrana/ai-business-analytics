import React, { useState, useEffect } from 'react';
import { ProductCatalogItem, ProductCategory } from '../types/sales.types';
import { salesApi } from '../services/salesApi';
import {
  Package,
  Plus,
  Search,
  DollarSign,
  AlertTriangle,
  Tag,
  Layers,
  Edit,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export const ProductInventoryManager: React.FC = () => {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  // New Product Modal
  const [isNewProductOpen, setIsNewProductOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [inventoryQty, setInventoryQty] = useState<string>('50');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [filterCategory, lowStockOnly]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        salesApi.getProducts({ search: searchQuery, category_id: filterCategory, low_stock: lowStockOnly }),
        salesApi.getCategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes || []);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!name || !price) return;
    try {
      await salesApi.createProduct({
        name,
        price: parseFloat(price),
        inventory_qty: parseInt(inventoryQty) || 50,
        category_id: categoryId || undefined,
        description,
      });
      setIsNewProductOpen(false);
      setName('');
      setPrice('');
      setDescription('');
      loadData();
    } catch (err) {
      alert('Failed to create product');
    }
  };

  const handleInventoryAdjust = async (productId: string, newQty: number) => {
    try {
      await salesApi.updateProduct(productId, { inventory_qty: newQty });
      setProducts(products.map(p => p.id === productId ? { ...p, inventory_qty: newQty, stock: newQty } : p));
    } catch (err) {
      alert('Failed to update inventory');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              placeholder="Search SKU, product name..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lowStockOnly ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Alerts</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsNewProductOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => {
          const isLowStock = (product.inventory_qty ?? product.stock) <= 10;

          return (
            <div
              key={product.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="block text-[11px] font-mono text-slate-500">{product.sku}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                </div>

                {product.category && (
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Category: {product.category.name}
                  </span>
                )}
              </div>

              {/* Stock Management & Action Bar */}
              <div className="pt-3 border-t border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Inventory Stock:</span>
                  <div className="flex items-center gap-1.5">
                    {isLowStock && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                    <input
                      type="number"
                      value={product.inventory_qty ?? product.stock}
                      onChange={(e) => handleInventoryAdjust(product.id, parseInt(e.target.value) || 0)}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Add New Product to Catalog
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AURA Neural Processing Accelerator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="999.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={inventoryQty}
                    onChange={(e) => setInventoryQty(e.target.value)}
                    placeholder="50"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="">Select Category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product specifications..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsNewProductOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={handleCreateProduct} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30">
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
