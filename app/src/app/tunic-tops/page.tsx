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
            
            {/* Category SEO Description Panel */}
            <div className="mt-16 border-t border-[#E7C2B8]/40 pt-16 max-w-4xl mx-auto">
              <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold block mb-3 text-center">
                Atelier Narrative
              </span>
              <h2 className="font-serif text-2xl text-[#3B2B28] text-center mb-8">
                Designer Tunics in Surat – Fusion Elegance
              </h2>
              <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mb-8" />
              
              <div className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light space-y-6 text-justify">
                <p>
                  Discover the beautiful fusion of ease, structure, and contemporary styling with the <strong>latest tunics surat</strong> and <strong>premium tunics surat</strong> collection from Manasvi Fashion. Designed as versatile staples for the modern wardrobe, our <strong>women tunics surat</strong> bridge the gap between traditional Indian ethnic wear and global western fashion. Whether you are dressing for a busy day at the office, meeting friends for brunch, or going on a weekend getaway, our tunics provide the perfect solution. Each piece is crafted from premium natural fibers, including high-grade cotton, pure linen, and soft khadi, ensuring a luxurious feel and a silhouette that flows effortlessly.
                </p>
                <p>
                  If you are looking for <strong>cotton tunics surat</strong>, our collection features breathable, lightweight tops that are perfect for warm climates and daily comfort. Our <strong>office wear tunics surat</strong> and <strong>casual tunics surat</strong> are tailored with precision, featuring clean necklines, elegant sleeve structures, and convenient pockets. These <strong>modern tunics surat</strong> and <strong>trendy tunics surat</strong> are easy to style and pair beautifully with trousers, leggings, or casual denim, making them a highly practical choice for daily wear. At our fashion boutique, we ensure that every design is created with detail, offering <strong>stylish tunics surat</strong> and <strong>fashion tunics surat</strong> that elevate your everyday style.
                </p>
                <p>
                  Explore our dedicated <strong>tunic collection surat</strong> to find a variety of styles, from hand-embroidered details to classic solid blocks. We focus on creating timeless silhouettes that celebrate clean design and functional utility rather than fleeting fashion cycles. When you shop at Manasvi Fashion, you experience the best of online fashion shopping, complete with secure checkout, custom sizing, and reliable customer service. Find your perfect tunic today and enjoy a style that is designed with grace, worn with absolute confidence, and made to last.
                </p>
                <p>
                  Our <strong>designer tunic tops surat</strong> are created in partnership with skilled local artisans in the Surat textile hub. By choosing our collection, you are supporting authentic, regional textile sourcing and local Gujarat craftsmanship. From classic long tunics to short chic tunic tops, each garment is made with careful attention to stitching, hem finishes, and premium fabric selection. We aim to offer affordable luxury without compromising on quality, which is why each piece is designed to be highly durable and easy to maintain. Visit our Surat boutique studio or browse our online platform to discover our collection of premium, stylish tops that enrich your daily wardrobe with quiet luxury.
                </p>
              </div>
            </div>
          </div>
        </LuxuryTransition>
      </main>
    </PageTransition>
  );
}

