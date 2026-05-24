"use client";

import ProductCard from "@/components/product-card";
import { useShop } from "@/context/shop-context";
import { WishlistSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";

export default function WishlistPage() {
  const { wishlist, products, loading } = useShop();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 px-4 md:px-6 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

        <LuxuryTransition isLoading={loading} fallback={<WishlistSkeleton />}>
          <div className="max-w-7xl mx-auto relative z-10">
            {/* HERO SECTION */}
            <div className="max-w-3xl mb-12 md:mb-16 flex flex-col gap-3 animate-slide-in">
              <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight">
                Your Wishlist
              </h1>
              <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
              <p className="font-inter text-xs sm:text-sm text-[#8B6B61] tracking-wide font-light">
                Your personally curated pieces, saved for your style journey.
              </p>
            </div>

            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 max-w-xl mx-auto">
                <h2 className="font-cormorant text-2xl sm:text-3xl font-light italic mb-3">
                  Your wishlist is empty.
                </h2>
                <p className="font-inter text-xs text-[#8B6B61] font-light mb-8 max-w-sm">
                  Explore our boutique and save your favorite silhouettes here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </LuxuryTransition>
      </main>
    </PageTransition>
  );
}
