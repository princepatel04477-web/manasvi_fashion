"use client";

import { useState } from "react";
import Link from "next/link";
import SizeGuideModal from "@/components/SizeGuideModal";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorialProductCard({ 
  product,
  aspectRatio = "aspect-[3/4]"
}: { 
  product: Product;
  aspectRatio?: string;
}) {
  const { addCustomToCart, toggleWishlist, wishlist } = useShop();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const liked = wishlist.includes(product.id);

  // Safely extract active variant and images
  const colorVariants = product.colorVariants || [];
  const activeVariant = colorVariants[selectedColor] || null;
  
  // Dynamic image switching
  const mainImage = activeVariant?.image || product.images[0];
  // Alternate view is a different image of the same design (if available) to show visual variety on hover
  const hoverImage = product.images.find((img) => img !== mainImage) || product.images[0];

  const handleQuickAdd = async (sizeToBuy: string) => {
    setSelectedSize(sizeToBuy);
    setIsAdding(true);
    
    // Add to cart with specific color variant detail appended to the title
    const colorName = activeVariant?.name || product.color;
    addCustomToCart({
      productId: product.id,
      title: `${product.title} - ${colorName}`,
      image: mainImage,
      price: product.price,
      size: sizeToBuy,
      slug: product.slug
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div 
      className="product-card group relative flex flex-col bg-[#FAF7F2]/40 rounded-3xl border border-[#E7C2B8]/20 p-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,43,40,0.06)] hover:border-[#C98E87]/40 [will-change:transform,box-shadow]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSelectedSize(null);
      }}
    >
      {/* WISHLIST BUTTON (TOP RIGHT) */}
      <button 
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-5 right-5 z-20 w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/80 backdrop-blur-md border border-[#E7C2B8]/20 flex items-center justify-center text-[#8B6B61] hover:text-[#6D3B43] hover:scale-105 transition-all duration-300 shadow-sm cursor-pointer"
        aria-label="Add to wishlist"
      >
        <Heart 
          size={15} 
          fill={liked ? "#C98E87" : "none"} 
          className={`transition-all duration-300 ${liked ? "text-[#C98E87] scale-110" : ""}`}
        />
      </button>

      {/* NEW ARRIVAL / SALE BADGE */}
      {product.isNew && (
        <span className="absolute top-5 left-5 z-20 px-3 py-1 bg-[#6D3B43] text-white text-[9px] font-inter uppercase tracking-[0.15em] font-semibold rounded-full shadow-sm">
          New Campaign
        </span>
      )}

      {/* IMAGE FRAME WITH DOUBLE HOVER REVEAL */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-2xl relative w-full">
        <div className={`relative ${aspectRatio} w-full overflow-hidden bg-[#FAF7F2] transition-transform duration-700`}>
          <img 
            src={mainImage} 
            alt={product.title} 
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.03] group-hover:filter group-hover:brightness-[0.98]" 
          />
          
          {/* Smooth alternate angle overlay on hover */}
          <AnimatePresence>
            {hovered && hoverImage && hoverImage !== mainImage && (
              <motion.img
                key="hover-reveal"
                src={hoverImage}
                alt={`${product.title} Alternate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.03] group-hover:scale-100 transition-transform duration-1000"
              />
            )}
          </AnimatePresence>

          {/* Quick-overlay overlay when success or adding */}
          <AnimatePresence>
            {(isAdding || addedSuccess) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#3B2B28]/25 backdrop-blur-[2px] flex items-center justify-center z-10"
              >
                <div className="bg-[#FAF7F2] rounded-2xl py-3 px-5 border border-[#E7C2B8]/40 shadow-md flex items-center gap-2">
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#8B6B61] border-t-transparent rounded-full animate-spin" />
                      <span className="font-cormorant text-xs uppercase tracking-wider text-[#3B2B28]">Curating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#6D3B43]" />
                      <span className="font-cormorant text-xs uppercase tracking-wider text-[#3B2B28]">Added</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* CARD CONTENT */}
      <div className="mt-4 flex-1 flex flex-col justify-between px-1">
        <div>
          {/* Subcategory */}
          <span className="font-inter text-[10px] sm:text-[9px] tracking-[0.2em] text-[#C98E87] uppercase font-semibold">
            {product.subcategory || product.category}
          </span>

          {/* Title */}
          <h3 className="font-cormorant text-base sm:text-lg font-medium text-[#3B2B28] mt-1 hover:text-[#8B6B61] transition-colors leading-tight">
            <Link href={`/products/${product.slug}`}>
              {product.title}
            </Link>
          </h3>

          {/* Price details */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-cormorant text-sm sm:text-base font-light text-[#3B2B28]">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-cormorant text-xs text-[#8B6B61] line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* INTERACTIVE SIZES SECTION */}
        <div className="mt-4 pt-3.5 border-t border-[#E7C2B8]/30">
          {/* Size Select & Quick Add in one sleek horizontal element */}
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
                  onClick={() => handleQuickAdd(sz)}
                  className="w-9 h-9 md:w-7 md:h-7 rounded-lg border border-[#E7C2B8]/30 hover:border-[#3B2B28] bg-white flex items-center justify-center font-inter text-xs md:text-[9px] font-bold text-[#3B2B28] hover:bg-[#FAF7F2] active:scale-95 transition-all duration-200 cursor-pointer"
                  title={`Quick add size ${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>
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
