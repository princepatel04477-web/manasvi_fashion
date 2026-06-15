"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  Truck, 
  Loader2, 
  AlertCircle,
  X,
  IndianRupee
} from "lucide-react";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: string;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "returned" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "failed" | "refunded";
  createdAt: string;
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    setActionLoading(orderId);
    try {
      const res = await fetch("/api/seller/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customerPhone && o.customerPhone.includes(searchTerm));
    
    const matchesFilter = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Acquisitions</h1>
          <p className="text-xs text-[#8B6B61] font-light mt-1">Manage customers acquisitions, deliveries, and fulfillment state.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#171110] border border-[#C98E87]/10 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8B6B61]/80" />
          <input 
            type="text"
            placeholder="Search Order ID, Client Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#110C0B] border border-[#C98E87]/10 py-2.5 pl-10 pr-4 rounded-xl text-xs text-[#FAF7F2] placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#C98E87] transition-all font-light"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8B6B61]/80" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#110C0B] border border-[#C98E87]/10 p-2.5 rounded-xl text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C98E87] cursor-pointer flex-1 md:flex-none tracking-wider"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#171110] border border-[#C98E87]/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
            <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Loading acquisitions...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#C98E87] mx-auto opacity-40" />
            <h3 className="font-serif text-lg italic text-[#FAF7F2]/60">No Acquisitions Found</h3>
            <p className="text-xs text-[#8B6B61]/60 font-light">Try refining your search term or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest bg-[#1E1715]/40">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/80">
                {filteredOrders.map((o) => {
                  const dateStr = new Date(o.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <tr key={o.id} className="hover:bg-[#C98E87]/5 transition-colors">
                      {/* ID */}
                      <td className="p-4 font-mono font-medium text-[#C98E87] select-all">
                        #{o.id}
                        <span className="block text-[8px] text-[#8B6B61] mt-0.5">{dateStr}</span>
                      </td>

                      {/* Customer info */}
                      <td className="p-4">
                        <div className="font-medium">{o.customerName}</div>
                        <div className="text-[9px] text-[#8B6B61] mt-0.5">{o.customerPhone || "No Phone"}</div>
                      </td>

                      {/* Items quantity sum */}
                      <td className="p-4 font-light">
                        {o.items.reduce((sum, item) => sum + item.qty, 0)} {o.items.reduce((sum, item) => sum + item.qty, 0) === 1 ? "item" : "items"}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-medium text-sm">
                        ₹{Number(o.totalAmount).toLocaleString("en-IN")}
                      </td>

                      {/* Payment Status */}
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider ${
                          o.paymentStatus === "paid" 
                            ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" 
                            : o.paymentStatus === "refunded"
                              ? "bg-sky-950/45 text-sky-400 border border-sky-900/30"
                              : "bg-red-950/45 text-red-400 border border-red-900/30"
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>

                      {/* Order status */}
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider ${
                          o.status === "delivered" 
                            ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900/30" 
                            : o.status === "cancelled" 
                              ? "bg-red-950/45 text-red-400 border border-red-900/30"
                              : "bg-amber-950/45 text-amber-400 border border-amber-900/30"
                        }`}>
                          {o.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 bg-[#C98E87]/10 hover:bg-[#C98E87]/20 border border-[#C98E87]/20 text-[#C98E87] rounded-lg cursor-pointer transition-colors duration-300"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick state transitions */}
                        {o.status === "pending" && (
                          <button 
                            disabled={actionLoading === o.id}
                            onClick={() => handleUpdateStatus(o.id, "processing")}
                            className="p-1.5 bg-amber-950/30 hover:bg-amber-900/30 border border-amber-800/30 text-amber-400 rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
                            title="Mark Processing"
                          >
                            <Loader2 className={`w-3.5 h-3.5 ${actionLoading === o.id ? "animate-spin" : ""}`} />
                          </button>
                        )}

                        {o.status === "processing" && (
                          <button 
                            disabled={actionLoading === o.id}
                            onClick={() => handleUpdateStatus(o.id, "shipped")}
                            className="p-1.5 bg-sky-950/30 hover:bg-sky-900/30 border border-sky-800/30 text-sky-400 rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
                            title="Mark Shipped"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {o.status === "shipped" && (
                          <button 
                            disabled={actionLoading === o.id}
                            onClick={() => handleUpdateStatus(o.id, "delivered")}
                            className="p-1.5 bg-emerald-950/30 hover:bg-emerald-900/30 border border-emerald-800/30 text-emerald-400 rounded-lg cursor-pointer transition-colors duration-300 disabled:opacity-50"
                            title="Mark Delivered"
                          >
                            <Check className="w-3.5 h-3.5" />
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

      {/* Invoice / Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-[#1E1715] border border-[#C98E87]/25 rounded-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[#C98E87]/10 flex justify-between items-center bg-[#171110]">
              <div>
                <h3 className="font-serif text-lg text-[#FAF7F2] font-light">Acquisition Details</h3>
                <span className="font-mono text-xs text-[#C98E87] mt-0.5 block select-all">Order ID: #{selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#8B6B61] hover:text-[#FAF7F2] rounded-xl hover:bg-[#C98E87]/5 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed font-light">
              
              {/* Order Status & Actions */}
              <div className="bg-[#171110] border border-[#C98E87]/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#8B6B61] block mb-1">Current Status</span>
                  <span className="inline-block px-3 py-1 bg-[#C98E87]/15 text-[#C98E87] rounded-full font-semibold uppercase tracking-wider text-[9px] border border-[#C98E87]/20">
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Operations */}
                <div className="flex gap-2.5">
                  {selectedOrder.status === "pending" && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                      className="px-4 py-2 bg-[#C98E87]/10 hover:bg-[#C98E87]/20 border border-[#C98E87]/20 text-[#C98E87] rounded-xl font-medium tracking-wider cursor-pointer transition-all uppercase text-[9px]"
                    >
                      Process Order
                    </button>
                  )}
                  {selectedOrder.status === "processing" && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                      className="px-4 py-2 bg-sky-950/35 hover:bg-sky-900/30 border border-sky-800/30 text-sky-400 rounded-xl font-medium tracking-wider cursor-pointer transition-all uppercase text-[9px]"
                    >
                      Ship Order
                    </button>
                  )}
                  {selectedOrder.status === "shipped" && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                      className="px-4 py-2 bg-emerald-950/35 hover:bg-emerald-900/30 border border-emerald-800/30 text-emerald-400 rounded-xl font-medium tracking-wider cursor-pointer transition-all uppercase text-[9px]"
                    >
                      Complete Delivery
                    </button>
                  )}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="font-serif text-[#C98E87] tracking-wider uppercase text-[9px]">Client Profile</h4>
                  <div className="p-4 bg-[#171110] border border-[#C98E87]/5 rounded-2xl space-y-1.5">
                    <p><span className="text-[#8B6B61]">Name:</span> <strong className="font-normal text-[#FAF7F2]">{selectedOrder.customerName}</strong></p>
                    <p><span className="text-[#8B6B61]">Email:</span> <span className="select-all text-[#FAF7F2]/90">{selectedOrder.customerEmail}</span></p>
                    <p><span className="text-[#8B6B61]">Contact:</span> <span className="select-all text-[#FAF7F2]/90">{selectedOrder.customerPhone || "Not Provided"}</span></p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-serif text-[#C98E87] tracking-wider uppercase text-[9px]">Delivery Address</h4>
                  <div className="p-4 bg-[#171110] border border-[#C98E87]/5 rounded-2xl">
                    <p className="whitespace-pre-line text-[#FAF7F2]/90">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-2.5">
                <h4 className="font-serif text-[#C98E87] tracking-wider uppercase text-[9px]">Bespoke Items ordered</h4>
                <div className="border border-[#C98E87]/10 rounded-2xl overflow-hidden bg-[#171110]">
                  <table className="w-full text-left font-sans text-[11px]">
                    <thead>
                      <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest bg-[#1E1715]/40">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Attributes</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/90">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={`${item.productId}-${idx}`} className="hover:bg-[#C98E87]/5">
                          <td className="p-3 font-medium text-[#FAF7F2]">{item.title}</td>
                          <td className="p-3 font-mono font-light text-[#8B6B61]">Size: {item.size}</td>
                          <td className="p-3 text-center font-mono">{item.qty}</td>
                          <td className="p-3 text-right font-mono font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t border-[#C98E87]/10 bg-[#171110] flex justify-between items-center">
              <span className="font-serif text-sm text-[#8B6B61]">Aggregate Total</span>
              <span className="font-serif text-xl text-[#FAF7F2]">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
