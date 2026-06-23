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

          {/* High-Fashion Category SEO Description */}
          <div className="mt-16 border-t border-[#E7C2B8]/40 pt-16 max-w-4xl mx-auto pb-8">
            <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold block mb-3 text-center">
              Campaign Journal
            </span>
            <h2 className="font-serif text-2xl text-[#3B2B28] text-center mb-8">
              Designer Dresses in Surat – Contemporary Drapes
            </h2>
            <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mb-8" />
            
            <div className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light space-y-6 text-justify">
              <p>
                Step into a world of contemporary grace and tailored luxury with the <strong>latest dress collection surat</strong> from Manasvi Fashion. Designed to flatter the modern feminine silhouette, our selection of <strong>women dresses surat</strong> offers a diverse range of styles suitable for all aspects of your lifestyle. From casual midday gatherings to glamorous evening events, our dresses represent a thoughtful marriage of high-fashion western aesthetics and delicate Indian craftsmanship. We utilize only the finest quality fabrics, such as smooth viscose crepes, airy georgettes, and breathable cotton blends, ensuring that every design feels as sublime as it looks.
              </p>
              <p>
                If you are looking for a stunning <strong>one piece dress surat</strong> or a <strong>designer dress surat</strong>, our boutique provides a curated range that focuses on minimalist elegance and perfect cuts. Our <strong>casual dress surat</strong> and <strong>western dress surat</strong> feature relaxed drapes, structured sleeves, and subtle details, making them ideal for everyday wear, brunch dates, or stylish travels. For those special occasions that demand extra glamour, our <strong>party wear dress surat</strong> and <strong>elegant dresses surat</strong> offer flowy contours, dramatic flares, and delicate hand-embroidery. These <strong>fashion dresses surat</strong> are designed to draw the eye and ensure you feel comfortable yet exceptionally stylish.
              </p>
              <p>
                As a premium fashion destination, Manasvi Fashion is dedicated to keeping your wardrobe refreshed with <strong>trendy dresses surat</strong> and <strong>stylish dresses surat</strong> that reflect the global shifts in fashion. Our <strong>luxury dresses surat</strong> and <strong>premium dresses surat</strong> are created with high attention to seam finish, contouring, and visual balance. We ensure that our design process focuses on slow fashion principles, avoiding fleeting trends to bring you long-lasting wardrobe classics. Explore our dresses category today and experience the ease of online shopping with customer-friendly support.
              </p>
              <p>
                Our dedicated <strong>dress boutique surat</strong> invites you to discover our premium range of drapes and designs. We believe that every <strong>designer western wear surat</strong> should be a reflection of unique style, which is why we offer custom sizing fits across our entire line. Whether you are searching for a lightweight, breathable linen dress for warm afternoons or a structured satin dress for formal events, Manasvi Fashion Surat is your ultimate destination. Visit our boutique or browse our collection online to find statement dresses crafted with care, and let our customer service guide you toward a style that feels personal, calm, and gracefully premium.
              </p>
            </div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
