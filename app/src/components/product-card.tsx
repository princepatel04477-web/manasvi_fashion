"use client";

import { useRef, useState } from "react";
import SizeGuideModal from "@/components/SizeGuideModal";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";
import { animate } from "animejs";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const liked = wishlist.includes(product.id);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    
    const img = card.querySelector("img");
    const quickAddBtn = card.querySelector(".quick-add-btn");
    const overlay = card.querySelector(".product-overlay");

    if (img) {
      animate(img, {
        scale: 1.07,
        duration: 450,
        easing: "easeOutQuad",
      });
    }

    if (quickAddBtn) {
      animate(quickAddBtn, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutQuart",
      });
    }

    if (overlay) {
      animate(overlay, {
        opacity: [0, 0.35],
        duration: 300,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    const img = card.querySelector("img");
    const quickAddBtn = card.querySelector(".quick-add-btn");
    const overlay = card.querySelector(".product-overlay");

    if (img) {
      animate(img, {
        scale: 1.0,
        duration: 400,
        easing: "easeOutQuad",
      });
    }

    if (quickAddBtn) {
      animate(quickAddBtn, {
        translateY: 20,
        opacity: 0,
        duration: 200,
      });
    }

    if (overlay) {
      animate(overlay, {
        opacity: 0,
        duration: 200,
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (heartRef.current) {
      animate(heartRef.current, {
        scale: [1, 1.4, 1],
        duration: 400,
        easing: "easeOutBack",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="product-card editorial-card group overflow-hidden relative cursor-pointer rounded-2xl p-3 bg-[#FAF7F2]/40 border border-[#E7C2B8]/20 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,43,40,0.06)] hover:border-[#C98E87]/40 [will-change:transform,box-shadow]"
    >
      <div className="relative aspect-[3/4] md:h-80 w-full overflow-hidden rounded-xl bg-[#f6eee2]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover will-change-transform"
          />
        </Link>

        {/* Product overlay */}
        <div className="product-overlay absolute inset-0 bg-black opacity-0 pointer-events-none" />

        {/* Wishlist Heart Icon absolute top-right overlaying the image */}
        <button
          ref={heartRef}
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-sm shadow-sm hover:scale-105 transition-all cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart
            size={15}
            fill={liked ? "#6e2b38" : "none"}
            className={liked ? "text-[#6e2b38] scale-110" : "text-[#8B6B61]"}
          />
        </button>

        {/* Quick Add Button absolute overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id, product.sizes[0]);
          }}
          className="quick-add-btn absolute bottom-3 left-0 right-0 mx-auto w-fit opacity-0 px-4 py-2 bg-[#3B2B28] text-white text-[10px] tracking-[0.2em] font-inter uppercase font-semibold rounded-lg shadow-md hover:bg-[#6D3B43] active:scale-95 transition-all cursor-pointer z-10"
        >
          Quick Add
        </button>
      </div>

      {/* Info details below the image */}
      <Link href={`/products/${product.slug}`} className="block mt-4 px-1">
        <div>
          <p className="text-[11px] sm:text-xs text-[#6b5a4d]">{product.subcategory}</p>
          <h3 className="font-serif text-base sm:text-lg text-[#3B2B28] leading-tight mt-0.5">{product.title}</h3>
          <p className="text-sm text-[#3B2B28] font-light mt-1">{formatINR(product.price)}</p>
        </div>
      </Link>

      <div className="mt-3 px-1 flex justify-end">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSizeGuideOpen(true);
          }}
          className="text-[10px] text-[#C98E87] hover:text-[#8B6B61] underline uppercase tracking-wider font-semibold cursor-pointer z-10"
        >
          Size Guide
        </button>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
