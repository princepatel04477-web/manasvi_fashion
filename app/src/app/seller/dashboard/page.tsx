"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  IndianRupee, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Loader2
} from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "returned" | "cancelled";
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  stock: number;
}

export default function SellerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/products")
        ]);

        if (ordersRes.ok && productsRes.ok) {
          const ordersData = await ordersRes.json();
          const productsData = await productsRes.json();
          setOrders(ordersData.orders || []);
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
          <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Gathering metrics...</span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const completedOrders = orders.filter(o => o.status === "delivered").length;
  
  // Calculate Revenue (delivered or processed orders)
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  // Today's orders
  const today = new Date().toDateString();
  const todaysOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;

  // Low stock alert products (stock < 5)
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  // Recent 5 orders for table
  const recentOrders = orders.slice(0, 5);

  // Simple dynamic data for minimalist chart
  // Group orders by month/day for visualization
  const last7DaysRevenue = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString("en-IN", { weekday: "short" });
    const dayOrders = orders.filter(o => 
      new Date(o.createdAt).toDateString() === date.toDateString() && 
      o.status !== "cancelled"
    );
    const rev = dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    return { name: dayStr, value: rev };
  }).reverse();

  const maxVal = Math.max(...last7DaysRevenue.map(d => d.value), 1000);

  return (
    <div className="space-y-8">
      {/* Title section */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Atelier Overview</h1>
        <p className="text-xs text-[#8B6B61] font-light mt-1">Real-time boutique metrics, order status, and inventory checks.</p>
      </div>

      {/* Grid: Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Total Revenue</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">₹{totalRevenue.toLocaleString("en-IN")}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">Excludes cancelled items</span>
          </div>
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Total Orders</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">{totalOrders}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">All-time lifetime metrics</span>
          </div>
          <div className="p-3 bg-[#C98E87]/10 border border-[#C98E87]/20 rounded-xl text-[#C98E87]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Orders */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Today&apos;s Orders</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">{todaysOrders}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">Live daily intake</span>
          </div>
          <div className="p-3 bg-sky-950/20 border border-sky-900/30 rounded-xl text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Pending Orders</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">{pendingOrders}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">Awaiting full processing</span>
          </div>
          <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Completed Orders</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">{completedOrders}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">Dispatched and delivered</span>
          </div>
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]">Low Stock Items</span>
            <h3 className="font-serif text-2xl text-[#FAF7F2]">{lowStockProducts}</h3>
            <span className="text-[9px] text-[#C98E87] block font-light">Items with stock &lt; 5 units</span>
          </div>
          <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-5 p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C98E87]" />
              <h3 className="font-serif text-base font-light text-[#FAF7F2]">Revenue Curve</h3>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-[#8B6B61]">Last 7 Days</span>
          </div>

          {/* Simple clean visual SVG representation of the chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6">
            {last7DaysRevenue.map((d, idx) => {
              const pct = (d.value / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-help h-full justify-end">
                  <div className="w-full relative flex justify-center h-full items-end">
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1E1715] border border-[#C98E87]/25 text-[8px] text-[#FAF7F2] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 font-mono">
                      ₹{d.value}
                    </span>
                    <div 
                      style={{ height: `${pct}%` }} 
                      className={`w-full rounded-t-lg bg-gradient-to-t transition-all duration-500 ${
                        pct > 0 
                          ? "from-[#3B2B28] to-[#C98E87] opacity-80 group-hover:opacity-100" 
                          : "bg-[#3B2B28]/10 h-[2px]!"
                      }`} 
                    />
                  </div>
                  <span className="text-[8px] text-[#8B6B61] tracking-wider uppercase mt-1 font-mono">{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-7 p-6 bg-[#171110] border border-[#C98E87]/10 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-light text-[#FAF7F2]">Recent Acquisitions</h3>
            <Link 
              href="/seller/orders" 
              className="text-[9px] uppercase tracking-widest text-[#C98E87] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/80">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#C98E87]/5 transition-colors">
                    <td className="py-4 font-mono font-medium text-[#C98E87]">#{o.id}</td>
                    <td className="py-4 font-light">{o.customerName}</td>
                    <td className="py-4 font-mono font-medium">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                    <td className="py-4">
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
