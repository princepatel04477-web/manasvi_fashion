import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Western Wear in Surat | Designer Western Dresses - Manasvi Fashion",
  description: "Shop the best designer western wear in Surat. Explore our premium collection of western dresses, tunic tops, and one-piece outfits at Manasvi Fashion.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/western-wear-surat",
  },
};

export default function WesternWearSuratPage() {
  const faqs = [
    {
      q: "What does your western wear collection in Surat include?",
      a: "Our collection features designer western wear, including elegant one-piece dresses, structured tunic tops, flowy maxi dresses, midi dresses, and casual trousers designed with contemporary western aesthetics and local fabric sourcing."
    },
    {
      q: "Are these western outfits suitable for warm Indian weather?",
      a: "Yes, absolutely. We prioritize breathable natural fabrics, including premium cotton, lightweight linen, organic khadi, and soft viscose crepes. They keep you cool and comfortable all day long."
    },
    {
      q: "Do you ship your western wear collection outside Surat?",
      a: "Yes, we ship internationally and across India. You can explore and buy our western wear online through our secure e-commerce clothing store."
    },
    {
      q: "Can I customize the sizes for western dresses?",
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
          <span className="text-[#C98E87] font-semibold">Western Wear</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Western Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Western Wear in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Discover a sophisticated collection of western dresses and contemporary drapes crafted for modern elegance in Surat.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Elevate Your Everyday Style with Western Wear in Surat
            </h2>
            <p>
              In the fast-paced, cosmopolitan world we live in, finding the perfect balance between comfort and modern style is essential for every woman. For those seeking premium options in Gujarat, finding high-quality <strong>western wear surat</strong> is key to building a highly functional and sophisticated wardrobe. At Manasvi Fashion, we specialize in designing <strong>designer western wear surat</strong> that brings clean lines, modern fits, and premium fabrics together. Our collections of <strong>women clothing surat</strong> are created to celebrate contemporary silhouettes, allowing you to carry yourself with ease and confidence.
            </p>
            <p>
              Located in the historic <strong>Surat textile hub</strong> in Gujarat, India, our brand is dedicated to utilizing the city&apos;s rich textile expertise to create high-fashion drapes. We select only the finest natural fabrics, including breathable cotton blends, lightweight linens, and flowing viscose crepes, to construct our outfits. This dedication to authentic local sourcing ensures that every garment in our <strong>women wear collection surat</strong> feels exceptionally soft against the skin, remains highly breathable, and retains its shape over time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              A Western Collection for Every Occasion: Casual to Party Wear
            </h2>
            <p>
              We believe that luxury should be adaptable to your daily schedule. That is why our western wear collection features a variety of styles, fits, and lengths to suit different aspects of your life:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Casual & Midi Outfits:</strong> Designed for daily comfort, our <strong>casual wear surat</strong> features relaxed drapes, comfortable pockets, and soft neutral colorways. These cotton and linen pieces are perfect for brunch dates, shopping trips, or travelling in style.
              </li>
              <li>
                <strong>Western Dresses:</strong> We offer a gorgeous selection of <strong>western dresses in surat</strong>, ranging from structured midi dresses and formal office wear styles to flowing maxis. These outfits offer clean drapes and minimalist detailing, perfect for transitioning from daytime professional wear to evening outings.
              </li>
              <li>
                <strong>Designer One-Pieces:</strong> Our collection of <strong>one piece dress surat</strong> presents flowy georgette and viscose crepe silhouettes adorned with delicate sequins and block prints, providing an excellent choice for parties, dinners, or festive celebrations.
              </li>
            </ul>
            <p>
              We avoid mass-produced designs, choosing instead to focus on small-batch collections where every seam and cut is checked for quality. This commitment to exclusivity and craftsmanship has established us as a primary source for <strong>modern women clothing in surat</strong> and a trusted <strong>women apparel surat</strong> brand.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Sourcing and the Charm of Gujarat Craftsmanship
            </h2>
            <p>
              What sets our western garments apart from other stores is our dedication to local sourcing. We combine contemporary western drapes with the rich textile history of Gujarat, creating <strong>western wear gujarat</strong> that carries the soul of regional craftsmanship. We work closely with skilled local weavers, dyers, and artisans to create garments that represent the true spirit of modern Indian fashion.
            </p>
            <p>
              We believe in slow fashion, which means we invest time in refining fits, checking stitch strengths, and selecting colors that hold their richness. By utilizing natural, breathable materials, we ensure that our western wear feels premium and remains comfortable throughout the day. This commitment to quality has made us a top <strong>surat clothing boutique</strong> and a premier <strong>women apparel store surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Enjoy Seamless Online Shopping and Boutique Styling
            </h2>
            <p>
              We are committed to making your shopping experience as simple, secure, and pleasant as possible. Our online store is optimized to make browsing and purchasing convenient. You can explore our entire catalog of <strong>western wear online surat</strong>, select your size, and enjoy fast, reliable delivery. We provide secure payment gateways and ship internationally.
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
                href="/one-piece" 
                className="px-6 py-3 rounded-xl border border-[#3B2B28]/25 font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300 cursor-pointer"
              >
                Shop One Piece
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
