"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Loader2, 
  Award,
  Sparkles,
  PieChart
} from "lucide-react";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "returned" | "cancelled";
  createdAt: string;
}

interface TopItem {
  id: string;
  title: string;
  qty: number;
  revenue: number;
}

export default function SellerAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load analytics orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
          <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Loading analytics studio...</span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const activeOrders = orders.filter(o => o.status !== "cancelled" && o.status !== "returned");
  const grossSales = activeOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalQtySold = activeOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0);
  const averageOrderValue = activeOrders.length > 0 ? Math.round(grossSales / activeOrders.length) : 0;

  // Calculate top selling items
  const itemMap = new Map<string, TopItem>();
  activeOrders.forEach(o => {
    o.items.forEach(item => {
      const id = item.productId;
      if (itemMap.has(id)) {
        const existing = itemMap.get(id)!;
        existing.qty += item.qty;
        existing.revenue += item.price * item.qty;
      } else {
        itemMap.set(id, {
          id: id,
          title: item.title,
          qty: item.qty,
          revenue: item.price * item.qty
        });
      }
    });
  });

  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Status distributions
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
  const statusCounts = statuses.map(s => ({
    name: s,
    count: orders.filter(o => o.status === s).length
  }));

  const maxStatusCount = Math.max(...statusCounts.map(s => s.count), 1);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Aesthetic Metrics</h1>
        <p className="text-xs text-[#8B6B61] font-light mt-1">Review boutique performance, revenue analytics, and top-selling collections.</p>
      </div>

      {/* Grid: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl">
          <span className="text-[9px] uppercase tracking-widest text-[#8B6B61] block mb-1">Gross Sales Value</span>
          <h3 className="font-serif text-2xl text-[#FAF7F2]">₹{grossSales.toLocaleString("en-IN")}</h3>
          <p className="text-[9px] text-[#8B6B61]/80 mt-1 font-light">Gross value of all active boutique acquisitions</p>
        </div>

        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl">
          <span className="text-[9px] uppercase tracking-widest text-[#8B6B61] block mb-1">Total Garments Sold</span>
          <h3 className="font-serif text-2xl text-[#FAF7F2]">{totalQtySold} units</h3>
          <p className="text-[9px] text-[#8B6B61]/80 mt-1 font-light">Total garments dispatched or awaiting preparation</p>
        </div>

        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl">
          <span className="text-[9px] uppercase tracking-widest text-[#8B6B61] block mb-1">Average Acquisition Size</span>
          <h3 className="font-serif text-2xl text-[#FAF7F2]">₹{averageOrderValue.toLocaleString("en-IN")}</h3>
          <p className="text-[9px] text-[#8B6B61]/80 mt-1 font-light">Average ticket value per transaction</p>
        </div>
      </div>

      {/* Grid: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Status Distribution */}
        <div className="lg:col-span-5 p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#C98E87]" />
              <h3 className="font-serif text-base font-light text-[#FAF7F2]">Status Breakdown</h3>
            </div>
          </div>

          <div className="space-y-4">
            {statusCounts.map((s, idx) => {
              const pct = Math.round((s.count / orders.length) * 100) || 0;
              return (
                <div key={idx} className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-[#FAF7F2]/80">{s.name}</span>
                    <span className="font-mono text-[#8B6B61]">{s.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#110C0B] h-1.5 rounded-full overflow-hidden border border-[#C98E87]/5">
                    <div 
                      style={{ width: `${pct}%` }} 
                      className={`h-full rounded-full ${
                        s.name === "delivered" 
                          ? "bg-emerald-500" 
                          : s.name === "cancelled" 
                            ? "bg-red-500" 
                            : "bg-[#C98E87]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hot-Selling Masterpieces */}
        <div className="lg:col-span-7 p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C98E87]" />
              <h3 className="font-serif text-base font-light text-[#FAF7F2]">Top Selling Items</h3>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-[#8B6B61] font-mono">By Qty Sold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest bg-[#1E1715]/40">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Design Name</th>
                  <th className="p-3 text-center">Qty Dispatched</th>
                  <th className="p-3 text-right">Revenue Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/80">
                {topItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#C98E87]/5 transition-colors">
                    <td className="p-3 font-mono font-medium text-[#C98E87]">{idx + 1}</td>
                    <td className="p-3 font-medium text-[#FAF7F2]">{item.title}</td>
                    <td className="p-3 text-center font-mono">{item.qty} units</td>
                    <td className="p-3 text-right font-mono font-medium text-[#C98E87]">₹{item.revenue.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
