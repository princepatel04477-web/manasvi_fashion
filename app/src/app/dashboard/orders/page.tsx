"use client";

import React, { useEffect, useState } from "react";
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  CreditCard, 
  Printer, 
  FileText,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { Order } from "@/lib/db-orders";

export default function OrdersDeskPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Print Invoice/Label states
  const [activePrintOrder, setActivePrintOrder] = useState<Order | null>(null);
  const [printType, setPrintType] = useState<"invoice" | "label" | null>(null);

  // Updating states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        showNotification("error", "Failed to decode orders list.");
      }
    } catch (err) {
      showNotification("error", "Error connecting to servers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showNotification(type: "success" | "error", text: string) {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleStatusChange(orderId: string, newStatus: Order["status"], currentPaymentStatus: Order["paymentStatus"]) {
    setUpdatingId(orderId);
    
    // Automatically match paymentStatus if marked as Delivered
    let paymentStatus = currentPaymentStatus;
    if (newStatus === "delivered" && currentPaymentStatus === "unpaid") {
      paymentStatus = "paid";
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, paymentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, paymentStatus } : o));
        showNotification("success", `Order ${orderId} updated to ${newStatus}.`);
      } else {
        showNotification("error", data.message || "Failed to update order.");
      }
    } catch (err) {
      showNotification("error", "Connection error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handlePaymentChange(orderId: string, newPaymentStatus: Order["paymentStatus"], currentStatus: Order["status"]) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, paymentStatus: newPaymentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o));
        showNotification("success", `Order ${orderId} payment marked as ${newPaymentStatus}.`);
      } else {
        showNotification("error", data.message || "Failed to update payment status.");
      }
    } catch (err) {
      showNotification("error", "Connection error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm));
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#d9a58f22] pb-6">
        <div>
          <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Fulfillment Desk</h1>
          <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
            Dispatch garments, audit payments, print invoices, and update order statuses.
          </p>
        </div>
      </div>

      {/* Notification banner */}
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
            placeholder="Search orders by ID, name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#d9a58f44] bg-[#faf7f2]/40 pl-10 pr-4 py-2.5 text-sm text-[#2a1d19] placeholder-[#8b6b61]/60 focus:border-[#6e2b38] focus:bg-white focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b6b61]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#d9a58f44] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#5c4a44] focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Orders log table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#d9a58f22] rounded-2xl">
          <ClipboardList size={48} className="mx-auto text-[#d9a58f66] mb-4" />
          <h3 className="font-serif text-lg text-[#2a1d19]">No orders match the filters.</h3>
          <p className="text-sm text-[#8b6b61] mt-1">Review checkouts or try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#d9a58f22] overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm text-[#5c4a44]">
            <thead>
              <tr className="border-b border-[#d9a58f22] bg-[#faf7f2]/50 text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer Details</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Fulfillment</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9a58f11]">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                
                return (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-[#faf7f2]/40 transition-colors duration-150 cursor-pointer ${
                        isExpanded ? "bg-[#faf7f2]/20" : ""
                      }`}
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-[#2a1d19]">
                        {order.id}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-[#2a1d19]">{order.customerName}</div>
                          <div className="text-xs text-[#8b6b61]">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#5c4a44]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"], order.paymentStatus)}
                          className={`rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer ${
                            order.status === "delivered"
                              ? "bg-green-50 text-green-700"
                              : order.status === "processing" || order.status === "shipped"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.paymentStatus}
                          disabled={updatingId === order.id}
                          onChange={(e) => handlePaymentChange(order.id, e.target.value as Order["paymentStatus"], order.status)}
                          className={`rounded-lg px-2 py-1 text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.paymentStatus === "refunded"
                              ? "bg-stone-200 text-stone-700"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#2a1d19]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[#8b6b61] hover:text-[#6e2b38] transition-colors p-1">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Order detail panel */}
                    {isExpanded && (
                      <tr className="bg-[#faf7f2]/20">
                        <td colSpan={7} className="p-6 border-t border-[#d9a58f22]">
                          <div className="grid gap-6 md:grid-cols-3 text-xs leading-relaxed">
                            {/* Delivery Address & Contact info */}
                            <div className="space-y-3 border-r border-[#d9a58f11] pr-6">
                              <h4 className="font-bold text-xs uppercase tracking-widest text-[#8b6b61] flex items-center gap-1.5">
                                <MapPin size={13} />
                                Shipping Destination
                              </h4>
                              <p className="text-[#2a1d19] font-medium leading-normal bg-white p-3 rounded-xl border border-[#d9a58f11]">
                                {order.shippingAddress}
                              </p>
                              <div className="space-y-1.5 text-stone-600">
                                {order.customerPhone && (
                                  <p className="flex items-center gap-1.5">
                                    <Phone size={12} className="text-[#8b6b61]" />
                                    {order.customerPhone}
                                  </p>
                                )}
                                <p className="flex items-center gap-1.5">
                                  <Mail size={12} className="text-[#8b6b61]" />
                                  {order.customerEmail}
                                </p>
                              </div>
                            </div>

                            {/* Itemized summary */}
                            <div className="space-y-3 md:col-span-2 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-xs uppercase tracking-widest text-[#8b6b61] flex items-center gap-1.5 mb-2.5">
                                  <ClipboardList size={13} />
                                  Cart Items ({order.items.length})
                                </h4>
                                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-[#d9a58f11]">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-8 overflow-hidden rounded bg-stone-50 border border-[#d9a58f11]">
                                          {item.image ? (
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                          ) : (
                                            <div className="h-full w-full bg-stone-200" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="font-serif text-[#2a1d19] font-semibold">{item.title}</p>
                                          <p className="text-[10px] text-[#8b6b61]">Size: {item.size} | Qty: {item.qty}</p>
                                        </div>
                                      </div>
                                      <div className="text-right font-medium text-[#2a1d19]">
                                        ₹{item.price.toLocaleString("en-IN")}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Operations shortcuts (Invoice / Shipping label) */}
                              <div className="flex flex-wrap gap-2.5 border-t border-[#d9a58f11] pt-4 mt-4">
                                <button
                                  onClick={() => {
                                    setActivePrintOrder(order);
                                    setPrintType("invoice");
                                  }}
                                  className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-[#6e2b38] hover:text-white border border-[#d9a58f33] text-[#6e2b38] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
                                >
                                  <FileText size={13} />
                                  Boutique Invoice
                                </button>
                                <button
                                  onClick={() => {
                                    setActivePrintOrder(order);
                                    setPrintType("label");
                                  }}
                                  className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-[#6e2b38] hover:text-white border border-[#d9a58f33] text-[#6e2b38] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
                                >
                                  <Printer size={13} />
                                  Shipping Label
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice & Label modal */}
      {activePrintOrder && printType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 border border-[#d9a58f33] shadow-2xl relative">
            <button
              onClick={() => {
                setActivePrintOrder(null);
                setPrintType(null);
              }}
              className="absolute top-4 right-4 text-[#8b6b61] hover:text-[#2a1d19] font-bold text-lg"
            >
              ✕
            </button>

            {/* Print Area */}
            <div className="p-4" id="printable-area">
              {printType === "invoice" ? (
                /* Editorial Invoice UI */
                <div className="space-y-6 text-[#2a1d19]">
                  <div className="flex justify-between items-start border-b border-[#2a1d19]/10 pb-6">
                    <div>
                      <h2 className="font-[var(--font-bodoni)] text-3xl tracking-wider">MANASVI</h2>
                      <p className="font-[var(--font-cormorant)] text-xs italic tracking-widest text-[#8b6b61] uppercase mt-0.5">Boutique House</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-serif text-lg uppercase tracking-wider text-[#6e2b38]">INVOICE</h3>
                      <p className="text-xs font-mono text-[#8b6b61] mt-1">{activePrintOrder.id}</p>
                      <p className="text-[10px] text-stone-500">{new Date(activePrintOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 grid-cols-2 text-xs">
                    <div>
                      <h4 className="font-bold text-[#8b6b61] uppercase tracking-wider mb-1.5">Billed To</h4>
                      <p className="font-semibold">{activePrintOrder.customerName}</p>
                      <p className="text-[#5c4a44] mt-0.5">{activePrintOrder.customerEmail}</p>
                      {activePrintOrder.customerPhone && <p className="text-[#5c4a44]">{activePrintOrder.customerPhone}</p>}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#8b6b61] uppercase tracking-wider mb-1.5">Ship To</h4>
                      <p className="text-[#5c4a44] leading-relaxed">{activePrintOrder.shippingAddress}</p>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs mt-4">
                    <thead>
                      <tr className="border-b border-[#2a1d19]/10 text-[#8b6b61] font-bold uppercase tracking-wider">
                        <th className="py-2">Garment Design</th>
                        <th className="py-2 text-center">Size</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a1d19]/5">
                      {activePrintOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-serif font-medium">{item.title}</td>
                          <td className="py-3 text-center font-bold">{item.size}</td>
                          <td className="py-3 text-center">{item.qty}</td>
                          <td className="py-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                      <tr className="font-bold text-sm">
                        <td colSpan={3} className="py-4 text-right pr-4">Grand Total</td>
                        <td className="py-4 text-right text-[#6e2b38]">₹{activePrintOrder.totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-[#2a1d19]/10 pt-6 text-center text-[10px] text-[#8b6b61] italic">
                    Thank you for supporting Manasvi Fashion boutique house.
                  </div>
                </div>
              ) : (
                /* Shipping Label UI */
                <div className="border-[3px] border-double border-[#2a1d19] p-6 space-y-6 text-[#2a1d19] rounded-lg">
                  <div className="flex justify-between items-center border-b border-[#2a1d19] pb-4">
                    <div>
                      <h2 className="font-[var(--font-bodoni)] text-2xl tracking-wider">MANASVI FASHION</h2>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-[#8b6b61]">Boutique Logistics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold">{activePrintOrder.id}</p>
                      <p className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest rounded mt-1">STANDARD AIR</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] block">Ship To:</span>
                      <p className="text-base font-bold">{activePrintOrder.customerName}</p>
                      <p className="text-sm font-medium mt-1 leading-relaxed">{activePrintOrder.shippingAddress}</p>
                      {activePrintOrder.customerPhone && <p className="text-xs font-bold mt-1">Tel: {activePrintOrder.customerPhone}</p>}
                    </div>

                    <div className="border-t border-dashed border-[#2a1d19] pt-4 grid grid-cols-2 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8b6b61] block">From:</span>
                        <p className="font-bold">Manasvi Fashion Surat</p>
                        <p className="text-stone-600 mt-0.5">A-61, Dharmanandan Row House, Mota Varachha, Surat</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8b6b61] block">Weight:</span>
                        <p className="font-bold mt-0.5">0.65 kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 border-t border-[#d9a58f22] pt-4">
              <button
                onClick={() => {
                  setActivePrintOrder(null);
                  setPrintType(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#d9a58f44] text-xs font-semibold uppercase tracking-widest text-[#5c4a44] hover:bg-[#faf7f2] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#6e2b38] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#521e28] transition-colors flex items-center gap-2"
              >
                <Printer size={14} />
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
