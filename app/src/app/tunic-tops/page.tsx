"use client";

import { useShop } from "@/context/shop-context";
import { ProductGridSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import LookbookCatalog from "@/components/lookbook-catalog";

export default function TunicTopsPage() {
  const { loading } = useShop();

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />

        <LuxuryTransition isLoading={loading} fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <ProductGridSkeleton count={4} />
          </div>
        }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <LookbookCatalog initialTab="Tunics" />
          </div>
        </LuxuryTransition>
      </main>
    </PageTransition>
  );
}

