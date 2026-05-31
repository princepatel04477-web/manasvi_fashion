"use client";

import { useRef } from "react";
import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import useScrollReveal from "@/hooks/useScrollReveal";
import PageLoader from "@/components/page-loader";
import PageTransition from "@/components/PageTransition";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function TunicTopsPage() {
  const { products, loading } = useShop();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  useScrollReveal(headerRef, 90);
  useScrollReveal(gridRef, 90);

  // Filter Tunic Tops dynamically and tolerate naming variations.
  const tunicTops = products.filter((p) => {
    const productType = (p.productType || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const subcategory = (p.subcategory || "").toLowerCase();
    return (
      productType === "tunic_top" ||
      productType === "tunic" ||
      category === "tunic-tops" ||
      category === "tunic-top" ||
      category === "tunic" ||
      subcategory === "tunic-tops" ||
      subcategory === "tunic-top" ||
      subcategory === "tunic"
    );
  });

  console.log("[/tunic-tops] Total products:", products.length, "| Tunic tops found:", tunicTops.length, "| Loading:", loading);

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
          <PageLoader isLoading={loading} />
          {/* BACKGROUND DECORATIVE GLOWS */}
          <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* EDITORIAL HEADER SKELETON */}
            <div className="max-w-3xl mb-12 sm:mb-16 md:mb-24 flex flex-col gap-3">
              <Skeleton className="h-4 w-40" variant="cream" />
              <Skeleton className="h-10 sm:h-12 w-2/3 rounded-xl" variant="nude" />
              <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
              <Skeleton className="h-4 w-1/2" variant="cream" />
              <Skeleton className="h-4 w-1/3" variant="cream" />
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
        <PageLoader isLoading={loading} />
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* EDITORIAL HEADER */}
          <div 
            ref={headerRef}
            className="max-w-3xl mb-12 sm:mb-16 md:mb-24 flex flex-col gap-3"
          >
            <span 
              className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              Surat Atelier
            </span>
            <h1 className="section-heading font-serif text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight text-[#3B2B28]">
              Tunic Tops
            </h1>
            <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
            <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed max-w-md font-light tracking-wide">
              Gracefully tailored tunic designs featuring fine cotton fabrics, delicate self-embroidery details, and a modern relaxed silhouette.
            </p>
          </div>

          {/* LOOKBOOK IMAGES GRID */}
          {tunicTops.length > 0 && (
            <section ref={gridRef} className="pb-12">
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
                {tunicTops.map((tunic, index) => {
                  // Alternating margins for lookbook aesthetic
                  const isEven = index % 2 === 0;
                  const alignmentClass = isEven ? "md:translate-y-8" : "md:-translate-y-8";
                  
                  return (
                    <div 
                      key={tunic.id} 
                      className={`product-card transition-all duration-700 ${alignmentClass} hover:translate-y-0`}
                    >
                      <EditorialProductCard product={tunic} aspectRatio="aspect-[2/3]" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* EDITORIAL CAMPAIGN CALLOUT */}
          <section className="mt-20 sm:mt-32 md:mt-40 mb-12 bg-white/50 border border-[#E7C2B8]/30 rounded-3xl p-6 md:p-12 warm-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4D7CF] opacity-20 rounded-full filter blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                {/* Visual */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
                  <div className="absolute inset-0 bg-[#3B2B28]/5 mix-blend-overlay z-10" />
                  <img 
                    src="/photos/red-kurti-carousel.png" 
                    alt="Model in movement" 
                    className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
                  />
                </div>

                {/* Text / Campaign Callout */}
                <div className="flex flex-col gap-6 pl-0 md:pl-8">
                  <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold">
                    Campaign Movement
                  </span>
                  
                  <h2 className="font-cormorant text-4xl sm:text-5xl font-light italic leading-tight text-[#3B2B28]">
                    “Designed to move naturally with you.”
                  </h2>
                  
                  <div className="w-12 h-[1px] bg-[#C98E87] my-1" />
                  
                  <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed font-light">
                    Our tunic tops represent relaxed chic. Sculpted for lightweight draping and daily luxury, they transition effortlessly from a morning studio setting to quiet dinner gatherings.
                  </p>

                  <div className="mt-4">
                    <Link 
                      href="/collections" 
                      className="inline-flex items-center gap-2 font-cormorant text-xs uppercase tracking-widest font-semibold text-[#3B2B28] hover:text-[#8B6B61] transition-colors group"
                    >
                      <span>Discover Full Studio</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>
    </PageTransition>
  );
}
