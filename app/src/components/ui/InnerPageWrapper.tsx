"use client";

import { usePathname } from "next/navigation";

export default function InnerPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");
  const isAbout = pathname === "/about";

  // Standard inner pages need extra top padding to accommodate the floating back button elegantly
  const shouldAddPadding = !isHome && !isDashboard && !isAuth && !isAbout;

  return (
    <div className={shouldAddPadding ? "pt-12" : ""}>
      {children}
    </div>
  );
}
