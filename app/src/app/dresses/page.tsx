"use client";

import { useRef } from "react";
import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";
import PageTransition from "@/components/PageTransition";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function DressesPage() {
  const { products, loading } = useShop();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  useScrollReveal(headerRef, 90);
  useScrollReveal(gridRef, 90);

  // Filter Dresses dynamically and tolerate naming variations.
  const dresses = products.filter((p) => {
    const productType = (p.productType || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const subcategory = (p.subcategory || "").toLowerCase();
    return (
      productType === "dress" ||
      category === "dresses" ||
      category === "dress" ||
      subcategory === "dresses" ||
      subcategory === "dress"
    );
  });

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
          {/* BACKGROUND DECORATIVE GLOWS */}
          <div className="absolute top-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* EDITORIAL HERO HEADER */}
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
              <Skeleton className="h-4 w-36 uppercase tracking-[0.25em]" variant="cream" />
              <Skeleton className="h-10 sm:h-12 w-2/3 sm:w-1/2 rounded-xl" variant="nude" />
              <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
              <Skeleton className="h-4 w-5/6 sm:w-2/3 rounded-md" variant="cream" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 rounded-md" variant="cream" />
            </div>

            {/* LOOKBOOK GRID SKELETON */}
            <ProductGridSkeleton count={3} />
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* CAMPAIGN INTRODUCTION */}
          <div 
            ref={headerRef}
            className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4"
          >
            <span 
              className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              Campaign Lookbook
            </span>
            
            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-[1.1] tracking-tight">
              Bespoke Dresses
            </h1>
            
            <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
            
            <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
              Crafted in fine fabrics with intricate embroidered detail and modern cuts, our luxury Indian fusion dress styles are designed to make an impact.
            </p>
          </div>

          {/* DRESSES GRID */}
          {dresses.length > 0 && (
            <section ref={gridRef} className="max-w-5xl mx-auto mb-20 sm:mb-28">
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 items-stretch">
                {dresses.map((dress, index) => {
                  const isEven = index % 2 === 0;
                  const alignmentClass = isEven ? "md:translate-y-8" : "md:-translate-y-8";
                  return (
                    <div
                      key={dress.id}
                      className={`product-card transition-all duration-700 ${alignmentClass} hover:translate-y-0`}
                    >
                      <EditorialProductCard product={dress} aspectRatio="aspect-[3/4]" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* HIGH-FASHION STORY PANEL: "TIMELESS SILHOUETTES" */}
          <section className="my-20 sm:my-32 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
            <div className="relative h-[52vh] sm:h-[65vh] w-full flex items-center justify-center">
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#3B2B28]/95 via-[#3B2B28]/60 to-[#3B2B28]/90 z-10" />
              
              {/* Story Image from provided assets */}
              <img 
                src="/photos/Gemini_Generated_Image_o7map6o7map6o7ma.png" 
                alt="Drape movement" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] scale-105" 
              />

              {/* Story Text */}
              <div className="max-w-2xl px-6 text-center text-[#FAF7F2] relative z-20 flex flex-col items-center gap-6">
                <span className="font-inter text-[9px] tracking-[0.3em] text-[#E7C2B8] uppercase font-bold">
                  Movement Studies
                </span>
                
                <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight">
                  “Timeless silhouettes for modern femininity.”
                </h2>
                
                <div className="w-16 h-[1px] bg-[#E7C2B8]/60 my-1" />
                
                <p className="font-inter text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed max-w-md font-light tracking-wide">
                  A graceful study of silk crepe drapes and tailored contours. Made to accompany everyday occasions with unmatched softness and quiet boutique premium details.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </PageTransition>
  );
}
