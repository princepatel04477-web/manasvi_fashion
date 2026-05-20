"use client";

import { useMemo, useState } from "react";
import AnimatedCollectionGrid from "@/components/animated-collection-grid";
import { products } from "@/data/products";

export default function Page() {
  const [active, setActive] = useState<"kurti" | "tunic_top">("kurti");

  const filtered = useMemo(
    () => products.filter((p) => p.productType === active),
    [active],
  );

  return (
    <main>
      <div className="mx-auto flex max-w-7xl gap-3 px-4 pt-10 sm:px-6 lg:px-8">
        <button onClick={() => setActive("kurti")} className={`rounded-full px-5 py-2 text-sm transition ${active === "kurti" ? "bg-[#6e2b38] text-white" : "bg-white text-[#3d2b26] border border-[#d9a58f]"}`}>Kurtis</button>
        <button onClick={() => setActive("tunic_top")} className={`rounded-full px-5 py-2 text-sm transition ${active === "tunic_top" ? "bg-[#6e2b38] text-white" : "bg-white text-[#3d2b26] border border-[#d9a58f]"}`}>Tunic Tops</button>
      </div>

      <AnimatedCollectionGrid
        title={active === "kurti" ? "Kurti Collection" : "Tunic Tops Collection"}
        subtitle={active === "kurti" ? "Elegant full-length silhouettes for graceful ethnic-modern dressing." : "Chic shorter silhouettes for modern daily styling with premium comfort."}
        products={filtered}
      />
    </main>
  );
}
