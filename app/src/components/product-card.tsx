"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const liked = wishlist.includes(product.id);
  return (
    <div className="editorial-card group overflow-hidden rounded-2xl p-3 transition hover:-translate-y-1">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-80 overflow-hidden rounded-xl bg-[#f6eee2]">
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#6b5a4d]">{product.subcategory}</p>
          <h3 className="font-serif text-lg">{product.title}</h3>
          <p className="text-sm">{formatINR(product.price)}</p>
        </div>
        <button onClick={() => toggleWishlist(product.id)} className="rounded-full border p-2"> <Heart size={16} fill={liked ? "#6e2b38" : "none"} /></button>
      </div>
      <button onClick={() => addToCart(product.id, product.sizes[0])} className="luxury-btn mt-3 w-full rounded-lg py-2 text-sm">Quick Add</button>
      <div className="mt-3 flex items-center gap-1">
        {(product.colorVariants || []).slice(0, 5).map((v) => (
          <span key={v.name} className="h-4 w-4 rounded-full border border-[#d9a58f]" style={{ backgroundColor: v.hex }} />
        ))}
      </div>
    </div>
  );
}
