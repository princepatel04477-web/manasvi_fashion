"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, set } from "animejs";
import { useScrollY, interpolate, luxuryEase } from "@/lib/use-anime-scroll";
import { Heart, Sparkles, Feather, Compass, ArrowRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function AboutPage() {
  const scrollY = useScrollY();
  const [windowHeight, setWindowHeight] = useState(800);
  
  // Element Refs for scroll-driven animations
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLImageElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const philosophyQuoteRef = useRef<HTMLDivElement>(null);
  const detailsGridRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    // Set real height immediately on mount
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up scroll animations using the native interpolate/luxuryEase system
  useEffect(() => {
    // 1. Hero Zoom & Fade
    if (heroImageRef.current) {
      const zoom = interpolate(scrollY, {
        inputRange: [0, 800],
        outputRange: [1, 1.12],
        ease: luxuryEase,
      });
      const opacity = interpolate(scrollY, {
        inputRange: [0, 500],
        outputRange: [0.35, 0.15],
        ease: luxuryEase,
      });
      set(heroImageRef.current, {
        scale: zoom,
        opacity: opacity,
      });
    }

    if (heroTextRef.current) {
      const textY = interpolate(scrollY, {
        inputRange: [0, 600],
        outputRange: [0, -60],
        ease: luxuryEase,
      });
      const textOpacity = interpolate(scrollY, {
        inputRange: [0, 500],
        outputRange: [1, 0],
        ease: luxuryEase,
      });
      set(heroTextRef.current, {
        translateY: `${textY}px`,
        opacity: textOpacity,
      });
    }

    // 2. Story Section Parallax
    if (storyImageRef.current) {
      const imgRect = storyImageRef.current.getBoundingClientRect();
      const viewPortTop = imgRect.top - windowHeight;
      const progress = -viewPortTop / (windowHeight + imgRect.height);
      const clampProgress = Math.max(0, Math.min(1, progress));
      
      const imgY = interpolate(clampProgress, {
        inputRange: [0, 1],
        outputRange: [-40, 40],
      });
      set(storyImageRef.current, {
        translateY: `${imgY}px`,
      });
    }

    // 3. Philosophy Section Fade Reveal
    if (philosophyQuoteRef.current) {
      const rect = philosophyQuoteRef.current.getBoundingClientRect();
      const triggerPoint = windowHeight * 0.85;
      const progress = (triggerPoint - rect.top) / 300;
      const opacity = Math.max(0, Math.min(1, progress));
      const textY = interpolate(opacity, {
        inputRange: [0, 1],
        outputRange: [30, 0],
      });
      set(philosophyQuoteRef.current, {
        opacity: opacity,
        translateY: `${textY}px`,
      });
    }

    // 4. Details Section Cards staggered entry
    if (detailsGridRef.current) {
      const cards = detailsGridRef.current.children;
      const triggerPoint = windowHeight * 0.9;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          animate(card, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: i * 150,
            easing: "cubicBezier(0.16, 1, 0.3, 1)",
          });
        }
      }
    }
  }, [scrollY, windowHeight]);

  // Initial load animation for hero elements
  useEffect(() => {
    animate(".fade-in-element", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1400,
      delay: (_el: unknown, i: number) => i * 200,
      easing: "cubicBezier(0.16, 1, 0.3, 1)",
    });
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] overflow-x-hidden selection:bg-[#FAF7F2]/30 selection:text-[#FAF7F2] soft-grain">
      
      {/* HERO SECTION — Cinematic Full-Screen Bleed */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <div 
          ref={heroImageRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-[will-change] duration-100"
          style={{
            backgroundImage: "url('/photos/Gemini_Generated_Image_7p370v7p370v7p37.png')",
            opacity: 0.35,
          }}
        />
        {/* Soft Radial Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/60 via-transparent to-[#FAF7F2]/30 z-10" />

        {/* Hero Text */}
        <div 
          ref={heroTextRef}
          className="relative z-20 max-w-4xl text-center px-6 md:px-12 flex flex-col items-center gap-6"
        >
          <span className="fade-in-element font-cormorant text-xs uppercase tracking-[0.3em] font-semibold text-[#8B6B61] opacity-0">
            Est. 2021 &mdash; Silhouette of Grace
          </span>
          <h1 className="fade-in-element font-cormorant text-4xl sm:text-5xl md:text-7xl font-light italic leading-tight text-[#3B2B28] tracking-wide opacity-0 max-w-3xl">
            Designed with Grace, <br />
            <span className="font-normal not-italic tracking-normal">Worn with Confidence</span>
          </h1>
          <div className="fade-in-element w-16 h-[1px] bg-[#8B6B61]/40 my-2 opacity-0" />
          <p className="fade-in-element font-inter text-sm sm:text-base md:text-lg text-[#8B6B61] font-light leading-relaxed max-w-2xl opacity-0">
            Manasvi Fashion creates timeless kurtis, dresses, and tunic tops for women who embrace elegance, ease, and comfort in everyday life.
          </p>
          <div className="fade-in-element mt-6 opacity-0">
            <Link 
              href="/collections" 
              className="group flex items-center gap-3 font-cormorant text-sm uppercase tracking-[0.2em] font-semibold text-[#3B2B28] hover:text-[#8B6B61] transition-colors duration-300"
            >
              Explore Collections 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY SECTION — Asymmetrical Luxury Composition */}
      <section className="relative px-6 py-24 md:py-36 max-w-7xl mx-auto z-20">
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          
          {/* LEFT: Cinematic image with asymmetrical sizing */}
          <div className="lg:col-span-5 relative w-full overflow-hidden rounded-2xl bg-[#E7C2B8] aspect-[3/4] max-w-md lg:max-w-full mx-auto shadow-xl group">
            <img 
              ref={storyImageRef}
              src="/photos/Gemini_Generated_Image_h8k8lch8k8lch8k8.png"
              alt="Manasvi couture draping and natural elegance"
              className="absolute inset-0 w-full h-[120%] object-cover object-center scale-[1.05] transition-transform duration-500 ease-out group-hover:scale-[1.08]"
              style={{ top: "-10%" }}
            />
            {/* Ambient vignette and light filter */}
            <div className="absolute inset-0 bg-[#3B2B28]/10 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-0" />
          </div>

          {/* RIGHT: Typography editorial block */}
          <div 
            ref={storyTextRef}
            className="lg:col-span-7 flex flex-col gap-6 lg:pl-12"
          >
            <span className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#C98E87]">
              The Narrative
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
              An Ode to Modern Femininity & <br />
              <span className="italic">Thoughtful Craftsmanship</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#C98E87] my-1" />
            
            <p className="font-inter text-[#8B6B61] text-sm md:text-base leading-relaxed font-light">
              MANASVI FASHION was founded on a simple belief: clothing should feel like poetry in motion. For us, silhouettes are not merely styles—they are expressions of everyday confidence. We weave heritage Indian silhouettes like Kurtis and Tunics with modern western proportions, resulting in versatile, elegant designer dresses that are both authentic and effortless.
            </p>
            
            <p className="font-inter text-[#8B6B61] text-sm md:text-base leading-relaxed font-light">
              Every detail is considered with quiet reverence. We select premium linen, organic silk-cotton blends, and breathable viscose crepes, marrying them with hand-detailed stitching and exquisite cuts. By prioritizing both comfort and visual richness, we craft garments that feel personal, calm, and gracefully premium—designed to stand the test of time, escaping fleeting fashion trends.
            </p>
            
            <div className="flex gap-12 mt-4 text-center sm:text-left">
              <div>
                <h4 className="font-cormorant text-2xl font-medium text-[#3B2B28]">100%</h4>
                <p className="font-inter text-xs text-[#8B6B61] tracking-widest uppercase mt-1">Natural Fiber</p>
              </div>
              <div className="w-[1px] bg-[#8B6B61]/20" />
              <div>
                <h4 className="font-cormorant text-2xl font-medium text-[#3B2B28]">20+</h4>
                <p className="font-inter text-xs text-[#8B6B61] tracking-widest uppercase mt-1">Artisan Partners</p>
              </div>
              <div className="w-[1px] bg-[#8B6B61]/20" />
              <div>
                <h4 className="font-cormorant text-2xl font-medium text-[#3B2B28]">50k+</h4>
                <p className="font-inter text-xs text-[#8B6B61] tracking-widest uppercase mt-1">Happy Souls</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OUR PHILOSOPHY SECTION — Oversized Minimal Editorial */}
      <section className="relative bg-[#E7C2B8]/15 py-28 md:py-40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div 
            ref={philosophyQuoteRef} 
            className="flex flex-col items-center gap-6 opacity-0"
          >
            <span className="font-cormorant text-xs uppercase tracking-[0.25em] font-semibold text-[#8B6B61]">
              Our Philosophy
            </span>
            <div className="w-8 h-[1px] bg-[#8B6B61]/40" />
            <blockquote className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic leading-snug text-[#3B2B28] px-4 md:px-12 max-w-4xl">
              &ldquo;Fashion should feel effortless, timeless, and deeply personal.&rdquo;
            </blockquote>
            <p className="font-inter text-sm md:text-base text-[#8B6B61] font-light max-w-2xl leading-relaxed mt-4">
              We champion quiet luxury—a state of wearable elegance where confidence is achieved through perfect fits and clean, minimal silhouettes. Our garments flow from morning rituals to evening celebrations, celebrating authentic feminine grace without complexity.
            </p>
          </div>
        </div>
      </section>

      {/* THE DETAILS SECTION — Soft Luxury Grid */}
      <section className="relative px-6 py-24 md:py-36 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 flex flex-col items-center gap-4">
          <span className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#C98E87]">
            The Pillars
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light">
            Every Thread, An Intentional Choice
          </h2>
          <div className="w-12 h-[1px] bg-[#C98E87]" />
        </div>

        <div 
          ref={detailsGridRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Detail card 1 */}
          <div className="flex flex-col gap-5 p-8 rounded-2xl bg-white border border-[#E7C2B8]/30 shadow-[0_10px_30px_-15px_rgba(59,43,40,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(59,43,40,0.1)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C98E87] group-hover:bg-[#C98E87] group-hover:text-white transition-colors duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-cormorant text-xl font-medium tracking-wide">Premium Fabrics</h3>
            <p className="font-inter text-xs md:text-sm text-[#8B6B61] leading-relaxed font-light">
              We source the finest materials—breathable linens, flowing viscose crepes, and pure silk blends—to ensure each piece falls beautifully and feels sublime against the skin.
            </p>
          </div>

          {/* Detail card 2 */}
          <div className="flex flex-col gap-5 p-8 rounded-2xl bg-white border border-[#E7C2B8]/30 shadow-[0_10px_30px_-15px_rgba(59,43,40,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(59,43,40,0.1)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C98E87] group-hover:bg-[#C98E87] group-hover:text-white transition-colors duration-300">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-cormorant text-xl font-medium tracking-wide">Elegant Fits</h3>
            <p className="font-inter text-xs md:text-sm text-[#8B6B61] leading-relaxed font-light">
              Each pattern is developed with meticulous attention to detail. Our garments flatter the natural feminine silhouette while providing absolute freedom of movement.
            </p>
          </div>

          {/* Detail card 3 */}
          <div className="flex flex-col gap-5 p-8 rounded-2xl bg-white border border-[#E7C2B8]/30 shadow-[0_10px_30px_-15px_rgba(59,43,40,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(59,43,40,0.1)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C98E87] group-hover:bg-[#C98E87] group-hover:text-white transition-colors duration-300">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-cormorant text-xl font-medium tracking-wide">Timeless Design</h3>
            <p className="font-inter text-xs md:text-sm text-[#8B6B61] leading-relaxed font-light">
              We focus on clean, classic shapes that defy seasonal obsolescence. Our dresses and Kurtis are curated to remain sophisticated mainstays of your wardrobe for years.
            </p>
          </div>

          {/* Detail card 4 */}
          <div className="flex flex-col gap-5 p-8 rounded-2xl bg-white border border-[#E7C2B8]/30 shadow-[0_10px_30px_-15px_rgba(59,43,40,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(59,43,40,0.1)] hover:-translate-y-1 group">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C98E87] group-hover:bg-[#C98E87] group-hover:text-white transition-colors duration-300">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-cormorant text-xl font-medium tracking-wide">Everyday Comfort</h3>
            <p className="font-inter text-xs md:text-sm text-[#8B6B61] leading-relaxed font-light">
              We design for the real world. Breathable weaves, thoughtful pockets, and relaxed structural drapes guarantee that you feel as comfortable as you look elegant.
            </p>
          </div>
        </div>
      </section>

      {/* CINEMATIC IMAGE STRIP — Horizontal Gallery */}
      <section className="relative py-12 md:py-24 bg-[#FAF7F2] overflow-hidden">
        <div className="px-6 max-w-7xl mx-auto mb-10 flex flex-col items-start gap-2">
          <span className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#8B6B61]">
            Visual Journal
          </span>
          <h2 className="font-cormorant text-2xl md:text-3xl font-light italic text-[#3B2B28]">
            Close details, textures, and moments of movement.
          </h2>
        </div>

        {/* Scrollable strip container */}
        <div 
          ref={galleryContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 px-6 md:px-12 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: "smooth" }}
        >
          {[
            { src: "/photos/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png", alt: "Close fabric weave and detailing" },
            { src: "/photos/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png", alt: "Stitching shots and fine seams" },
            { src: "/photos/298a7d7ca464b6cebeb9831bbc04b2b30be7f8d60df05f982bda5a28edd8cf9c.png", alt: "Flowing movement of designer dresses" },
            { src: "/photos/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png", alt: "Warm natural lighting and silhouette" },
            { src: "/photos/6f3b4324572536e1c644bea8fb930139f703830c3430d24d5b047a122dbb7417.png", alt: "Boutique collection and curation" }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-[32vw] aspect-[4/5] rounded-xl overflow-hidden shadow-lg snap-center group relative bg-[#E7C2B8]"
            >
              <img 
                src={item.src} 
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="font-cormorant text-lg text-white font-light tracking-wide italic">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER TRANSITION CALL TO ACTION */}
      <section className="relative border-t border-[#E7C2B8]/40 py-24 text-center">
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
          <h3 className="font-cormorant text-2xl sm:text-3xl font-light italic">
            Wish to find your perfect silhouette?
          </h3>
          <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed font-light max-w-md">
            Schedule a private styling consultation at our boutique studio or explore our curated selection of Kurtis, Dresses, and Tunic Tops.
          </p>
          <div className="flex gap-4 mt-2">
            <Link 
              href="/collections" 
              className="px-6 py-3 rounded-lg border border-[#3B2B28]/20 font-cormorant text-xs uppercase tracking-widest font-semibold hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors duration-300"
            >
              Shop Silhouettes
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 rounded-lg bg-[#3B2B28] text-[#FAF7F2] font-cormorant text-xs uppercase tracking-widest font-semibold hover:bg-[#8B6B61] transition-colors duration-300 shadow-md"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

    </main>
    </PageTransition>
  );
}
