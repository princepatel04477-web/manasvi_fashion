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
        <div className="relative aspect-[3/4] md:h-80 w-full overflow-hidden rounded-xl bg-[#f6eee2]">
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
      </Link>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] sm:text-xs text-[#6b5a4d]">{product.subcategory}</p>
            <h3 className="font-serif text-base sm:text-lg">{product.title}</h3>
            <p className="text-sm">{formatINR(product.price)}</p>
          </div>
        <button onClick={() => toggleWishlist(product.id)} className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] hover:border-[#8B6B61] transition-all cursor-pointer"> <Heart size={16} fill={liked ? "#6e2b38" : "none"} /></button>
      </div>
      <button onClick={() => addToCart(product.id, product.sizes[0])} className="luxury-btn mt-3 w-full rounded-lg py-3 md:py-2 text-sm cursor-pointer">Quick Add</button>
      <div className="mt-3 flex items-center gap-1">
        {(product.colorVariants || []).slice(0, 5).map((v) => (
          <span key={v.name} className="h-4 w-4 rounded-full border border-[#d9a58f]" style={{ backgroundColor: v.hex }} />
        ))}
      </div>
    </div>
  );
}
