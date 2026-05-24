"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import PageTransition from "@/components/PageTransition";

interface AtelierStubProps {
  title: string;
  description: string;
}

export default function AtelierStub({ title, description }: AtelierStubProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const brand = el.querySelector(".stub-brand");
    const heading = el.querySelector(".stub-heading");
    const desc = el.querySelector(".stub-desc");
    const divider = el.querySelector(".stub-divider");
    const button = el.querySelector(".stub-button");

    // Initial opacity state
    const targets = [brand, heading, divider, desc, button];
    targets.forEach((target) => {
      if (target) (target as HTMLElement).style.opacity = "0";
    });

    // Animate elements sequentially
    animate(targets.filter(Boolean) as HTMLElement[], {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(150),
      duration: 800,
      easing: "easeOutQuad",
    });
  }, []);

  return (
    <PageTransition>
      <main
        ref={containerRef}
        className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden soft-grain"
      >
      {/* Ambient background glows */}
      <div className="absolute top-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-md mx-auto text-center space-y-6 relative z-10 flex flex-col items-center">
        {/* Brand Signifier */}
        <span className="stub-brand font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Curation</span>
        </span>

        {/* Heading */}
        <h1 className="stub-heading font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28]">
          {title}
        </h1>

        {/* Divider */}
        <div className="stub-divider w-16 h-[1px] bg-[#C98E87] my-1" />

        {/* Description */}
        <p className="stub-desc font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed font-light">
          {description}
        </p>

        {/* Back Button */}
        <div className="stub-button pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C98E87]/40 bg-white/60 backdrop-blur-md text-[#3B2B28] font-inter text-xs uppercase tracking-widest hover:bg-[#FAF7F2] hover:border-[#8B6B61] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Atelier
          </Link>
        </div>
      </div>
    </main>
    </PageTransition>
  );
}
