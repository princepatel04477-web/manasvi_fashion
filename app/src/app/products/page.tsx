"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import { useShop } from "@/context/shop-context";

export default function ProductsPage() {
  const { products } = useShop();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("new");
  const filtered = useMemo(() => {
    let list = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, category, sort]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 px-4 md:px-6 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-10 sm:mb-12 md:mb-16 flex flex-col gap-3 animate-slide-in">
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight">
            Our Collection
          </h1>
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] tracking-wide font-light">
            Explore all handcrafted silhouettes, curated to present quiet elegance and timeless sophistication.
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-10">
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search Collection..." 
            className="rounded-xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-sm px-4 py-3 font-inter text-sm tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 warm-shadow text-[#3B2B28]" 
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="rounded-xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-sm px-4 py-3 font-inter text-sm tracking-wider focus:outline-none focus:border-[#8B6B61]/60 warm-shadow text-[#3B2B28] cursor-pointer"
          >
            <option value="all">All Apparel</option>
            <option value="kurtis">Kurtis</option>
            <option value="dresses">Dresses</option>
          </select>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            className="rounded-xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-sm px-4 py-3 font-inter text-sm tracking-wider focus:outline-none focus:border-[#8B6B61]/60 warm-shadow text-[#3B2B28] cursor-pointer"
          >
            <option value="new">Newest Arrivals</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 max-w-xl mx-auto">
            <h2 className="font-cormorant text-2xl font-light italic text-[#8B6B61] mb-2">
              No matching pieces found.
            </h2>
            <p className="font-inter text-xs text-[#8B6B61] font-light max-w-sm">
              Try adjusting your query or filters to discover other designs.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
