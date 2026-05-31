"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  SlidersHorizontal,
  Check,
  X,
  Package,
  Layers
} from "lucide-react";
import { Product } from "@/types";
import { useShop } from "@/context/shop-context";

export default function ProductsManagerPage() {
  const { refetchProducts } = useShop() || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Stock edit states
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [stockUpdatingId, setStockUpdatingId] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Message notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        showNotification("error", "Unexpected data format received.");
      }
    } catch (err) {
      showNotification("error", "Failed to retrieve products list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showNotification(type: "success" | "error", text: string) {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }

  // Handle quick stock update
  async function handleSaveStock(productId: string) {
    setStockUpdatingId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: tempStockValue })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: tempStockValue } : p));
        setEditingStockId(null);
        showNotification("success", "Inventory updated successfully.");
        if (refetchProducts) {
          refetchProducts();
        }
      } else {
        showNotification("error", data.message || "Failed to update stock.");
      }
    } catch (err) {
      showNotification("error", "Network issue. Please try again.");
    } finally {
      setStockUpdatingId(null);
    }
  }

  // Handle soft delete product
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
        showNotification("success", `Product "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
        if (refetchProducts) {
          refetchProducts();
        }
      } else {
        showNotification("error", data.message || "Failed to delete product.");
      }
    } catch (err) {
      showNotification("error", "Server communication failed.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#d9a58f22] pb-6">
        <div>
          <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Boutique Products</h1>
          <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
            Manage your elegant Kurtis, Designer Dresses, and luxury Tunic Tops.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6e2b38] hover:bg-[#521e28] text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Product
        </Link>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl border text-sm transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {notification.text}
        </div>
      )}

      {/* Filters bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-2xl border border-[#d9a58f22]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b6b61]" size={16} />
          <input
            type="text"
            placeholder="Search items by name, slug or subcategory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#d9a58f44] bg-[#faf7f2]/40 pl-10 pr-4 py-2.5 text-sm text-[#2a1d19] placeholder-[#8b6b61]/60 focus:border-[#6e2b38] focus:bg-white focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3.5">
          <SlidersHorizontal size={16} className="text-[#8b6b61]" />
          <div className="flex bg-[#faf7f2] rounded-xl p-1 border border-[#d9a58f22]">
            {[
              { id: "all", label: "All Items" },
              { id: "kurtis", label: "Kurtis" },
              { id: "dresses", label: "Dresses" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white text-[#6e2b38] shadow-xs"
                    : "text-[#5c4a44] hover:text-[#2a1d19]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main product log */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#d9a58f22] rounded-2xl">
          <Package size={48} className="mx-auto text-[#d9a58f66] mb-4" />
          <h3 className="font-serif text-lg text-[#2a1d19]">No products match the criteria.</h3>
          <p className="text-sm text-[#8b6b61] mt-1">Try refining your search or add a new design.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#d9a58f22] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#5c4a44]">
              <thead>
                <tr className="border-b border-[#d9a58f22] bg-[#faf7f2]/50 text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">
                  <th className="py-3.5 px-6">Product Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price (₹)</th>
                  <th className="py-3.5 px-6">Stock Level</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9a58f11]">
                {filteredProducts.map((product) => {
                  const isEditingStock = editingStockId === product.id;
                  const isLowStock = product.stock < 5;

                  return (
                    <tr key={product.id} className="hover:bg-[#faf7f2]/40 transition-colors duration-150">
                      {/* Product details info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4 min-w-[280px]">
                          <div className="h-14 w-11 overflow-hidden rounded bg-stone-100 flex-shrink-0 border border-[#d9a58f22]">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] bg-stone-200">No Image</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif text-base text-[#2a1d19] font-medium leading-snug block hover:text-[#6e2b38] transition-colors">
                              {product.title}
                            </span>
                            <span className="text-[11px] font-mono text-[#8b6b61] tracking-tight block mt-0.5">
                              slug: {product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-widest text-[#2a1d19]">
                            {product.category}
                          </span>
                          <span className="text-[11px] text-[#8b6b61]">
                            {product.productType.replace("_", " ")}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-medium text-[#2a1d19] text-base">
                        ₹{product.price.toLocaleString("en-IN")}
                        {product.compareAtPrice && (
                          <span className="text-xs text-[#8b6b61] line-through block mt-0.5">
                            ₹{product.compareAtPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Stock Level with inline editor */}
                      <td className="py-4 px-6">
                        {isEditingStock ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="number"
                              min="0"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-16 rounded-lg border border-[#6e2b38] px-2 py-1 text-center text-sm font-semibold text-[#2a1d19] focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(product.id)}
                              disabled={stockUpdatingId === product.id}
                              className="rounded-lg bg-green-600 p-1.5 text-white hover:bg-green-700 transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="rounded-lg bg-stone-200 p-1.5 text-[#5c4a44] hover:bg-stone-300 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setEditingStockId(product.id);
                              setTempStockValue(product.stock);
                            }}
                            className="group flex items-center gap-2 cursor-pointer hover:bg-[#faf7f2] p-1.5 rounded-lg transition-all w-fit"
                          >
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                              product.stock === 0
                                ? "bg-red-50 text-red-700"
                                : isLowStock
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-green-700"
                            }`}>
                              {product.stock} units
                            </span>
                            <span className="text-[10px] text-[#8b6b61] opacity-0 group-hover:opacity-100 transition-opacity font-semibold uppercase tracking-wider">
                              Edit
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/products/edit/${product.id}`}
                            className="rounded-lg border border-[#d9a58f33] p-2 text-[#5c4a44] hover:bg-[#faf7f2] hover:text-[#6e2b38] transition-all"
                            title="Edit details"
                          >
                            <Edit3 size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="rounded-lg border border-[#d9a58f33] p-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-all"
                            title="Delete design"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#d9a58f33] shadow-xl animate-scaleUp">
            <h3 className="font-serif text-2xl text-[#2a1d19]">Retire Design?</h3>
            <p className="text-sm text-[#5c4a44] mt-2.5 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-[#2a1d19]">&quot;{deleteTarget.title}&quot;</span>? 
              This will remove the product permanently from the live catalog.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
                className="px-4 py-2.5 rounded-xl border border-[#d9a58f44] text-xs font-semibold uppercase tracking-widest text-[#5c4a44] hover:bg-[#faf7f2] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {deletingId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
