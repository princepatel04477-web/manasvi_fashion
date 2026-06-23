import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Fashion Store in Surat | Luxury Ladies Boutique - Manasvi Fashion",
  description: "Visit Manasvi Fashion, the best fashion store in Surat, Gujarat. Discover premium women's clothing, designer kurtis, tunic tops, and elegant western wear.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/fashion-store-surat",
  },
};

export default function FashionStoreSuratPage() {
  const faqs = [
    {
      q: "Where is Manasvi Fashion located in Surat?",
      a: "Our atelier is located at A, 61, Dharmanandan Row House, Mahadev Chowk, Mota Varachha, Surat, Gujarat - 394101. It is situated in a vibrant textile hub, easily accessible from all parts of the city."
    },
    {
      q: "Do you offer custom tailoring or custom fits?",
      a: "Yes, we specialize in providing custom sizes and fits to ensure absolute comfort and styling. You can schedule a private styling consultation at our boutique studio or contact us online with your exact measurements."
    },
    {
      q: "Can I place bulk orders or wholesale inquiries?",
      a: "Absolutely. Manasvi Fashion is a well-established Surat fashion brand offering wholesale partnerships for retail businesses. Please reach out via our contact form, email, or WhatsApp (+91 90993 69035) for details."
    },
    {
      q: "What fabrics do you specialize in?",
      a: "We specialize in premium natural fibers, including breathable cotton, linen, organic khadi, and flowing viscose crepes. All our fabrics are sourced locally in Surat to support authentic regional craftsmanship."
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
          <span className="text-[#C98E87] font-semibold">Surat Fashion Store</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Surat Boutique Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight text-[#3B2B28] tracking-wide">
            Women&apos;s Fashion Store in Surat, Gujarat
          </h1>
          <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
            Step into the world of Manasvi Fashion, the ultimate fashion destination in the historic textile capital of India.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-stone max-w-none font-inter text-sm md:text-base text-[#8B6B61] leading-relaxed font-light space-y-8 text-justify">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Welcome to Manasvi Fashion – The Best Fashion Store in Surat
            </h2>
            <p>
              Finding a premium <strong>fashion store surat</strong> that perfectly balances heritage craftsmanship with contemporary aesthetics can be a delightful journey. At Manasvi Fashion, we have curated a space that celebrates the essence of <strong>women fashion surat</strong> and <strong>ladies fashion surat</strong>. Sourcing high-quality fabrics directly from the heart of the <strong>Surat textile hub</strong> in Gujarat, India, our boutique offers a luxurious selection of garments designed for the modern woman who values style, ease, and comfort. We are recognized as the <strong>best fashion store in surat</strong> and the go-to <strong>ladies clothing store surat</strong> for those looking to build a timeless wardrobe of elegant silhouettes.
            </p>
            <p>
              As a dedicated <strong>surat fashion brand</strong>, our mission is to offer <strong>premium women fashion in surat</strong> that honors the rich textile legacy of our city while incorporating modern, cosmopolitan styling. Whether you are searching for daily wear, office wear, or a statement piece for a festive occasion, our collections of <strong>women clothing surat</strong> are created to help you express your individuality with grace. We believe that clothing should feel like poetry in motion, which is why we place so much emphasis on drape, fabric quality, and attention to detail.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              A Curated Selection of Ethnic and Western Wear
            </h2>
            <p>
              At our <strong>fashion boutique surat</strong>, we offer a versatile collection of both traditional and modern garments. Our designs integrate classical Indian elements with contemporary proportions, ensuring that every piece is both wearable and unique. As a leading <strong>fashion boutique in surat gujarat</strong>, we present categories that suit different aspects of a modern woman&apos;s lifestyle:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>
                <strong>Designer Kurtis & Sets:</strong> We offer some of the most <strong>stylish kurtis in surat</strong>. Crafted from premium breathable cotton, rich linen, and soft viscose crepes, our kurtis feature intricate hand-embroidery, block prints, and classic necklines. It is no wonder many consider us the <strong>best kurti store surat</strong>.
              </li>
              <li>
                <strong>Designer Tunics & Tops:</strong> Our <strong>designer tunics in surat</strong> are perfect for women seeking comfortable fusion wear. These tops pair effortlessly with denim or trousers, making them an excellent choice for casual outings or semi-formal office environments.
              </li>
              <li>
                <strong>Premium Dresses & One-Pieces:</strong> From flowing midi dresses to elegant <strong>one piece dresses surat</strong>, our collection focuses on light, breathable silhouettes that transition beautifully from daytime wear to evening festivities.
              </li>
            </ul>
            <p>
              By offering a diverse <strong>women wear collection surat</strong>, we ensure that every client finds exactly what they need. We avoid mass-produced designs, choosing instead to focus on small-batch production that allows us to maintain the highest quality standards. This attention to detail has established us as a premier <strong>surat clothing boutique</strong> and a trusted <strong>women apparel store surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Authentic Sourcing and Artisan Sourcing in Gujarat
            </h2>
            <p>
              What sets Manasvi Fashion apart from other stores is our dedication to local sourcing and artisan collaboration. Surat is known worldwide as a premier textile hub, and we utilize this advantage to source the finest materials. We work directly with local weavers, dyers, and printers in Gujarat to create <strong>designer ethnic wear in surat</strong> that is genuinely authentic.
            </p>
            <p>
              By choosing our boutique, you are supporting a sustainable ecosystem that values local craftsmanship. We believe in slow fashion, which means our garments are designed to last, escaping the cycle of fleeting trends. We focus on natural fibers, breathable linen, organic cotton, and soft viscose crepes that offer premium comfort. This commitment to quality and sourcing has made us a top <strong>fashion destination surat</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl text-[#3B2B28] font-normal leading-snug">
              Enjoy Seamless Online Shopping and Boutique Styling
            </h2>
            <p>
              For clients who cannot visit our boutique in person, we offer an elegant <strong>online boutique store</strong>. Our platform makes <strong>online fashion shopping surat</strong> simple and secure. You can browse our entire collection, view detailed size guides, and purchase your favorite pieces from the comfort of your home. We provide reliable shipping across India and global delivery options, ensuring that our designs reach you wherever you are.
            </p>
            <p>
              If you are in Surat, we encourage you to book a private styling consultation at our boutique studio. This personalized service allows you to work with our design team to find the perfect silhouette, select coordinating accessories, and explore custom size adjustments. We pride ourselves on providing customer-friendly service that feels warm, personal, and premium.
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
              Ready to find your perfect silhouette?
            </h3>
            <p className="max-w-md text-xs md:text-sm text-[#8B6B61] font-light leading-relaxed">
              Explore our collections online or visit our Surat studio to experience the grace of authentic, locally crafted luxury women&apos;s wear.
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
                Book Appointment
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </article>
      </div>
    </main>
  );
}
