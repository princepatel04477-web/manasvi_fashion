"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, Truck, Clock, Coins, Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import PageTransition from "@/components/PageTransition";

export default function ShippingPage() {
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
              Shipping & Atelier Delivery
            </h1>
            <div className="w-16 h-[1.5px] bg-[#C98E87]" />
            <p className="font-inter text-sm text-[#8B6B61] tracking-wide font-light max-w-xl">
              Details regarding dispatch transit times, standard delivery charges, and wholesale boutique options.
            </p>
          </div>

          {/* Shipping Policies Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* NO FREE SHIPPING CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 flex-shrink-0">
                  <Truck className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    No Free Shipping
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    We do not offer free delivery or free shipping under any order values. All shipments require shipping charges.
                  </p>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    A standard flat delivery fee of <strong className="font-semibold text-[#3B2B28]">₹150</strong> is charged extra on all orders across India to cover premium packaging and secure logistics.
                  </p>
                </div>
              </div>
            </div>

            {/* ARTISANAL DISPATCH TIMELINE CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-[#E7C2B8]/20 text-[#8B6B61] flex-shrink-0">
                  <Clock className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Tailoring & Dispatch
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    Every garment is prepared with boutique care. Please allow <strong className="font-semibold text-[#3B2B28]">2 to 4 business days</strong> for tailoring, handcrafted adjustments, and secure packaging at our Surat studio prior to shipment.
                  </p>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    Once dispatched, transit generally takes 3 to 5 business days for delivery to your shipping destination.
                  </p>
                </div>
              </div>
            </div>

            {/* WHOLESALE ORDER INQUIRY CARD */}
            <div className="policy-item bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-stone-50 text-stone-700 flex-shrink-0">
                  <Sparkles className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-light text-[#3B2B28] italic">
                    Wholesale Inquiries & Special Shipping
                  </h3>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    We welcome bulk inquiries and wholesale partnerships from boutiques worldwide. Special shipping and freight options can be arranged depending on catalog volume.
                  </p>
                  <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                    To register your wholesale business, please submit details through our <Link href="/contact" className="text-[#C98E87] underline hover:text-[#3B2B28] font-medium">Inquiry Form</Link> (choose &ldquo;Wholesale Inquiry / Partnership&rdquo;) or reach our styling concierge at +91 90993 69035.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Help Strip */}
          <div className="policy-item p-6 border border-[#E7C2B8]/30 bg-white/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-cormorant text-sm italic text-[#8B6B61] text-center sm:text-left">
              &ldquo;Have questions about wholesale courier rates or special delivery requirements? Connect with us.&rdquo;
            </p>
            <a
              href="https://wa.me/919099369035?text=Hi%20Manasvi%20Fashion,%20I'm%20inquiring%20about%20wholesale%20rates%20and%20shipping."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#3B2B28] hover:bg-[#8B6B61] text-[#FAF7F2] rounded-xl font-inter text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#C98E87]" />
              Shipping Help
            </a>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
