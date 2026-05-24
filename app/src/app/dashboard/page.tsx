"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Ticket,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  IndianRupee,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";
import { DashboardSkeleton, LuxuryTransition } from "@/components/ui/skeleton";

interface StatItem {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  activeCoupons: number;
  pendingReviewsCount: number;
  lowStockItems: Array<{
    id: string;
    title: string;
    stock: number;
    slug: string;
    image: string;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<StatItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to load stats");
        }
      } catch (err) {
        setError("Error communicating with servers.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (error || (!loading && !stats)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h3 className="font-serif text-lg font-semibold">Analytics Error</h3>
        <p className="mt-2 text-sm">{error || "Unable to aggregate shop state."}</p>
      </div>
    );
  }

  return (
    <LuxuryTransition isLoading={loading} fallback={<DashboardSkeleton />}>
      {stats && (
        <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[#d9a58f22] pb-6">
        <div>
          <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">At a Glance</h1>
          <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
            Overview of the creative house performance and logistics.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#8b6b61] border border-[#d9a58f33]">
          <Calendar size={14} className="text-[#8b6b61]" />
          Today: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#d9a58f22] bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-[#d9a58f55]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">Net Revenue</span>
            <div className="rounded-xl bg-[#faf7f2] p-2.5 text-[#6e2b38] group-hover:bg-[#6e2b38] group-hover:text-white transition-colors duration-300">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-[#2a1d19]">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="mt-1.5 text-xs text-[#8b6b61] flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-600" />
              <span className="text-emerald-700 font-semibold">14.2%</span> from last cycle
            </p>
          </div>
        </div>

        {/* Orders count */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#d9a58f22] bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-[#d9a58f55]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">Total Orders</span>
            <div className="rounded-xl bg-[#faf7f2] p-2.5 text-[#6e2b38] group-hover:bg-[#6e2b38] group-hover:text-white transition-colors duration-300">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-[#2a1d19]">
              {stats.totalOrders}
            </h3>
            <p className="mt-1.5 text-xs text-[#8b6b61]">
              Average Order: <span className="font-semibold text-[#2a1d19]">₹{stats.averageOrderValue}</span>
            </p>
          </div>
        </div>

        {/* Products Count */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#d9a58f22] bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-[#d9a58f55]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">Creative Catalog</span>
            <div className="rounded-xl bg-[#faf7f2] p-2.5 text-[#6e2b38] group-hover:bg-[#6e2b38] group-hover:text-white transition-colors duration-300">
              <Layers size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-[#2a1d19]">
              {stats.totalProducts}
            </h3>
            <p className="mt-1.5 text-xs text-[#8b6b61]">
              Active in <span className="font-semibold text-[#2a1d19]">2 collections</span>
            </p>
          </div>
        </div>

        {/* Coupons & Reviews */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#d9a58f22] bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-[#d9a58f55]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">Moderate Board</span>
            <div className="rounded-xl bg-[#faf7f2] p-2.5 text-[#6e2b38] group-hover:bg-[#6e2b38] group-hover:text-white transition-colors duration-300">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-[#2a1d19]">
              {stats.pendingReviewsCount}
            </h3>
            <p className="mt-1.5 text-xs text-[#8b6b61]">
              Unapproved buyer reviews pending
            </p>
          </div>
        </div>
      </div>

      {/* Main Panel Content: Chart + Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart (Beautiful custom SVG) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#d9a58f22] bg-white p-6">
          <div className="flex items-center justify-between border-b border-[#d9a58f11] pb-4 mb-6">
            <h3 className="font-serif text-lg text-[#2a1d19]">Monthly Revenue Performance</h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live Sync</span>
          </div>
          
          {/* Custom graphical trend line SVG */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6e2b38" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6e2b38" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#faf7f2" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#faf7f2" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#faf7f2" strokeWidth="1" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="#faf7f2" strokeWidth="2" />

              {/* Area path */}
              <path
                d="M 0 190 Q 70 110, 120 140 T 250 80 T 380 60 T 500 40 L 500 190 Z"
                fill="url(#chartGradient)"
              />

              {/* Line path */}
              <path
                d="M 0 190 Q 70 110, 120 140 T 250 80 T 380 60 T 500 40"
                fill="none"
                stroke="#6e2b38"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="120" cy="140" r="5" fill="#ffffff" stroke="#6e2b38" strokeWidth="2.5" />
              <circle cx="250" cy="80" r="5" fill="#ffffff" stroke="#6e2b38" strokeWidth="2.5" />
              <circle cx="380" cy="60" r="5" fill="#ffffff" stroke="#6e2b38" strokeWidth="2.5" />
              <circle cx="500" cy="40" r="6" fill="#6e2b38" />
            </svg>
            <div className="absolute left-0 bottom-[-15px] right-0 flex justify-between text-[10px] uppercase font-bold tracking-widest text-[#8b6b61] opacity-75">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#d9a58f11] pb-4 mb-4">
              <h3 className="font-serif text-lg text-[#2a1d19] flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-600" />
                Stock Advisories
              </h3>
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {stats.lowStockItems.length} Warning{stats.lowStockItems.length !== 1 && "s"}
              </span>
            </div>

            {stats.lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#8b6b61] italic">
                All inventory quantities are optimal.
              </div>
            ) : (
              <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#faf7f2] border border-[#d9a58f11] text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-9 w-9 overflow-hidden rounded bg-stone-100 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] bg-stone-200">Pic</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#2a1d19] truncate">{item.title}</p>
                        <p className="text-[10px] text-[#8b6b61]">ID: {item.id}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`font-bold px-2 py-1 rounded ${item.stock === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#d9a58f11]">
            <Link
              href="/dashboard/products"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#faf7f2] hover:bg-[#6e2b38] hover:text-white text-[#6e2b38] border border-[#d9a58f33] py-2.5 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Update Quantities
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders log */}
      <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6">
        <div className="flex items-center justify-between border-b border-[#d9a58f11] pb-4 mb-4">
          <h3 className="font-serif text-lg text-[#2a1d19]">Recent Boutique Orders</h3>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#6e2b38] hover:opacity-80 transition-opacity"
          >
            Fulfillment Desk
            <ChevronRight size={14} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#8b6b61] italic">
            No sales have been logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#5c4a44]">
              <thead>
                <tr className="border-b border-[#d9a58f22] text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9a58f11]">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf7f2] transition-colors duration-150">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#2a1d19]">{order.id}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-[#2a1d19]">{order.customerName}</div>
                        <div className="text-xs text-[#8b6b61]">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#2a1d19]">₹{order.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "bg-green-50 text-green-700"
                          : order.status === "processing" || order.status === "shipped"
                          ? "bg-blue-50 text-blue-700"
                          : order.status === "cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
      )}
    </LuxuryTransition>
  );
}
