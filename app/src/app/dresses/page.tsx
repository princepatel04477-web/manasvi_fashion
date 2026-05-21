"use client";

import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function DressesPage() {
  const { products, loading } = useShop();

  // Filter Dresses dynamically
  const dresses = products.filter(
    (p) => p.productType === "dress"
  );

  // Group dresses for creative asymmetrical pairings
  const campaignPairs = dresses.slice(0, 2);
  const secondaryPairs = dresses.slice(2);

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
      <div className="absolute top-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CAMPAIGN INTRODUCTION */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28 flex flex-col items-center gap-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Campaign Lookbook</span>
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-cormorant text-5xl sm:text-6xl md:text-7xl font-light italic leading-[1.1] tracking-tight"
          >
            Dresses Designed to Flow Effortlessly
          </motion.h1>
          
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light"
          >
            Modern silhouettes crafted with softness, movement, and understated elegance. Intentionally curated to capture emotional warmth.
          </motion.p>
        </div>

        {/* DOUBLE-HEIGHT CAMPAIGN COLLAGE LAYOUT */}
        {campaignPairs.length > 0 && (
          <section className="mb-28 max-w-5xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2 items-start">
              
              {/* Card 1: Left column - standard lookbook card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
              >
                <EditorialProductCard product={campaignPairs[0]} aspectRatio="aspect-[3/4]" />
                <div className="pl-6 border-l border-[#C98E87]/40 py-2">
                  <p className="font-cormorant text-lg italic text-[#8B6B61]">"Sculpted for movement."</p>
                  <p className="font-inter text-[11px] text-[#8B6B61] mt-1 font-light leading-relaxed">
                    Designed to flow with your body naturally, featuring organic textures and elegant sleeve finishes.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Right column - offset with padding and double-height aspect */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-6 md:pt-20"
              >
                <EditorialProductCard product={campaignPairs[1]} aspectRatio="aspect-[2/3]" />
              </motion.div>

            </div>
          </section>
        )}

        {/* HIGH-FASHION STORY PANEL: "TIMELESS SILHOUETTES" */}
        <section className="my-32 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
          <div className="relative h-[65vh] sm:h-[75vh] w-full flex items-center justify-center">
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

        {/* SECONDARY CAMPAIGN SPREAD */}
        {secondaryPairs.length > 0 && (
          <section className="mt-28 max-w-5xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2 items-start">
              
              {/* Card 3: Left column - offset with padding */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6 md:pt-16"
              >
                <EditorialProductCard product={secondaryPairs[0]} aspectRatio="aspect-[2/3]" />
              </motion.div>

              {/* Card 4: Right column - standard aspect ratio */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                <EditorialProductCard product={secondaryPairs[1]} aspectRatio="aspect-[3/4]" />
                <div className="pl-6 border-l border-[#C98E87]/40 py-2">
                  <p className="font-cormorant text-lg italic text-[#8B6B61]">"Crafted for modern grace."</p>
                  <p className="font-inter text-[11px] text-[#8B6B61] mt-1 font-light leading-relaxed">
                    Sculpted to present elegant silhouettes with fluid movement, perfect for day styling or wedding celebrations.
                  </p>
                </div>
              </motion.div>

            </div>
          </section>
        )}

      </div>
    </main>
  );
}
