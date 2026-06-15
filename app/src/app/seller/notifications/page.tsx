"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Trash2,
  CheckCheck
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/admin/orders")
      ]);

      if (prodRes.ok && orderRes.ok) {
        const products = await prodRes.json();
        const ordersData = await orderRes.json();
        const orders = ordersData.orders || [];

        const list: NotificationItem[] = [];
        
        // A. Low stock warnings
        products.forEach((p: any) => {
          if (p.stock === 0) {
            list.push({
              id: `stock-out-${p.id}`,
              title: "Out of Stock Alert",
              message: `"${p.title}" is completely out of stock. Immediate restock required.`,
              time: "Action required",
              type: "warning",
              read: false
            });
          } else if (p.stock < 5) {
            list.push({
              id: `stock-low-${p.id}`,
              title: "Low Stock Alert",
              message: `"${p.title}" has only ${p.stock} items remaining in boutique stock.`,
              time: "Restock soon",
              type: "warning",
              read: false
            });
          }
        });

        // B. Recent orders
        const recentOrders = orders.slice(0, 15);
        recentOrders.forEach((o: any) => {
          const date = new Date(o.createdAt);
          const relativeTime = date.toLocaleDateString("en-IN", { 
            month: "short", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          
          if (o.status === "pending") {
            list.push({
              id: `order-new-${o.id}`,
              title: "New Order Placed",
              message: `Order #${o.id} for ₹${o.totalAmount} has been received and is awaiting preparation.`,
              time: relativeTime,
              type: "info",
              read: false
            });
          } else if (o.status === "shipped") {
            list.push({
              id: `order-ship-${o.id}`,
              title: "Order Dispatched",
              message: `Order #${o.id} has been successfully dispatched to the carrier.`,
              time: relativeTime,
              type: "success",
              read: false
            });
          } else if (o.status === "delivered") {
            list.push({
              id: `order-deliver-${o.id}`,
              title: "Order Delivered",
              message: `Order #${o.id} has been delivered successfully to the customer.`,
              time: relativeTime,
              type: "success",
              read: false
            });
          }
        });

        setNotifications(list);
      }
    } catch (err) {
      console.warn("Failed to generate dynamic seller notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Atelier Bulletins</h1>
          <p className="text-xs text-[#8B6B61] font-light mt-1">Review operational updates, inventory notices, and shipment events.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-3 w-full sm:w-auto font-sans">
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-[#C98E87]/20 bg-[#1E1715]/40 hover:bg-[#C98E87]/10 text-xs text-[#C98E87] rounded-xl cursor-pointer transition-all w-full sm:w-auto font-light"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button 
              onClick={handleClearAll}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-red-900/30 bg-red-950/20 hover:bg-red-900/20 text-xs text-red-400 rounded-xl cursor-pointer transition-all w-full sm:w-auto font-light"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear list</span>
            </button>
          </div>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
            <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Loading bulletins...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 bg-[#171110] border border-[#C98E87]/10 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C98E87]/10 border border-[#C98E87]/20 flex items-center justify-center mx-auto text-[#C98E87]">
              <Bell className="w-5 h-5 stroke-1" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg italic text-[#FAF7F2]/60">Boutique is Silent</h3>
              <p className="text-xs text-[#8B6B61]/60 font-light max-w-sm mx-auto">No inventory warnings or new customer transactions require immediate attention.</p>
            </div>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = n.type === "warning" ? AlertTriangle : n.type === "success" ? CheckCircle2 : Info;
            return (
              <div 
                key={n.id} 
                className={`p-5 bg-[#171110] border rounded-2xl flex items-start gap-4 transition-all ${
                  n.read 
                    ? "border-[#C98E87]/5 opacity-60" 
                    : "border-[#C98E87]/20 shadow-md shadow-[#C98E87]/5"
                }`}
              >
                {/* Type Icon */}
                <div className={`p-2 rounded-xl flex-shrink-0 border ${
                  n.type === "warning" 
                    ? "bg-amber-950/20 border-amber-900/35 text-amber-400" 
                    : n.type === "success" 
                      ? "bg-emerald-950/20 border-emerald-900/35 text-emerald-400" 
                      : "bg-sky-950/20 border-sky-900/35 text-sky-400"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-serif text-sm text-[#FAF7F2] tracking-wider">{n.title}</h4>
                    <span className="text-[9px] text-[#8B6B61] font-mono whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#FAF7F2]/80 font-light leading-relaxed">{n.message}</p>
                </div>

                {/* Mark read button */}
                {!n.read && (
                  <button 
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1.5 hover:bg-[#C98E87]/10 text-[#C98E87] hover:text-[#FAF7F2] rounded-lg cursor-pointer border border-transparent hover:border-[#C98E87]/15 transition-all text-[9px] uppercase tracking-wider px-2 whitespace-nowrap font-light"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
