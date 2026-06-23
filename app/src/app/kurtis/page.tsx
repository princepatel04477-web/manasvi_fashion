"use client";

import { useShop } from "@/context/shop-context";
import { ProductGridSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import LookbookCatalog from "@/components/lookbook-catalog";

export default function KurtisPage() {
  const { loading } = useShop();

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[12%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[150px] pointer-events-none" />

        <LuxuryTransition isLoading={loading} fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <ProductGridSkeleton count={4} />
          </div>
        }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <LookbookCatalog initialTab="Kurtis" />
            
            {/* Category SEO Description Panel */}
            <div className="mt-16 border-t border-[#E7C2B8]/40 pt-16 max-w-4xl mx-auto">
              <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold block mb-3 text-center">
                Atelier Narrative
              </span>
              <h2 className="font-serif text-2xl text-[#3B2B28] text-center mb-8">
                Designer Kurtis in Surat – Handcrafted Grace
              </h2>
              <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mb-8" />
              
              <div className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light space-y-6 text-justify">
                <p>
                  Welcome to the <strong>latest kurti collection surat</strong> at Manasvi Fashion, your premier <strong>designer kurti store surat</strong>. Our curated range of <strong>women kurtis surat</strong> is designed to honor authentic Indian heritage while meeting the styling needs of the modern lifestyle. Whether you are dressing for a busy day at work, running daily errands, or attending a festive celebration, our collection offers the perfect blend of luxury, fit, and comfort. We select the finest natural fabrics, including breathable cotton, linen, and soft rayon, to ensure that each kurti drapes beautifully against the skin and allows you to move with ease.
                </p>
                <p>
                  If you are looking for <strong>cotton kurtis surat</strong>, our collection features premium, breathable pieces that keep you cool and stylish throughout the day. These are perfect as <strong>daily wear kurtis surat</strong> and <strong>office wear kurtis surat</strong>, offering clean silhouettes, elegant necklines, and subtle detailing. For women who appreciate patterns and hues, our <strong>printed kurtis surat</strong> present a gorgeous array of traditional block prints, floral patterns, and contemporary geometric motifs. These versatile designs make <strong>kurti shopping surat</strong> an absolute joy, giving you multiple options to refresh your wardrobe with outfits that combine professional poise and casual comfort.
                </p>
                <p>
                  For special occasions, we offer a stunning selection of <strong>party wear kurtis surat</strong> and <strong>ethnic kurtis surat</strong>. These <strong>premium kurtis surat</strong> and <strong>designer kurtis surat</strong> feature intricate embroidery, hand-detailed sequins, and exquisite cuts that are sure to make an impact. We work closely with Surat&apos;s finest artisans to create <strong>stylish kurtis surat</strong> and <strong>trendy kurtis surat</strong> that carry the artistic soul of the city. Every piece in our collection represents a commitment to high-quality sourcing, meticulous tailoring, and beautiful drapes.
                </p>
                <p>
                  At Manasvi Fashion, we believe that luxury should be felt in every thread. Our collection of <strong>women kurtis surat</strong> highlights the exquisite craftsmanship of the region&apos;s artisans. From short kurtis suitable for fusion wear to long, elegant ethnic kurtis, each design undergoes rigorous quality checks to ensure perfect styling and durability. When you shop at our <strong>designer kurti store surat</strong>, you receive not only a premium garment but also a commitment to customer-friendly service and reliable delivery. Embrace the charm of traditional craftsmanship combined with modern, comfortable cuts, and find your perfect fit with us today.
                </p>
                <p>
                  If you are looking for <strong>designer kurtis surat</strong> or <strong>premium kurtis surat</strong>, our collection is curated to present quiet elegance and timeless style. As a beloved <strong>kurti shop surat</strong> and the <strong>best kurti store surat</strong>, we offer a wide range of designs that cater to every occasion. Our <strong>cotton kurtis surat</strong> are made from the highest quality breathable cotton, perfect for the warm Indian seasons, while our printed kurtis are ideal for office wear and everyday comfort. For those special occasions, we offer ethnic kurtis and traditional kurtis featuring intricate hand-embroidery, tassel details, and Zari borders. Every single piece is designed to highlight the beauty of <strong>ethnic wear surat</strong>, celebrating the unique textures of hand-woven fabrics and classical prints. Whether you prefer <strong>long kurtis surat</strong> or <strong>short kurtis surat</strong>, our designs provide a flattering drape and complete freedom of movement.
                </p>
              </div>
            </div>
          </div>
        </LuxuryTransition>
      </main>
    </PageTransition>
  );
}

