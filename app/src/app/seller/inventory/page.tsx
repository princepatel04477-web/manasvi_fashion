"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Edit2, 
  Check, 
  X, 
  Loader2, 
  AlertTriangle,
  Sparkles,
  Inbox
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

export default function SellerInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setEditStock(p.stock);
  };

  const handleSaveStock = async (productId: string) => {
    if (editStock < 0) {
      alert("Stock count cannot be negative.");
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await fetch("/api/seller/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock: editStock })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: editStock } : p));
        setEditingId(null);
      } else {
        alert("Failed to update inventory count. Please try again.");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: "Out of Stock", class: "bg-red-950/45 text-red-400 border border-red-900/30" };
    }
    if (stock < 5) {
      return { label: "Low Stock", class: "bg-amber-950/45 text-amber-400 border border-amber-900/30" };
    }
    return { label: "In Stock", class: "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" };
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Bespoke Inventory</h1>
        <p className="text-xs text-[#8B6B61] font-light mt-1">Review stock counts and adjust inventory levels immediately.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#171110] border border-[#C98E87]/10 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8B6B61]/80" />
          <input 
            type="text"
            placeholder="Search Product Name, SKU/Slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#110C0B] border border-[#C98E87]/10 py-2.5 pl-10 pr-4 rounded-xl text-xs text-[#FAF7F2] placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#C98E87] transition-all font-light"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8B6B61]/80" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#110C0B] border border-[#C98E87]/10 p-2.5 rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C98E87] cursor-pointer flex-1 md:flex-none tracking-wider"
          >
            <option value="all">All Categories</option>
            <option value="kurtis">Kurtis</option>
            <option value="dresses">Dresses</option>
            <option value="tunic-tops">Tunic Tops</option>
            <option value="one-piece">One Piece</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#171110] border border-[#C98E87]/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
            <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Loading inventory...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Inbox className="w-8 h-8 text-[#C98E87] mx-auto opacity-40" />
            <h3 className="font-serif text-lg italic text-[#FAF7F2]/60">No Products Seeded</h3>
            <p className="text-xs text-[#8B6B61]/60 font-light font-sans">Contact Super Admin to list new products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest bg-[#1E1715]/40">
                  <th className="p-4 font-medium">Product Image</th>
                  <th className="p-4 font-medium">Product Name</th>
                  <th className="p-4 font-medium">SKU / Slug</th>
                  <th className="p-4 font-medium">Pricing</th>
                  <th className="p-4 font-medium">Stock Count</th>
                  <th className="p-4 font-medium">Stock Status</th>
                  <th className="p-4 font-medium text-right">Fulfillment Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/80">
                {filteredProducts.map((p) => {
                  const status = getStockStatus(p.stock);
                  return (
                    <tr key={p.id} className="hover:bg-[#C98E87]/5 transition-colors">
                      {/* Product Image */}
                      <td className="p-4 flex-shrink-0">
                        <div className="w-12 h-16 relative rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#C98E87]/20 flex items-center justify-center">
                          {p.images && p.images[0] ? (
                            <img 
                              src={p.images[0]} 
                              alt={p.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sparkles className="w-4 h-4 text-[#8B6B61]/30" />
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="p-4 font-medium text-sm text-[#FAF7F2]">
                        {p.title}
                        <span className="block text-[8px] text-[#8B6B61] mt-0.5 uppercase tracking-wider">{p.category}</span>
                      </td>

                      {/* SKU / Slug */}
                      <td className="p-4 font-mono text-xs text-[#8B6B61] select-all">
                        {p.slug}
                      </td>

                      {/* Pricing (Read-only as required) */}
                      <td className="p-4 font-mono font-medium text-sm">
                        ₹{p.price.toLocaleString("en-IN")}
                      </td>

                      {/* Current Stock */}
                      <td className="p-4 font-mono font-semibold text-sm">
                        {editingId === p.id ? (
                          <input 
                            type="number"
                            min={0}
                            value={editStock}
                            onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                            className="w-16 bg-[#110C0B] border border-[#C98E87]/30 px-2 py-1.5 rounded-lg text-xs font-mono font-bold text-center focus:outline-none focus:border-[#C98E87]"
                            autoFocus
                          />
                        ) : (
                          p.stock
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider ${status.class}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {editingId === p.id ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              disabled={updateLoading}
                              onClick={() => handleSaveStock(p.id)}
                              className="p-1.5 bg-emerald-950/35 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/35 rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
                              title="Save Count"
                            >
                              {updateLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-red-950/35 border border-red-900/40 text-red-400 hover:bg-red-900/35 rounded-lg cursor-pointer transition-colors duration-300"
                              title="Cancel Edit"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 bg-[#C98E87]/10 hover:bg-[#C98E87]/20 border border-[#C98E87]/20 text-[#C98E87] rounded-lg cursor-pointer transition-colors duration-300"
                            title="Update Stock Count Only"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
