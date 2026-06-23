import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Premium Dresses in Surat | Luxury One-Piece Collection - Manasvi Fashion",
  description: "Shop premium designer dresses in Surat. Explore our collection of elegant casual, party wear, western, and luxury one-piece dresses at Manasvi Fashion.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/premium-dresses-surat",
  },
};

export default function PremiumDressesSuratPage() {
  const faqs = [
    {
      q: "What types of dresses are available in your collection?",
      a: "Our collection features designer dresses in Surat, including elegant one-piece dresses, western dresses, flowy maxi dresses, structured midi dresses, and hand-embroidered fusion wear suitable for casual, office, or party wear."
    },
    {
      q: "What fabrics are used to construct these premium dresses?",
      a: "We use high-grade natural and blended fibers sourced directly in Surat. This includes breathable linens, flowing viscose crepes, soft georgettes, and organic cotton blends to ensure a beautiful drape and excellent comfort."
    },
    {
      q: "How can I purchase these dresses online in Surat?",
      a: "You can easily buy dresses online in Surat through our online clothing store. We offer detailed descriptions of fabric, color shade, and size guides, along with secure payment and fast home delivery."
    },
    {
      q: "Can I schedule a dress fitting at your boutique studio?",
      a: "Yes, we encourage local customers to book a private styling consultation at our Surat boutique studio in Mota Varachha. Our designers will assist you with custom sizes and styling options."
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
          <span className="text-[#C98E87] font-semibold">Premium Dresses</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Couture Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Premium Dresses in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Explore our curated selection of luxury designer dresses, crafted with modern silhouettes and authentic fabrics in Surat.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Step into Elegance with Premium Dresses in Surat
            </h2>
            <p>
              In the world of fashion, the right dress has the power to transform a look, conveying poise, grace, and effortless confidence. For women looking for high-quality, modern attire in Gujarat, finding a dedicated <strong>dress boutique surat</strong> is key to creating a sophisticated wardrobe. At Manasvi Fashion, we specialize in designing <strong>premium dresses surat</strong> and <strong>designer dresses surat</strong> that combine the finest western wear aesthetics with intricate, hand-crafted detail. Our collections of <strong>women dresses surat</strong> are carefully tailored to meet the lifestyle needs of modern, cosmopolitan women.
            </p>
            <p>
              Whether you are looking for a beautiful <strong>one piece dress surat</strong> or a versatile <strong>designer dress surat</strong>, our design team works diligently to ensure that every garment drapes flawlessly. We source our fabrics from the local <strong>Surat textile hub</strong>, selecting only premium viscose crepes, breathable cotton blends, and soft georgettes. This authentic sourcing enables us to offer premium garments that feel exceptionally soft and lightweight, ensuring complete comfort for all-day wear.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              A Dress for Every Narrative: From Casual to Party Wear
            </h2>
            <p>
              We believe that luxury should be adaptable. That is why our dress collections features various styles and cuts, designed to suit different occasions:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Casual & Midi Dresses:</strong> Our <strong>casual dress surat</strong> and midi styles are designed for everyday ease. Featuring relaxed drapes, comfortable pockets, and breathable cotton structures, these pieces are perfect for brunch dates, informal gatherings, or travelling.
              </li>
              <li>
                <strong>Western & Indo-Western Styles:</strong> As a leading provider of <strong>western dress surat</strong> and <strong>designer western wear surat</strong>, we offer minimalist, structured drapes that bridge the gap between traditional styling and western silhouettes. These are perfect for semi-formal office wear or evening outings.
              </li>
              <li>
                <strong>Party Wear & Festive Dresses:</strong> For special occasions, our <strong>party wear dress surat</strong> and <strong>elegant dresses surat</strong> present beautiful georgette, crepe, and silk silhouettes adorned with delicate sequins, hand-embroidery, and rich flares that capture the light.
              </li>
            </ul>
            <p>
              We avoid mass-produced designs, choosing instead to release small-batch, curated lines that ensure exclusivity. Our focus on quality and original designs makes our boutique a primary choice for <strong>trendy dresses surat</strong>, <strong>stylish dresses surat</strong>, and the <strong>latest dress collection surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Craftsmanship and Premium Fabric Selection
            </h2>
            <p>
              Every garment in our collection is a testament to the skilled artisans in Surat, Gujarat. We combine Surat&apos;s rich handloom and dye heritage with contemporary western drapes, creating <strong>women fashion dresses surat</strong> and <strong>fashionable dresses surat</strong> that are both culturally rich and globally appealing.
            </p>
            <p>
              Our design process prioritizes slow fashion, meaning we invest time in refining fits, checking seam strengths, and selecting colors that hold their richness over time. We believe in quiet luxury—achieved through clean lines, high-grade fabrics like khadi and viscose crepe, and minimalist details. This dedication has made us a top <strong>dress boutique surat</strong> and the best destination for <strong>dress shopping surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Bespoke Styling and Seamless Online Ordering
            </h2>
            <p>
              At Manasvi Fashion, we make it easy for you to discover your perfect look. Our online store is designed to make <strong>dress shopping surat</strong> convenient, secure, and intuitive. You can browse our entire catalog of <strong>modern dresses surat</strong> and <strong>luxury dresses surat</strong>, select your size, and enjoy fast, reliable delivery.
            </p>
            <p>
              For local residents and visitors, we invite you to book a private styling consultation at our boutique studio in Mota Varachha, Surat. Our professional design team will assist you in selecting styles that flatter your body type, coordinating colorways, and making custom size adjustments to ensure the perfect fit. Experience customer service that is warm, helpful, and premium, and find a piece you will cherish for years to come.
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
              Ready to find your perfect dress?
            </h3>
            <p className="max-w-md text-xs md:text-sm text-[#8B6B61] font-light leading-relaxed">
              Explore our collections online today or visit our Surat studio to schedule a custom fitting and experience boutique luxury.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/dresses" 
                className="px-6 py-3 rounded-xl border border-[#3B2B28]/25 font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300 cursor-pointer"
              >
                Shop Dresses
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
