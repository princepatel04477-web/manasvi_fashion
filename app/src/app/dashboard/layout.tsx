"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  Home as HomeIcon,
  Ticket,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { Skeleton, DashboardSkeleton, LuxuryTransition } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { name: "Add Product", href: "/dashboard/products/new", icon: PlusCircle },
    { name: "Orders Desk", href: "/dashboard/orders", icon: ClipboardList },
    { name: "Homepage CMS", href: "/dashboard/cms", icon: HomeIcon },
    { name: "Discounts", href: "/dashboard/discounts", icon: Ticket },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isLoading = status === "loading";
  const userRole = (session?.user as { role?: string })?.role || "customer";

  return (
    <div className="admin-theme flex min-h-screen bg-[#0c0807] text-[#faf7f2] font-[var(--font-inter)]">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[#d9a58f33] bg-white px-4 md:hidden shadow-sm">
        <Link href="/" className="flex flex-col items-start leading-none">
          <span className="font-[var(--font-bodoni)] text-lg tracking-[0.05em] text-[#2a1d19]">MANASVI</span>
          <span className="font-[var(--font-cormorant)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b6b61]">Studio</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-[#5c4a44] hover:bg-[#faf7f2]"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#d9a58f33] bg-white pt-16 md:pt-0 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="hidden h-20 items-center justify-between border-b border-[#d9a58f22] px-6 md:flex">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-[var(--font-bodoni)] text-2xl tracking-[0.05em] text-[#2a1d19]">MANASVI</span>
            <span className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.22em] text-[#8b6b61] mt-0.5">Studio Panel</span>
          </Link>
        </div>

        {/* User Info Bar */}
        <div className="flex items-center gap-3 border-b border-[#d9a58f22] px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf7f2] border border-[#d9a58f44] text-[#8b6b61]">
            <User size={18} />
          </div>
          <div className="overflow-hidden">
            {isLoading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" variant="cream" />
                <Skeleton className="h-3 w-16" variant="nude" />
              </div>
            ) : (
              <>
                <h4 className="truncate text-sm font-semibold">{session?.user?.name || "Administrator"}</h4>
                <p className="truncate text-xs font-semibold uppercase tracking-wider text-[#8b6b61] opacity-90">{userRole}</p>
              </>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#6e2b38] text-white shadow-sm"
                    : "text-[#5c4a44] hover:bg-[#faf7f2] hover:text-[#2a1d19]"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-[#8b6b61]"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="border-t border-[#d9a58f22] p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} className="text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <LuxuryTransition isLoading={isLoading} fallback={<DashboardSkeleton />}>
            {children}
          </LuxuryTransition>
        </main>
      </div>
    </div>
  );
}
