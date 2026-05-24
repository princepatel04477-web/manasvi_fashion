"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";
import { ShoppingBag, Check, ChevronDown } from "lucide-react";
import { formatINR } from "@/lib/store";

interface StickyCartBarProps {
  productName: string;
  price: number;
  sizes: string[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onAddToCart: () => void;
  imageUrl: string;
  isAdding: boolean;
  addedSuccess: boolean;
}

export default function StickyCartBar({
  productName,
  price,
  sizes,
  selectedSize,
  setSelectedSize,
  onAddToCart,
  imageUrl,
  isAdding,
  addedSuccess,
}: StickyCartBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: ".main-add-to-cart-btn",
      start: "bottom top",
      onEnter: () => {
        gsap.to(".sticky-cart-bar", {
          translateY: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(".sticky-cart-bar", {
          translateY: 80,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleButtonClick = () => {
    // Pulse animation
    animate(".sticky-add-btn", {
      scale: [1, 0.95, 1],
      backgroundColor: ["#3B2B28", "#2d6a4f", "#3B2B28"],
      duration: 600,
      easing: "easeOutBack",
    });

    onAddToCart();
  };

  return (
    <div
      ref={barRef}
      className="sticky-cart-bar fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E7C2B8]/20 z-40 py-3 px-4 shadow-[0_-8px_30px_rgba(61,43,38,0.06)]"
      style={{ transform: "translateY(80px)", opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4 w-full">
        {/* Product Info */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={imageUrl}
            alt={productName}
            className="w-10 h-10 object-cover rounded-lg border border-[#E7C2B8]/30 bg-white flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-cormorant text-sm md:text-base font-semibold text-[#3B2B28] uppercase tracking-wide truncate">
              {productName}
            </h3>
            <span className="font-inter text-xs text-[#8B6B61] font-light">
              {formatINR(price)}
            </span>
          </div>
        </div>

        {/* Actions: Size selector + Add to Cart button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 w-auto">
          <div className="relative">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full sm:w-28 h-10 pl-3 pr-8 bg-white border border-[#E7C2B8]/40 rounded-xl font-inter text-xs text-[#3B2B28] focus:outline-none focus:border-[#3B2B28] appearance-none cursor-pointer font-semibold"
            >
              {sizes.map((sz) => (
                <option key={sz} value={sz}>
                  Size {sz}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8B6B61]">
              <ChevronDown size={14} />
            </div>
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isAdding || addedSuccess}
            className="sticky-add-btn px-6 h-10 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-[#8B6B61] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-90 disabled:cursor-not-allowed shadow-sm"
          >
            {isAdding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : addedSuccess ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
