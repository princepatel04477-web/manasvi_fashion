"use client";

import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TunicTopsPage() {
  const { products, loading } = useShop();

  // Filter Tunic Tops dynamically
  const tunicTops = products.filter(
    (p) => p.productType === "tunic_top"
  );

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
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* EDITORIAL HEADER */}
        <div className="max-w-3xl mb-16 md:mb-24 flex flex-col gap-3">
          <motion.span 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Contemporary Essentials</span>
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight"
          >
            Contemporary Tunic Essentials
          </motion.h1>
          
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed max-w-lg font-light tracking-wide"
          >
            Relaxed silhouettes crafted for modern everyday elegance. Seamless blends of contemporary cuts with warm boutique charm.
          </motion.p>
        </div>

        {/* STAGGERED HORIZONTAL LOOKBOOK GRID */}
        {tunicTops.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-cormorant text-2xl italic text-[#8B6B61]">No tunics currently in stock.</h2>
            <p className="font-inter text-xs text-[#8B6B61] mt-2">Check back shortly as new designs arrive in our studio.</p>
          </div>
        ) : (
          <section className="mb-24 md:mb-32">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto items-end">
              {tunicTops.map((tunic, index) => {
                // Different aspect ratios and top padding to create lookbook variance
                const cardConfig = [
                  { pad: "pt-0", aspect: "aspect-[3/4]" },
                  { pad: "md:pb-12", aspect: "aspect-[4/5]" },
                  { pad: "md:pt-16", aspect: "aspect-[3/4]" }
                ];
                const config = cardConfig[index % cardConfig.length];

                return (
                  <div 
                    key={tunic.id} 
                    className={`transition-all duration-700 ${config.pad} hover:-translate-y-1`}
                  >
                    <EditorialProductCard product={tunic} aspectRatio={config.aspect} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MOVEMENT STORY PANEL */}
        <section className="my-32 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="bg-[#FAF7F2] border-t border-b border-[#E7C2B8]/40 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
            <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-center">
              
              {/* Photo Box */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#E7C2B8]/30 warm-shadow group">
                <div className="absolute inset-0 bg-[#3B2B28]/10 mix-blend-overlay z-10" />
                <img 
                  src="/photos/Gemini_Generated_Image_h8k8lch8k8lch8k8.png" 
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
  );
}
