import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Designer Kurtis in Surat | Premium Kurti Collection - Manasvi Fashion",
  description: "Shop the best designer kurtis in Surat. Browse our premium collection of cotton printed, office wear, daily wear, and ethnic party wear kurtis.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/designer-kurtis-surat",
  },
};

export default function DesignerKurtisSuratPage() {
  const faqs = [
    {
      q: "What types of kurtis does Manasvi Fashion offer in Surat?",
      a: "We offer an extensive range of designer kurtis in Surat, including daily wear cotton printed kurtis, elegant office wear kurtis, long ethnic kurtis, short fusion tunics, and premium embellished party wear kurtis. All are crafted from high-quality local fabrics."
    },
    {
      q: "Which fabrics are best suited for daily wear kurtis?",
      a: "For daily wear and office wear, we highly recommend our cotton kurtis in Surat. We use premium, breathable cotton and organic khadi that keep you comfortable and cool throughout the day while maintaining a crisp, professional drape."
    },
    {
      q: "Where can I shop your latest kurti collection in Surat?",
      a: "You can browse and shop our entire collection online through our e-commerce platform. If you reside in Surat, you can also book a private styling consultation at our boutique studio in Mota Varachha to experience the fabrics and fits in person."
    },
    {
      q: "Do you have size charts or guide details?",
      a: "Yes, we have a comprehensive Size Guide page to help you select the perfect drape. Additionally, we support custom size sizing fits. Feel free to contact our support team via WhatsApp for sizing advice."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-28 pb-20 relative overflow-hidden soft-grain">
      {/* Background ambient glows */}
      <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8B6B61] mb-8 font-inter">
          <Link href="/" className="hover:text-[#3B2B28] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C98E87] font-semibold">Designer Kurtis</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Artisan Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Designer Kurtis in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Discover the elegance of custom-designed, premium kurtis handcrafted in the textile hub of Surat.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Elevate Your Wardrobe with Premium Kurtis in Surat
            </h2>
            <p>
              The Indian kurti has evolved from a traditional garment into a highly versatile wardrobe essential for women worldwide. In Surat, Gujarat, a city known globally as a premier textile hub, the production of ethnic wear has reached a level of artistic perfection. At Manasvi Fashion, we pride ourselves on being a premier <strong>designer kurti store surat</strong>, providing the <strong>best kurti collection surat</strong> that seamlessly merges classical heritage with modern fits. Our collection of <strong>women kurtis surat</strong> is designed for the modern woman who values grace, comfort, and premium fabrics.
            </p>
            <p>
              When you explore our <strong>latest kurti collection surat</strong>, you will discover that each piece is crafted with absolute care. We select only the finest natural fabrics, including breathable cotton, premium linen, and flowing viscose crepes. By marrying high-quality materials with detailed stitching, we create <strong>designer kurtis surat</strong> and <strong>premium kurtis surat</strong> that drape beautifully and feel comfortable against the skin, making them perfect for warm climates and active lifestyles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              From Office Wear to Festive Occasions: A Style for Every Event
            </h2>
            <p>
              At Manasvi Fashion, we understand that women need versatile clothing that transitions smoothly from professional environments to social gatherings. Our kurti collection is designed with this versatility in mind, offering a variety of categories to suit different occasions:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Daily Wear & Printed Kurtis:</strong> Perfect for daily errands and casual outings, our <strong>daily wear kurtis surat</strong> and <strong>printed kurtis surat</strong> feature traditional block prints, soft pastel shades, and relaxed silhouettes. These lightweight cotton pieces are easy to maintain and provide effortless style.
              </li>
              <li>
                <strong>Office Wear Kurtis:</strong> Our <strong>office wear kurtis surat</strong> are tailored with clean lines, minimalist collar styles, and structured fits. Made from premium cotton and linen blends, these kurtis offer a professional appearance while ensuring you stay cool and comfortable during long working hours.
              </li>
              <li>
                <strong>Party Wear & Ethnic Kurtis:</strong> For celebratory events, weddings, and festivals, we present our range of <strong>party wear kurtis surat</strong> and <strong>ethnic kurtis surat</strong>. These garments feature rich fabrics like georgette and silk-cotton, embellished with hand-detailed embroidery, sequin works, and elegant borders.
              </li>
            </ul>
            <p>
              Whether you prefer <strong>long kurtis surat</strong> that offer a classical, flowing silhouette or <strong>short kurtis surat</strong> designed for a chic, modern look paired with denim, our collection has something for everyone. This dedication to variety and premium styling has established us as a leading <strong>fashion kurtis surat</strong> and <strong>stylish kurtis surat</strong> brand.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Sourcing and the Charm of Surat Artistry
            </h2>
            <p>
              What makes our <strong>cotton kurtis surat</strong> and <strong>traditional kurtis surat</strong> truly special is our commitment to authentic local sourcing. Surat is a city rich in textile history, and we leverage this local expertise to bring you the best designs. We work closely with skilled local printers, weavers, and embroidery artisans in Gujarat to create garments that carry the soul of regional craftsmanship.
            </p>
            <p>
              By focusing on slow fashion, we ensure that each kurti in our boutique is built to stand the test of time. We avoid mass-produced designs, choosing instead to focus on small-batch collections where every stitch and seam is checked for quality. This ensures that when you shop with us, you receive a durable, premium garment that resists fading and holds its shape beautifully over time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Enjoy Effortless Kurti Shopping Online
            </h2>
            <p>
              We believe that luxury should be accompanied by convenience. Our online store is designed to make <strong>kurti shopping surat</strong> simple, intuitive, and secure. You can explore our catalog of <strong>modern kurtis surat</strong> and <strong>trendy kurtis surat</strong>, view high-resolution imagery, and select your size with confidence using our comprehensive size guides. We provide secure payment gateways and reliable shipping options across India and internationally.
            </p>
            <p>
              If you are in Surat, we invite you to visit our boutique studio in Mota Varachha. You can experience the luxurious texture of our fabrics first-hand, explore different colorways, and book a personalized styling session with our designers to find the perfect silhouette for your body shape. We promise a warm, friendly, and customer-focused experience that makes every visit memorable.
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
              Browse our collections online or contact our Surat atelier to schedule a private fitting and find the perfect kurti for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/kurtis" 
                className="px-6 py-3 rounded-xl border border-[#3B2B28]/25 font-serif text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300 cursor-pointer"
              >
                Explore Kurtis
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
