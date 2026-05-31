"use client";

import { useRef, useState } from "react";
import SizeGuideModal from "@/components/SizeGuideModal";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";
import { animate } from "animejs";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const liked = wishlist.includes(product.id);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    
    const img = card.querySelector("img");
    const overlay = card.querySelector(".product-overlay");

    if (img) {
      animate(img, {
        scale: 1.07,
        duration: 450,
        easing: "easeOutQuad",
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
    const overlay = card.querySelector(".product-overlay");

    if (img) {
      animate(img, {
        scale: 1.0,
        duration: 400,
        easing: "easeOutQuad",
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

  const handleQuickAdd = async (sizeToBuy: string) => {
    setIsAdding(true);
    addToCart(product.id, sizeToBuy);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
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

        {/* Quick-overlay overlay when success or adding */}
        <AnimatePresence>
          {(isAdding || addedSuccess) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#3B2B28]/25 backdrop-blur-[2px] flex items-center justify-center z-10"
            >
              <div className="bg-[#FAF7F2] rounded-2xl py-2.5 px-4 border border-[#E7C2B8]/40 shadow-md flex items-center gap-2">
                {isAdding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#8B6B61] border-t-transparent rounded-full animate-spin" />
                    <span className="font-cormorant text-xs uppercase tracking-wider text-[#3B2B28]">Curating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#6e2b38]" />
                    <span className="font-cormorant text-xs uppercase tracking-wider text-[#3B2B28]">Added</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info details below the image */}
      <Link href={`/products/${product.slug}`} className="block mt-4 px-1">
        <div>
          <span className="font-inter text-[10px] sm:text-[9px] tracking-[0.2em] text-[#C98E87] uppercase font-semibold block">
            {product.subcategory || product.category}
          </span>
          <h3 className="font-serif text-base sm:text-lg text-[#3B2B28] leading-tight font-medium mt-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-serif text-sm sm:text-base font-light text-[#3B2B28]">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-serif text-xs text-[#8B6B61] line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* INTERACTIVE SIZES SECTION */}
      <div className="mt-4 pt-3.5 border-t border-[#E7C2B8]/30">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-[9px] text-[#8B6B61] tracking-wider uppercase font-light">Select Size</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSizeGuideOpen(true);
              }}
              className="font-inter text-[8px] text-[#C98E87] hover:text-[#8B6B61] underline uppercase tracking-wider font-semibold cursor-pointer z-10"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickAdd(sz);
                }}
                className="w-9 h-9 md:w-7 md:h-7 rounded-lg border border-[#E7C2B8]/30 hover:border-[#3B2B28] bg-white flex items-center justify-center font-inter text-xs md:text-[9px] font-bold text-[#3B2B28] hover:bg-[#FAF7F2] active:scale-95 transition-all duration-200 cursor-pointer z-10"
                title={`Quick add size ${sz}`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
