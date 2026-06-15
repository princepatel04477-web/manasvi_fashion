"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, RefreshCw, AlertTriangle, FileVideo, ShieldAlert, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import PageTransition from "@/components/PageTransition";

export default function ReturnsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".policy-item");
    const targets = Array.from(items);

    // Initial opacity state
    targets.forEach((target) => {
      (target as HTMLElement).style.opacity = "0";
      (target as HTMLElement).style.transform = "translateY(15px)";
    });

    // Animate elements sequentially
    animate(targets, {
      opacity: [0, 1],
      translateY: [15, 0],
      delay: stagger(100),
      duration: 600,
      easing: "easeOutQuad",
    });
  }, []);

  return (
    <PageTransition>
      <main
        ref={containerRef}
        className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 md:pb-36 px-6 relative overflow-hidden soft-grain"
      >
        {/* Ambient background glows */}
        <div className="absolute top-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
          
          {/* Breadcrumbs & Back */}
          <div className="policy-item flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B6B61] hover:text-[#3B2B28] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Atelier</span>
            </Link>
            <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atelier Curation</span>
            </span>
          </div>

          {/* Header Title */}
          <div className="policy-item space-y-4">
            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight text-[#3B2B28]">
              Return & Exchange Studio
            </h1>
            <div className="w-16 h-[1.5px] bg-[#C98E87]" />
            <p className="font-inter text-sm text-[#8B6B61] tracking-wide font-light max-w-xl">
              Please review our strict return and exchange guidelines carefully prior to placing your boutique order.
            </p>
          </div>

          {/* Return & Exchange Policies Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* NO RETURN NO EXCHANGE CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Strict Return Policy
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    We maintain a strict <strong className="font-semibold text-amber-800">No Return & No Exchange</strong> policy on all custom products, signature Kurtis, designer dresses, and boutique items.
                  </p>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] font-inter text-amber-900 leading-normal font-light">
                    Every piece is crafted meticulously at our atelier. Orders are final once confirmed.
                  </div>
                </div>
              </div>
            </div>

            {/* ONLY SIZE EXCHANGE CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <RefreshCw className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Only Size Exchange
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    We only support exchanges for <strong className="font-semibold text-emerald-800">Size discrepancies</strong> of the same design. No replacements for color, patterns, or different styles are permitted.
                  </p>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    To initiate a size exchange, please contact our styling concierge on WhatsApp at <strong className="text-[#3B2B28] font-semibold">+91 90993 69035</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* VIDEO PROOF CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 flex-shrink-0">
                  <FileVideo className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Mandatory Package Opening Video Proof
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    It is <strong className="font-semibold text-rose-800">absolutely mandatory to record a continuous unboxing video</strong> of the package from the moment you start opening it. The video must show the shipping label clearly and be unedited.
                  </p>
                  <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-xs font-inter text-rose-900 leading-relaxed font-light">
                    <strong>Important Warning:</strong> If you do not have video proof of product opening showing the discrepancy or defect, we will be unable to process any exchange under any circumstances.
                  </div>
                </div>
              </div>
            </div>

            {/* COURIER CHARGES & DEFECTIVE PIECES CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Courier Charges & Defective Pieces
                  </h3>
                  <div className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light space-y-3">
                    <p>
                      <strong>Courier Charges:</strong> For size exchanges, the courier charges to send the item back to our atelier and receive the exchange piece must be fully paid by the customer.
                    </p>
                    <p>
                      <strong>Defective (Default) Pieces:</strong> If you receive a damaged or defective piece, you must contact us immediately at <strong className="text-[#3B2B28] font-semibold">+91 90993 69035</strong> with your video proof for verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WHOLESALE INQUIRIES CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-[#E7C2B8]/20 text-[#8B6B61] flex-shrink-0">
                  <Sparkles className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Wholesale Inquiries
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    Are you a wholesaler looking to partner with us? We offer dedicated bulk pricing catalog rates.
                  </p>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    Please submit your inquiry through our dedicated <Link href="/contact" className="text-[#C98E87] underline hover:text-[#3B2B28] font-medium">Inquiry Form</Link> (select &ldquo;Wholesale Inquiry / Partnership&rdquo; category) or reach our concierge directly on WhatsApp.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Help Strip */}
          <div className="policy-item p-6 border border-[#E7C2B8]/30 bg-white/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-cormorant text-sm italic text-[#8B6B61] text-center sm:text-left">
              &ldquo;Need styling advice or sizing confirmation before buying? Call or WhatsApp our concierge.&rdquo;
            </p>
            <a
              href="https://wa.me/919099369035?text=Hi%20Manasvi%20Fashion,%20I%20have%20questions%20about%20sizing%20and%20exchange%20policies."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#3B2B28] hover:bg-[#8B6B61] text-[#FAF7F2] rounded-xl font-inter text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#C98E87]" />
              Stylist Hotline
            </a>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
