"use client";

import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function KurtisPage() {
  const { products, loading } = useShop();

  // Filter Kurtis dynamically
  const kurtis = products.filter(
    (p) => p.productType === "kurti"
  );

  // Define Featured Hero (first kurti) and regular lookbook kurtis
  const featuredHero = kurtis[0] || null;
  const secondaryKurtis = kurtis.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#8B6B61] border-t-transparent rounded-full animate-spin" />
          <span className="font-cormorant text-sm uppercase tracking-widest text-[#8B6B61]">Entering Atelier...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[12%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL HERO HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>The Art of Silhouette</span>
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-[1.1] tracking-tight"
          >
            Kurtis for Everyday Elegance
          </motion.h1>
          
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light"
          >
            Timeless silhouettes designed for comfort, movement, and effortless sophistication. Handcrafted to move with grace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 animate-bounce"
          >
            <ArrowDown className="w-4 h-4 text-[#C98E87]" />
          </motion.div>
        </div>

        {/* FEATURED CAMPAIGN HERO PANEL */}
        {featuredHero && (
          <section className="mb-16 sm:mb-24 md:mb-32">
            <div className="editorial-card bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 md:p-10 warm-shadow">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                
                {/* Hero Product Card */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E7C2B8]/20 group">
                    <div className="absolute inset-0 bg-[#3B2B28]/5 mix-blend-overlay z-10" />
                    <img 
                      src={featuredHero.images[0]} 
                      alt={featuredHero.title} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Hero Description & Quick Swatches */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <span className="font-inter text-[10px] tracking-[0.2em] text-[#C98E87] uppercase font-bold">
                    Signature Campaign
                  </span>
                  
                  <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic text-[#3B2B28] mt-2 leading-tight">
                    {featuredHero.title}
                  </h2>
                  
                  <p className="font-inter text-xs text-[#8B6B61] mt-1.5 uppercase tracking-widest">
                    {featuredHero.subcategory}
                  </p>
                  
                  <p className="font-inter text-sm text-[#8B6B61] font-light leading-relaxed mt-4">
                    {featuredHero.description}
                  </p>

                  <div className="mt-8">
                    <EditorialProductCard product={featuredHero} aspectRatio="aspect-[16/9]" />
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ASYMMETRICAL STAGGERED LOOKBOOK GRID */}
        {secondaryKurtis.length > 0 && (
          <section className="mb-24">
            <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              {secondaryKurtis.map((kurti, index) => {
                // Alternating margins and offsets to create a true lookbook magazine feel
                const isEven = index % 2 === 0;
                const alignmentClass = isEven ? "md:translate-y-8" : "md:-translate-y-8";
                
                return (
                  <div 
                    key={kurti.id} 
                    className={`transition-all duration-700 ${alignmentClass} hover:translate-y-0`}
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
  );
}
