"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, ShoppingBag, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

function FailureContent() {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error") || "Transaction could not be completed at this time.";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Cinematic Interrupted Card */}
      <div className="rounded-2xl border border-amber-200/40 bg-white/80 backdrop-blur-md p-8 sm:p-10 warm-shadow text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />
        
        {/* Elegant warning icon */}
        <div className="w-16 h-16 bg-[#FAF7F2] rounded-full border border-[#E7C2B8]/50 flex items-center justify-center mx-auto mb-6 relative shadow-sm text-[#C98E87]">
          <AlertCircle className="w-6 h-6 stroke-[1.5px]" />
        </div>

        <span className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#C98E87] font-semibold">Transaction Suspended</span>
        <h2 className="font-cormorant text-3xl sm:text-4xl font-light italic text-[#3B2B28] mt-3 mb-4 leading-tight">
          Payment Incomplete
        </h2>
        <div className="w-12 h-[1px] bg-[#C98E87]/60 mx-auto mb-5" />
        
        {/* Error text */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7C2B8]/20 max-w-sm mx-auto mb-6">
          <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
            {errorMsg}
          </p>
        </div>

        <p className="font-inter text-xs text-[#8B6B61] leading-relaxed max-w-md mx-auto font-light">
          Your selected garments remain completely safe in your shopping cart. You can retry the secure checkout transaction or modify your items in the cart.
        </p>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/checkout"
          className="flex-1 py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold text-center hover:bg-[#8B6B61] hover:translate-y-[-1px] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C98E87]" />
          <span>Retry Secure Payment</span>
        </Link>
        <Link
          href="/cart"
          className="flex-1 py-4 border border-[#E7C2B8] text-[#3B2B28] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold text-center hover:bg-white hover:border-[#8B6B61] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#C98E87]" />
          <span>Modify Wardrobe Cart</span>
        </Link>
      </div>

      {/* Concierge support block */}
      <div className="p-6 rounded-2xl border border-[#E7C2B8]/20 bg-white/40 backdrop-blur-md flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E7C2B8]/40 flex items-center justify-center text-[#C98E87] flex-shrink-0">
          <HelpCircle className="w-4 h-4 stroke-[1.5px]" />
        </div>
        <div className="space-y-1 text-left font-inter text-xs text-[#8B6B61] font-light leading-relaxed">
          <span className="font-medium text-[#3B2B28] block">Need Checkout Assistance?</span>
          <p>
            If your funds were deducted but your status remains unpaid, please copy your payment identifier and reach out to our concierge team at <span className="font-medium text-[#3B2B28]">concierge@manasvifashion.com</span> for instant resolution.
          </p>
        </div>
      </div>

    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
        {/* Background accents */}
        <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-8 font-inter text-[10px] text-[#8B6B61] tracking-widest uppercase flex items-center gap-1.5 font-light">
            <Link href="/" className="hover:text-[#3B2B28] transition-colors">Atelier</Link>
            <ChevronRight className="w-3 h-3 text-[#E7C2B8]" />
            <Link href="/checkout" className="hover:text-[#3B2B28] transition-colors">Checkout</Link>
            <ChevronRight className="w-3 h-3 text-[#E7C2B8]" />
            <span className="text-[#3B2B28] font-medium">Acquisition Failure</span>
          </div>

          {/* Title Studio Header */}
          <div className="max-w-3xl mb-12 flex flex-col gap-3">
            <h1 className="font-cormorant text-4xl sm:text-5xl font-light italic leading-tight">
              Checkout Suspended
            </h1>
            <div className="w-16 h-[1.5px] bg-[#C98E87]" />
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <div className="w-12 h-12 rounded-full border border-[#E7C2B8]/40 border-t-[#C98E87] animate-spin mb-4" />
                <p className="font-cormorant text-lg italic text-[#8B6B61]">Preparing signature atelier access...</p>
              </div>
            }
          >
            <FailureContent />
          </Suspense>

        </div>
      </main>
    </PageTransition>
  );
}
