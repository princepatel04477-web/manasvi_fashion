"use client";

import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function NewArrivalsPage() {
  const { products, loading } = useShop();

  // Filter New Arrivals dynamically
  const newArrivals = products.filter((p) => !!p.isNew);

  // Group new arrivals for creative asymmetrical pairings
  const featuredArrival = newArrivals[0] || null;
  const secondaryArrivals = newArrivals.slice(1);

  if (loading) {
    return (
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
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL HEADER */}
        <div className="max-w-3xl mb-12 sm:mb-16 md:mb-24 flex flex-col gap-3">
          <motion.span 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>The Modern Renaissance</span>
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight"
          >
            New Design Arrivals
          </motion.h1>
          
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-lg font-light tracking-wide"
          >
            Freshly curated silhouettes representing our latest design studies. Handcrafted details, soft textures, and premium cuts tailored for contemporary elegance.
          </motion.p>
        </div>

        {/* STAGGERED GRID LAYOUT */}
        {newArrivals.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-cormorant text-2xl italic text-[#8B6B61]">No new designs currently in catalog.</h2>
            <p className="font-inter text-xs text-[#8B6B61] mt-2">Explore our collections page to view classic silhouettes.</p>
            <div className="mt-6">
              <Link href="/collections" className="inline-flex items-center gap-2 font-cormorant text-xs uppercase tracking-widest font-semibold text-[#3B2B28] hover:text-[#8B6B61] transition-colors">
                <span>View Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* FEATURED ARRIVAL PANEL */}
            {featuredArrival && (
              <section className="mb-16 sm:mb-20 md:mb-28 max-w-5xl mx-auto">
                <div className="editorial-card bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 md:p-10 warm-shadow">
                  <div className="grid gap-10 lg:grid-cols-12 items-center">
                    
                    {/* Hero Product Card */}
                    <div className="lg:col-span-7">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7C2B8]/20 group">
                        <div className="absolute inset-0 bg-[#3B2B28]/5 mix-blend-overlay z-10" />
                        <img 
                          src={featuredArrival.images[0]} 
                          alt={featuredArrival.title} 
                          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Hero Description */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                      <span className="font-inter text-[10px] tracking-[0.2em] text-[#C98E87] uppercase font-bold">
                        Latest Creation
                      </span>
                      
                      <h2 className="font-cormorant text-3xl sm:text-4xl font-light italic text-[#3B2B28] mt-2 leading-tight">
                        {featuredArrival.title}
                      </h2>
                      
                      <p className="font-inter text-xs text-[#8B6B61] mt-1.5 uppercase tracking-widest">
                        {featuredArrival.subcategory}
                      </p>
                      
                      <p className="font-inter text-sm text-[#8B6B61] font-light leading-relaxed mt-4">
                        {featuredArrival.description}
                      </p>

                      <div className="mt-8">
                        <EditorialProductCard product={featuredArrival} aspectRatio="aspect-[16/9]" />
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {/* SECONDARY ARRIVALS */}
            {secondaryArrivals.length > 0 && (
              <section className="mb-16 sm:mb-24">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto items-end">
                  {secondaryArrivals.map((arrival, index) => {
                    const cardConfig = [
                      { pad: "pt-0", aspect: "aspect-[3/4]" },
                      { pad: "md:pb-12", aspect: "aspect-[4/5]" },
                      { pad: "md:pt-16", aspect: "aspect-[3/4]" }
                    ];
                    const config = cardConfig[index % cardConfig.length];

                    return (
                      <div 
                        key={arrival.id} 
                        className={`transition-all duration-700 ${config.pad} hover:-translate-y-1`}
                      >
                        <EditorialProductCard product={arrival} aspectRatio={config.aspect} />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* BRIGHT AND FLOWING BRAND BANNER */}
        <section className="my-20 sm:my-32 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="bg-[#FAF7F2] border-t border-b border-[#E7C2B8]/40 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
            <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
              
              {/* Photo Box */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#E7C2B8]/30 warm-shadow group">
                <div className="absolute inset-0 bg-[#3B2B28]/10 mix-blend-overlay z-10" />
                <img 
                  src="/photos/Gemini_Generated_Image_7p370v7p370v7p37.png" 
                  alt="Crafted texture details" 
                  className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
                />
              </div>

              {/* Campaign Callout */}
              <div className="flex flex-col gap-6 pl-0 md:pl-8">
                <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold">
                  Philosophy of Style
                </span>
                
                <h2 className="font-cormorant text-4xl sm:text-5xl font-light italic leading-tight text-[#3B2B28]">
                  “Intentionally designed to flow with you.”
                </h2>
                
                <div className="w-12 h-[1px] bg-[#C98E87] my-1" />
                
                <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed font-light">
                  Our creations seek to bridge the gap between traditional grace and contemporary comfort. Tailored with care in our atelier, they celebrate structural balance and premium fabrics that wear beautifully day and night.
                </p>

                <div className="mt-4">
                  <Link 
                    href="/collections" 
                    className="inline-flex items-center gap-2 font-cormorant text-xs uppercase tracking-widest font-semibold text-[#3B2B28] hover:text-[#8B6B61] transition-colors group"
                  >
                    <span>Browse All Collections</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
