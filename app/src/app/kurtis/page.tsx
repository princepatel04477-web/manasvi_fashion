"use client";

import { useRef } from "react";
import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import useScrollReveal from "@/hooks/useScrollReveal";
import PageLoader from "@/components/page-loader";
import PageTransition from "@/components/PageTransition";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function KurtisPage() {
  const { products, loading } = useShop();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  useScrollReveal(headerRef, 90);
  useScrollReveal(gridRef, 90);

  // Filter Kurtis dynamically and tolerate naming variations.
  const kurtis = products.filter((p) => {
    const productType = (p.productType || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const subcategory = (p.subcategory || "").toLowerCase();
    return (
      productType === "kurti" ||
      category === "kurtis" ||
      category === "kurti" ||
      subcategory === "kurtis" ||
      subcategory === "kurti"
    );
  });

  console.log("[/kurtis] Total products:", products.length, "| Kurtis found:", kurtis.length, "| Loading:", loading);

  if (!loading && kurtis.length === 0) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] flex flex-col items-center justify-center gap-6 px-4">
          <div className="text-center space-y-3 max-w-md">
            <span className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold">
              Kurtis Collection
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-light italic text-[#3B2B28]">
              No products found
            </h2>
            <div className="w-16 h-[1px] bg-[#C98E87] mx-auto my-2" />
            <p className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light">
              Our atelier is preparing the Kurtis collection. Check back shortly as new designs arrive.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full border border-[#C98E87]/40 bg-white/60 backdrop-blur-md text-[#3B2B28] font-inter text-xs uppercase tracking-widest hover:bg-[#FAF7F2] hover:border-[#8B6B61] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
        </main>
      </PageTransition>
    );
  }

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
          <PageLoader isLoading={loading} />
          {/* BACKGROUND DECORATIVE GLOWS */}
          <div className="absolute top-[12%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* EDITORIAL HERO HEADER */}
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
              <Skeleton className="h-4 w-36 uppercase tracking-[0.25em]" variant="cream" />
              <Skeleton className="h-10 sm:h-12 w-2/3 sm:w-1/2 rounded-xl" variant="nude" />
              <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
              <Skeleton className="h-4 w-5/6 sm:w-2/3 rounded-md" variant="cream" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 rounded-md" variant="cream" />
            </div>

            {/* FEATURED CAMPAIGN HERO SKELETON */}
            <section className="mb-16 sm:mb-24 md:mb-32">
              <div className="editorial-card bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 md:p-10 warm-shadow">
                <div className="grid gap-10 lg:grid-cols-12 items-center">
                  {/* Hero Product Photo Frame */}
                  <div className="lg:col-span-7">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                      <Skeleton className="w-full h-full rounded-none" variant="nude" />
                    </div>
                  </div>

                  {/* Hero Product Info Details */}
                  <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                    <Skeleton className="h-3.5 w-24" variant="cream" />
                    <Skeleton className="h-8 w-4/5 rounded-lg" variant="nude" />
                    <Skeleton className="h-4 w-32" variant="cream" />
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-3.5 w-full" variant="cream" />
                      <Skeleton className="h-3.5 w-full" variant="cream" />
                      <Skeleton className="h-3.5 w-3/4" variant="cream" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-xl" variant="cocoa" />
                  </div>
                </div>
              </div>
            </section>

            {/* LOOKBOOK GRID SKELETON */}
            <ProductGridSkeleton count={4} />
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
        <div className="absolute top-[12%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* EDITORIAL HERO HEADER */}
          <div
            ref={headerRef}
            className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4"
          >
            <span 
              className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Lookbook Selection
            </span>
            <h1 className="section-heading font-serif text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight text-[#3B2B28]">
              The Kurti Edit
            </h1>
            <div className="w-20 h-[1px] bg-[#C98E87] my-1" />
            <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed max-w-lg font-light tracking-wide">
              An exquisite curation of heritage styles. Each piece features meticulously detailed embroidery, premium flowy fabrics, and a contemporary luxury drape.
            </p>
          </div>

          {/* LOOKBOOK COLLECTIONS GRID */}
          {kurtis.length > 0 && (
            <section ref={gridRef} className="pb-12">
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 max-w-5xl mx-auto items-stretch">
                {kurtis.map((kurti, index) => {
                  // Alternating margins and offsets to create a true lookbook magazine feel
                  const isEven = index % 2 === 0;
                  const alignmentClass = isEven ? "md:translate-y-8" : "md:-translate-y-8";
                  
                  return (
                    <div 
                      key={kurti.id} 
                      className={`product-card transition-all duration-700 ${alignmentClass} hover:translate-y-0`}
                    >
                      <EditorialProductCard product={kurti} aspectRatio="aspect-[3/4]" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* CINEMATIC STORY PANEL: "QUIET ELEGANCE" */}
          <section className="mt-20 sm:mt-32 md:mt-40 mb-12 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
            <div className="relative h-[52vh] sm:h-[65vh] w-full flex items-center justify-center">
              {/* Dark editorial overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B2B28]/95 via-[#3B2B28]/55 to-[#3B2B28]/70 z-10" />
              
              {/* Story Image from provided assets */}
              <img 
                src="/photos/Gemini_Generated_Image_7p370v7p370v7p37.png" 
                alt="Artisan stitch closeup" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] scale-105" 
              />

              {/* Story Text Layer */}
              <div className="max-w-3xl px-6 text-center text-[#FAF7F2] relative z-20 flex flex-col items-center gap-6">
                <span className="font-inter text-[10px] tracking-[0.3em] text-[#E7C2B8] uppercase font-bold">
                  Artisanal Detail
                </span>
                
                <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight">
                  “Crafted for quiet elegance.”
                </h2>
                
                <div className="w-16 h-[1px] bg-[#E7C2B8]/60 my-1" />
                
                <p className="font-inter text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed max-w-lg font-light tracking-wide">
                  Every thread is selected with absolute dedication. Each drape represents hours of delicate planning, capturing traditional grace for the contemporary woman.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </PageTransition>
  );
}
