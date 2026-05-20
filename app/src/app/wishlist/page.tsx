"use client";

import ProductCard from "@/components/product-card";
import { useShop } from "@/context/shop-context";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const list = products.filter((p) => wishlist.includes(p.id));
  return <main className="mx-auto max-w-7xl px-6 py-16"><h1 className="mb-8 font-serif text-4xl">Wishlist</h1><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div></main>;
}
