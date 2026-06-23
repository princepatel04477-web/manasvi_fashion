import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Designer Tunics in Surat | Premium Tunic Tops - Manasvi Fashion",
  description: "Shop designer tunic tops in Surat. Browse our premium collection of cotton, casual, office wear, and stylish tunics at Manasvi Fashion Surat.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/tunics-surat",
  },
};

export default function TunicsSuratPage() {
  const faqs = [
    {
      q: "What makes tunics different from standard kurtis?",
      a: "Tunics feature shorter lengths and contemporary Indo-Western drapes, offering a modern fusion look. They are highly versatile and designed to pair easily with trousers, denim, or skirts, whereas kurtis are typically longer and more traditional."
    },
    {
      q: "What fabric variations do you use for tunic tops?",
      a: "We prioritize breathable natural fibers sourced directly in Surat. This includes high-grade cotton, pure linen, organic khadi, and soft viscose crepes. They provide excellent comfort for daily and office wear."
    },
    {
      q: "Can I wear these tunics to work?",
      a: "Yes, our office wear tunics are designed with clean collars, structured lines, and subtle detailing. They are comfortable for long hours and project a professional, modern look."
    },
    {
      q: "How can I order custom fits or sizes?",
      a: "We support custom size adjustments. You can book a styling session at our boutique studio in Mota Varachha, Surat, or specify your sizing requirements during checkout on our online store."
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
          <span className="text-[#C98E87] font-semibold">Designer Tunics</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Fusion Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Designer Tunics in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Explore our collection of contemporary tunic tops, blending modern silhouettes with Surat&apos;s rich textile heritage.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Discover the Charm of Contemporary Tunics in Surat
            </h2>
            <p>
              In the dynamic landscape of modern fashion, versatility and comfort have become key factors in wardrobe selection. For women looking to balance traditional ethnic values with cosmopolitan designs, finding the perfect fusion wear is essential. At Manasvi Fashion, we specialize in crafting high-quality <strong>tunics surat</strong> and <strong>designer tunics surat</strong> that bridge the gap between traditional Indian craftsmanship and global western trends. Our collection of <strong>women tunics surat</strong> is designed for the modern woman who values ease, comfort, and premium fabrics.
            </p>
            <p>
              Located in the heart of the <strong>Surat textile hub</strong> in Gujarat, India, our brand takes advantage of Surat&apos;s rich handloom and dye heritage. We select only the finest natural fabrics, including breathable cotton, pure linen, textured khadi, and soft viscose crepes, to construct our tunic tops. This authentic local sourcing ensures that every piece in our <strong>tunic collection surat</strong> feels exceptionally soft and remains highly durable, offering a comfortable, flattering drape.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              A Tunic for Every Silhouette: Casual Wear to Office Wear
            </h2>
            <p>
              We believe that clothing should adapt to your schedule. That is why our tunic collection features various cuts, necklines, and fits tailored to different aspects of your life:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Casual & Daily Wear Tunics:</strong> Designed for everyday ease, our <strong>casual tunics surat</strong> feature loose cuts, comfortable pockets, and soft pastel shades. Crafted from breathable cotton, these tops are perfect for warm afternoons, informal gatherings, or running daily errands.
              </li>
              <li>
                <strong>Office Wear Tunic Tops:</strong> Our <strong>office wear tunics surat</strong> offer clean collars, structured hemlines, and professional colors. These drapes are tailored to project a polished appearance while ensuring you stay cool and comfortable during long hours at work.
              </li>
              <li>
                <strong>Modern & Fusion Tunics:</strong> As a leading provider of <strong>modern tunics surat</strong> and <strong>designer tunic tops surat</strong>, we offer asymmetrical cuts, block prints, and delicate hand-embroidery. These pieces pair beautifully with trousers, leggings, or casual denim, making them highly versatile.
              </li>
            </ul>
            <p>
              Our commitment to small-batch production ensures that we avoid mass-produced designs and maintain high quality across all categories. This focus on premium fabrics and original styles has established us as a primary source for <strong>stylish tunics surat</strong>, <strong>trendy tunics surat</strong>, and the <strong>latest tunics surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Sourcing and the Art of Gujarat Craftsmanship
            </h2>
            <p>
              What sets our <strong>cotton tunics surat</strong> and <strong>premium tunics surat</strong> apart is our close collaboration with local weavers, dyers, and block-printing artisans. We combine the historic textile heritage of Surat with contemporary design details to create <strong>fashion tunics surat</strong> and <strong>best tunics surat</strong> that carry the soul of Gujarat craftsmanship.
            </p>
            <p>
              We believe in slow fashion, which means every garment in our atelier undergoes rigorous quality checks. We pay close attention to seam strength, shoulder fits, and color fastness. By using natural materials like organic cotton and khadi, we ensure that our tunics feel premium against the skin and maintain their shape over time, offering long-lasting wardrobe classics.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Enjoy Seamless Online Shopping and Private Styling
            </h2>
            <p>
              We are committed to making your shopping experience as pleasant and convenient as possible. Our online store is optimized to make browsing and purchasing simple and secure. You can explore our entire catalog of <strong>women tops surat</strong>, <strong>fashion tops surat</strong>, <strong>ladies tops surat</strong>, <strong>premium tops surat</strong>, and <strong>western tops surat</strong>. We offer comprehensive size charts and provide secure checkout and reliable shipping options.
            </p>
            <p>
              If you live in Surat or are visiting the city, we invite you to book a private styling consultation at our boutique studio in Mota Varachha. You can work with our design team to select colors that suit you, try on different silhouettes, and explore custom size adjustments. Experience a friendly, customer-focused service that is dedicated to helping you carry yourself with absolute grace.
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
              Ready to find your perfect tunic?
            </h3>
            <p className="max-w-md text-xs md:text-sm text-[#8B6B61] font-light leading-relaxed">
              Explore our collections online today or visit our Surat studio to schedule a custom fitting and experience boutique luxury.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/tunic-tops" 
                className="px-6 py-3 rounded-xl border border-[#3B2B28]/25 font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300 cursor-pointer"
              >
                Shop Tunics
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
