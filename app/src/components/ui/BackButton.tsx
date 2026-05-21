"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render on all storefront inner pages except the homepage and dashboard area
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back to previous page"
      className="group absolute left-6 sm:left-12 lg:left-16 xl:left-[calc((100vw-1280px)/2+2rem)] top-[96px] z-40 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-[#E7C2B8]/30 shadow-[0_4px_20px_rgba(59,43,40,0.04)] text-[#3B2B28] hover:text-[#8B6B61] transition-all duration-300 ease-out hover:scale-105 hover:bg-white/85 hover:border-[#8B6B61]/40 active:scale-98 animate-slide-in cursor-pointer font-[var(--font-cormorant)] text-sm font-semibold uppercase tracking-[0.16em] outline-none focus-visible:ring-2 focus-visible:ring-[#8B6B61] focus-visible:ring-offset-2"
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      <span>Back</span>
    </button>
  );
}
