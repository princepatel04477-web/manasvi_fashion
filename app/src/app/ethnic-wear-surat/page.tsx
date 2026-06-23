import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Ethnic Wear in Surat | Designer Kurtis & Sets - Manasvi Fashion",
  description: "Shop premium designer ethnic wear in Surat. Discover our latest collection of kurtis, tunics, and ethnic outfits at Manasvi Fashion Surat.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/ethnic-wear-surat",
  },
};

export default function EthnicWearSuratPage() {
  const faqs = [
    {
      q: "What does your ethnic wear collection in Surat include?",
      a: "Our collection features designer ethnic wear, including elegant kurtis, kurti sets, fusion tunics, and traditional drapes crafted with high-quality local fabrics."
    },
    {
      q: "Are these ethnic outfits suitable for summer wear?",
      a: "Yes, we prioritize breathable natural fibers, including premium cotton, lightweight linen, organic khadi, and soft viscose crepes. They keep you cool and comfortable all day long."
    },
    {
      q: "Do you ship your ethnic wear collection outside Surat?",
      a: "Yes, we ship internationally and across India. You can explore and buy our ethnic wear online through our secure e-commerce clothing store."
    },
    {
      q: "Can I customize the sizes for ethnic kurtis?",
      a: "Yes, we support custom size sizing fits. You can schedule a styling consultation at our boutique studio in Mota Varachha, Surat, or reach out to our WhatsApp support team with your measurements."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-28 pb-20 relative overflow-hidden soft-grain">
      {/* Background ambient glows */}
      <div className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8B6B61] mb-8 font-inter">
          <Link href="/" className="hover:text-[#3B2B28] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C98E87] font-semibold">Ethnic Wear</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Ethnic Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Ethnic Wear in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Discover a sophisticated collection of designer ethnic wear, crafted with traditional artistry and authentic fabrics in Surat.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Experience the Elegance of Traditional & Modern Ethnic Wear in Surat
            </h2>
            <p>
              In the heart of the Indian subcontinent, clothing has always been a reflection of culture, heritage, and artistic expression. For those seeking premium options in Gujarat, finding high-quality <strong>ethnic wear surat</strong> or <strong>surat ethnic wear</strong> is essential to building a beautiful, culturally rich wardrobe. At Manasvi Fashion, we specialize in designing <strong>designer ethnic wear in surat</strong> and <strong>manasvi fashion ethnic wear</strong> that brings traditional craftsmanship and modern fits together. Our collections of <strong>women clothing surat</strong> are created to celebrate classical Indian drapes, allowing you to carry yourself with ease and confidence.
            </p>
            <p>
              Located in the historic <strong>Surat textile hub</strong> in Gujarat, India, our brand is dedicated to utilizing the city&apos;s rich textile expertise to create high-fashion drapes. We select only the finest natural fabrics, including breathable cotton blends, lightweight linens, and flowing viscose crepes, to construct our outfits. This dedication to authentic local sourcing ensures that every garment in our <strong>women wear collection surat</strong> feels exceptionally soft against the skin, remains highly breathable, and retains its shape over time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              An Ethnic Collection for Every Occasion: Daily Wear to Festive Celebrations
            </h2>
            <p>
              We believe that luxury should be adaptable to your daily schedule. That is why our ethnic wear collection features a variety of styles, fits, and lengths to suit different aspects of your life:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Daily Wear & Cotton Printed Kurtis:</strong> Perfect for everyday comfort, our <strong>daily wear kurtis surat</strong> and <strong>printed kurtis surat</strong> feature traditional block prints, soft pastel shades, and relaxed silhouettes. These lightweight cotton pieces are easy to maintain and provide effortless style.
              </li>
              <li>
                <strong>Office Wear Kurtis & Tunics:</strong> Our office wear options offer clean lines, minimalist collar styles, and structured fits. Made from premium cotton and linen blends, these kurtis offer a professional appearance while ensuring you stay cool and comfortable during long working hours.
              </li>
              <li>
                <strong>Party Wear & Festive Ensembles:</strong> For celebratory events, weddings, and festivals, we present our range of <strong>party wear kurtis surat</strong> and <strong>traditional kurtis surat</strong>. These garments feature rich fabrics like georgette and silk-cotton, embellished with hand-detailed embroidery, sequin works, and elegant borders.
              </li>
            </ul>
            <p>
              We avoid mass-produced designs, choosing instead to focus on small-batch collections where every seam and cut is checked for quality. This commitment to exclusivity and craftsmanship has established us as a primary source for <strong>modern ethnic wear surat</strong> and a trusted <strong>ethnic wear gujarat</strong> brand.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Sourcing and the Charm of Gujarat Craftsmanship
            </h2>
            <p>
              What sets our ethnic garments apart from other stores is our dedication to local sourcing. We combine contemporary western drapes with the rich textile history of Gujarat, creating <strong>ethnic wear online surat</strong> that carries the soul of regional craftsmanship. We work closely with skilled local weavers, dyers, and artisans to create garments that represent the true spirit of modern Indian fashion.
            </p>
            <p>
              We believe in slow fashion, which means we invest time in refining fits, checking stitch strengths, and selecting colors that hold their richness. By utilizing natural, breathable materials, we ensure that our ethnic wear feels premium and remains comfortable throughout the day. This commitment to quality has made us a top <strong>designer kurtis surat</strong> boutique and a premier <strong>premium kurtis surat</strong> brand.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Enjoy Seamless Online Shopping and Boutique Styling
            </h2>
            <p>
              We are committed to making your shopping experience as simple, secure, and pleasant as possible. Our online store is optimized to make browsing and purchasing convenient. You can explore our entire catalog of ethnic wear online, select your size, and enjoy fast, reliable delivery. We provide secure payment gateways and ship internationally.
            </p>
            <p>
              If you reside in Surat or are visiting the city, we invite you to book a private styling consultation at our boutique studio in Mota Varachha. You can work with our design team to select styles that suit you, try on different silhouettes, and explore custom size adjustments. Experience a friendly, customer-focused service that is dedicated to helping you look and feel your absolute best.
            </p>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6 pt-10 border-t border-[#E7C2B8]/40">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug text-center">
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mb-8" />
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/80 border border-[#E7C2B8]/30 rounded-2xl p-6 shadow-[0_10px_30px_-15px_rgba(59,43,40,0.05)]">
                  <h3 className="font-serif text-base md:text-lg text-[#3B2B28] font-medium mb-2">
                    {faq.q}
                  </h3>
                  <p className="font-inter text-xs md:text-sm text-[#8B6B61] leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="pt-10 text-center flex flex-col items-center gap-6">
            <h3 className="font-serif text-xl md:text-2xl text-[#3B2B28] italic font-light">
              Ready to find your perfect fit?
            </h3>
            <p className="max-w-md text-xs md:text-sm text-[#8B6B61] font-light leading-relaxed">
              Explore our collections online today or visit our Surat studio to schedule a custom fitting and experience boutique luxury.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/collections" 
                className="px-6 py-3 rounded-xl border border-[#3B2B28]/25 font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300 cursor-pointer"
              >
                Shop Collections
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 rounded-xl bg-[#3B2B28] text-[#FAF7F2] font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#8B6B61] transition-colors duration-300 shadow-md flex items-center gap-2 cursor-pointer"
              >
                Book Consultation
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </article>
      </div>
    </main>
  );
}
