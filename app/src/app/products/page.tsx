"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import { products } from "@/data/products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("new");
  const filtered = useMemo(() => {
    let list = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="font-serif text-4xl">Product Listing</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="rounded-md border border-[#d9a58f] bg-white p-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-[#d9a58f] bg-white p-2"><option value="all">All</option><option value="kurtis">Kurtis</option><option value="dresses">Dresses</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-[#d9a58f] bg-white p-2"><option value="new">Newest</option><option value="price-asc">Price Low-High</option><option value="price-desc">Price High-Low</option></select>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </main>
  );
}
