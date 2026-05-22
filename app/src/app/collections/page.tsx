"use client";

import { useMemo, useState } from "react";
import AnimatedCollectionGrid from "@/components/animated-collection-grid";
import { useShop } from "@/context/shop-context";

export default function Page() {
  const { products } = useShop();
  const [active, setActive] = useState<"kurti" | "tunic_top">("kurti");

  const filtered = useMemo(
    () => products.filter((p) => p.productType === active),
    [products, active],
  );

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          <button 
            onClick={() => setActive("kurti")} 
            className={`rounded-full px-4 sm:px-6 py-2 font-cormorant text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${active === "kurti" ? "bg-[#3B2B28] text-[#FAF7F2] shadow-md scale-102" : "bg-white/80 backdrop-blur-sm text-[#3B2B28] border border-[#E7C2B8]/40 hover:border-[#3B2B28]"}`}
          >
            Kurtis
          </button>
          <button 
            onClick={() => setActive("tunic_top")} 
            className={`rounded-full px-4 sm:px-6 py-2 font-cormorant text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${active === "tunic_top" ? "bg-[#3B2B28] text-[#FAF7F2] shadow-md scale-102" : "bg-white/80 backdrop-blur-sm text-[#3B2B28] border border-[#E7C2B8]/40 hover:border-[#3B2B28]"}`}
          >
            Tunic Tops
          </button>
        </div>

        <AnimatedCollectionGrid
          title={active === "kurti" ? "Kurti Collection" : "Tunic Tops Collection"}
          subtitle={active === "kurti" ? "Elegant full-length silhouettes for graceful ethnic-modern dressing." : "Chic shorter silhouettes for modern daily styling with premium comfort."}
          products={filtered}
        />
      </div>
    </main>
  );
}
