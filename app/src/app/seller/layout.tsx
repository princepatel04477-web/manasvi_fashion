"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Users, 
  BarChart3, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";

const ALLOWED_SELLERS = [
  "varunyatechnologies@gmail.com",
  "manasvifashion1515@gmail.com"
];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // 1. Session Protection Check
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      if (pathname !== "/seller/login") {
        router.push("/seller/login");
      }
      return;
    }

    const email = session.user?.email?.toLowerCase() || "";
    if (!ALLOWED_SELLERS.includes(email)) {
      // Direct unauthorized user to access-denied page
      router.push("/dashboard/access-denied");
    }
  }, [session, status, pathname, router]);

  // 2. Generate dynamic notifications from local inventory and order metrics
  useEffect(() => {
    if (status !== "authenticated") return;

    const generateNotifications = async () => {
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
                message: `"${p.title}" is completely out of stock.`,
                time: "Action required",
                type: "warning",
                read: false
              });
            } else if (p.stock < 5) {
              list.push({
                id: `stock-low-${p.id}`,
                title: "Low Stock Alert",
                message: `"${p.title}" has only ${p.stock} items remaining.`,
                time: "Restock soon",
                type: "warning",
                read: false
              });
            }
          });

          // B. Recent orders
          const recentOrders = orders.slice(0, 5);
          recentOrders.forEach((o: any) => {
            const date = new Date(o.createdAt);
            const relativeTime = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
            
            if (o.status === "pending") {
              list.push({
                id: `order-new-${o.id}`,
                title: "New Order Placed",
                message: `Order #${o.id} for ₹${o.totalAmount} is awaiting processing.`,
                time: relativeTime,
                type: "info",
                read: false
              });
            } else if (o.status === "shipped") {
              list.push({
                id: `order-ship-${o.id}`,
                title: "Order Dispatched",
                message: `Order #${o.id} has been marked as shipped.`,
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
      }
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#140E0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#C98E87] animate-pulse" />
          <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#8B6B61] animate-pulse">
            Manasvi Seller Panel
          </span>
          <p className="font-inter text-[10px] text-[#8B6B61]/60 font-light">Loading portal configurations...</p>
        </div>
      </div>
    );
  }

  // Bypass layout wrapping for login screen
  if (pathname === "/seller/login") {
    return <>{children}</>;
  }

  if (!session || !session.user?.email || !ALLOWED_SELLERS.includes(session.user.email.toLowerCase())) {
    return null;
  }

  const navItems = [
    { name: "Overview", path: "/seller/dashboard", icon: LayoutDashboard },
    { name: "Orders", path: "/seller/orders", icon: ShoppingBag },
    { name: "Inventory", path: "/seller/inventory", icon: Layers },
    { name: "Customers", path: "/seller/customers", icon: Users },
    { name: "Analytics", path: "/seller/analytics", icon: BarChart3 },
    { name: "Notifications", path: "/seller/notifications", icon: Bell, badge: notifications.filter(n => !n.read).length }
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/seller/login" });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#110C0B] text-[#FAF7F2] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#C98E87]/10 bg-[#171110] p-6 justify-between flex-shrink-0">
        <div className="space-y-8">
          {/* Logo block */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-[#C98E87]/10 rounded-xl border border-[#C98E87]/20">
              <Sparkles className="w-5 h-5 text-[#C98E87]" />
            </div>
            <div>
              <h2 className="font-serif text-sm tracking-[0.1em] font-light">MANASVI</h2>
              <span className="font-sans text-[8px] uppercase tracking-widest text-[#C98E87] font-semibold">Seller Panel</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-xs tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "bg-[#C98E87]/15 text-[#FAF7F2] border-l-2 border-[#C98E87]" 
                      : "text-[#8B6B61] hover:text-[#FAF7F2] hover:bg-[#C98E87]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C98E87]" : "text-[#8B6B61]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-[#C98E87] text-[#110C0B] text-[8px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Log out */}
        <div className="pt-6 border-t border-[#C98E87]/10 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#C98E87]/15 border border-[#C98E87]/30 flex items-center justify-center font-serif text-xs text-[#C98E87]">
              {session.user.name ? session.user.name.charAt(0) : "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#FAF7F2] truncate">{session.user.name || "Boutique Seller"}</p>
              <p className="text-[9px] text-[#8B6B61] truncate">{session.user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-[#8B6B61] hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[#C98E87]/10 bg-[#171110] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-[#8B6B61] hover:text-[#FAF7F2] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#8B6B61]">
              <span>Seller Panel</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#C98E87]">{navItems.find(n => n.path === pathname)?.name || "Studio"}</span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="p-2 text-[#8B6B61] hover:text-[#FAF7F2] rounded-xl hover:bg-[#C98E87]/5 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C98E87]" />
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-[#1E1715] border border-[#C98E87]/25 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-[#C98E87]/10 flex items-center justify-between">
                    <span className="font-serif text-xs font-light">Bulletins</span>
                    <button 
                      onClick={markAllRead}
                      className="text-[9px] uppercase tracking-widest text-[#C98E87] hover:underline cursor-pointer"
                    >
                      Clear alerts
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-[#C98E87]/10">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#8B6B61] font-light">
                        No active notices.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-4 hover:bg-[#C98E87]/5 transition-colors ${n.read ? "opacity-60" : ""}`}>
                          <div className="flex justify-between items-start gap-2">
                            <span className={`text-[10px] font-semibold tracking-wider ${
                              n.type === "warning" ? "text-amber-400" : n.type === "success" ? "text-emerald-400" : "text-sky-400"
                            }`}>
                              {n.title}
                            </span>
                            <span className="text-[8px] text-[#8B6B61]">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[#FAF7F2]/80 mt-1 font-light leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link 
                    href="/seller/notifications" 
                    onClick={() => setShowNotificationDropdown(false)}
                    className="block text-center py-3 bg-[#171110] text-[9px] uppercase tracking-widest text-[#C98E87] hover:bg-[#C98E87]/10 transition-colors border-t border-[#C98E87]/10"
                  >
                    View All Bulletins
                  </Link>
                </div>
              )}
            </div>

            {/* Locked environment badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/35 border border-emerald-900/30 rounded-full text-emerald-400 text-[9px] tracking-widest font-semibold uppercase">
              <Lock className="w-2.5 h-2.5" />
              <span>Restricted</span>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex">
          <div className="w-64 bg-[#171110] p-6 flex flex-col justify-between h-full shadow-2xl relative">
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#8B6B61] hover:text-[#FAF7F2] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-8">
              {/* Logo block */}
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-[#C98E87]/10 rounded-xl border border-[#C98E87]/20">
                  <Sparkles className="w-5 h-5 text-[#C98E87]" />
                </div>
                <div>
                  <h2 className="font-serif text-sm tracking-[0.1em] font-light">MANASVI</h2>
                  <span className="font-sans text-[8px] uppercase tracking-widest text-[#C98E87] font-semibold">Seller Panel</span>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-xs tracking-wider transition-all duration-300 ${
                        isActive 
                          ? "bg-[#C98E87]/15 text-[#FAF7F2] border-l-2 border-[#C98E87]" 
                          : "text-[#8B6B61] hover:text-[#FAF7F2] hover:bg-[#C98E87]/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#C98E87]" : "text-[#8B6B61]"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-[#C98E87] text-[#110C0B] text-[8px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Profile & Log out */}
            <div className="pt-6 border-t border-[#C98E87]/10 space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-[#C98E87]/15 border border-[#C98E87]/30 flex items-center justify-center font-serif text-xs text-[#C98E87]">
                  {session.user.name ? session.user.name.charAt(0) : "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#FAF7F2] truncate">{session.user.name}</p>
                  <p className="text-[9px] text-[#8B6B61] truncate">{session.user.email}</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-[#8B6B61] hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
