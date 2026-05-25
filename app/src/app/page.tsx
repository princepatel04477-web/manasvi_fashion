"use client";

import { useEffect, useRef, useState } from "react";
import { animate, set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";
import { useLenis } from "@/lib/lenis";
import HeroSection from "@/components/hero-section";
import { useShop } from "@/context/shop-context";
import ProductCard from "@/components/product-card";
import useScrollReveal from "@/hooks/useScrollReveal";
import TrustBadges from "@/components/TrustBadges";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const { products } = useShop();
  const featuredRef = useRef<HTMLElement>(null);
  useScrollReveal(featuredRef, 90);

  // Filter 3 products for the featured collection
  const featuredProducts = products.slice(0, 3);

  const [cms, setCms] = useState({
    heroBanner: "/manasvi-hero.png",
    heroTitle: "MANASVI",
    heroSubtitle: "FASHION",
    sectionTunicImage:
      "/photos/9ba35110773d4f9f8f2bfcffc17bfd3cd034c4679562654196a1c52b120c67d6.png",
    sectionTunicLink: "/tunic-tops",
    sectionTunicAlt: "Freshly picked moments embroidered tunic top",
    sectionKurtiImage: "/photos/red-kurti-carousel.png",
    sectionKurtiLink: "/kurtis",
    sectionKurtiAlt: "Freshly picked moments embroidered red kurti",
  });

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setCms(data);
      })
      .catch((err) => console.error("Error loading CMS:", err));
  }, []);

  // ─── Viewport dimensions (drive brand shrink calculations) ───────────────
  // Use a static SSR-safe default so server & client initial renders match.
  // The real window dimensions are applied in useEffect after hydration.
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    // Set real dimensions on mount (after SSR hydration is safe)
    setViewport({ width: window.innerWidth, height: window.innerHeight });

    const onResize = () => {
      setViewport((c) =>
        c.width === window.innerWidth && c.height === window.innerHeight
          ? c
          : { width: window.innerWidth, height: window.innerHeight }
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ─── Refs forwarded into HeroSection ────────────────────────────────────
  const heroImageRef    = useRef<HTMLDivElement>(null);
  const vignetteRef     = useRef<HTMLDivElement>(null);
  const grainRef        = useRef<HTMLDivElement>(null);
  const brandWrapperRef = useRef<HTMLDivElement>(null);
  const brandHeaderRef  = useRef<HTMLHeadingElement>(null);
  const brandSubtitleRef = useRef<HTMLParagraphElement>(null);

  const introStateRef = useRef({ blur: 2.4, opacity: 0 });

  // ─── Derived scroll constants ────────────────────────────────────────────
  const sourceBrandSize  = Math.min(Math.max(viewport.width * 0.17, 83.2), 240);
  const finalLogoSize    = viewport.width >= 768 ? 30 : 26;
  const navCenterY       = viewport.width >= 640 ? 34 : 25;
  const brandTravelY     = -(viewport.height / 2 + 6 - navCenterY);
  const finalBrandScale  = finalLogoSize / sourceBrandSize;
  const heroScroll       = 680;
  const heroFade         = 720;
  const heroLong         = 780;

  // ─── Scroll animation runner stored in a ref so Lenis callback is stable ─
  // Re-assigned in useEffect whenever viewport-derived constants change.
  const scrollYRef = useRef(0);
  const runScrollAnim = useRef<(sy: number) => void>(() => {});

  useEffect(() => {
    runScrollAnim.current = (sy: number) => {
      // 1. Hero image scale + opacity
      if (heroImageRef.current) {
        set(heroImageRef.current, {
          scale:   interpolate(sy, { inputRange: [0, heroLong], outputRange: [1.12, 1.03], ease: luxuryEase }),
          opacity: interpolate(sy, { inputRange: [0, heroLong], outputRange: [1, 0.95],   ease: luxuryEase }),
        });
      }
      // 2. Vignette + grain
      if (vignetteRef.current)
        set(vignetteRef.current, { opacity: interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.19, 0.1], ease: luxuryEase }) });
      if (grainRef.current)
        set(grainRef.current,    { opacity: interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.24, 0.14], ease: luxuryEase }) });

      // 3. Brand wrapper shrink + travel
      const opBrand = interpolate(sy, { inputRange: [0, heroScroll, heroFade], outputRange: [1, 1, 0], ease: luxuryEase })
                      * introStateRef.current.opacity;
      if (brandWrapperRef.current) {
        set(brandWrapperRef.current, {
          scale:      interpolate(sy, { inputRange: [0, heroScroll], outputRange: [1, finalBrandScale], ease: luxuryEase }),
          translateY: `${interpolate(sy, { inputRange: [0, heroScroll], outputRange: [0, brandTravelY], ease: luxuryEase })}px`,
          opacity:    opBrand,
        });
      }
      // 4. Brand header blur + weight glow
      if (brandHeaderRef.current) {
        const blur = interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.35, 0], ease: luxuryEase })
                     + introStateRef.current.blur;
        set(brandHeaderRef.current, {
          letterSpacing: `${interpolate(sy, { inputRange: [0, heroScroll], outputRange: [0.055, 0.055], ease: luxuryEase })}em`,
          fontWeight:    Math.round(interpolate(sy, { inputRange: [0, heroScroll], outputRange: [360, 520], ease: luxuryEase })),
          filter:        `blur(${blur}px)`,
          textShadow:    `0 18px 42px rgba(44,28,21,${interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.34, 0.12], ease: luxuryEase })})`,
        });
      }
      // 5. Subtitle parallax fade
      if (brandSubtitleRef.current) {
        set(brandSubtitleRef.current, {
          opacity:    interpolate(sy, { inputRange: [0, 260, 430], outputRange: [1, 0.74, 0], ease: luxuryEase }),
          translateY: `${interpolate(sy, { inputRange: [0, 430], outputRange: [0, -26], ease: luxuryEase })}px`,
        });
      }
    };
  }, [viewport, brandTravelY, finalBrandScale, heroScroll, heroFade, heroLong]);

  // ─── Lenis scroll callback ────────────────────────────────────────────────
  // Fires every smoothed tick from Lenis — replaces the old window.scroll listener.
  // All anime.js animations are now driven by the lerp'd virtual position.
  useLenis(({ scroll }) => {
    scrollYRef.current = scroll;
    runScrollAnim.current(scroll);
  });

  // ─── anime.js intro animation (runs once on mount) ────────────────────────
  useEffect(() => {
    const introAnim = animate(introStateRef.current, {
      blur: 0,
      opacity: 1,
      duration: 1400,
      easing: "cubicBezier(0.16, 1, 0.3, 1)",
      update: () => runScrollAnim.current(scrollYRef.current),
    });

    // Initialise state at scroll=0
    runScrollAnim.current(0);

    return () => { introAnim.pause(); };
  }, []); // intentionally empty — Lenis handles all updates after mount

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#f6eee8]">
        <HeroSection
          cms={cms}
          heroImageRef={heroImageRef}
          vignetteRef={vignetteRef}
          grainRef={grainRef}
          brandWrapperRef={brandWrapperRef}
          brandHeaderRef={brandHeaderRef}
          brandSubtitleRef={brandSubtitleRef}
        />
        <TrustBadges />

        {/* Featured Collection Section */}
        {featuredProducts.length > 0 && (
          <section
            ref={featuredRef}
            className="bg-[#FAF7F2] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E7C2B8]/40"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-12 text-center flex flex-col items-center">
                <span className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold">
                  Curated Selection
                </span>
                <h2 className="section-heading font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3B2B28] mt-2">
                  Featured Collection
                </h2>
                <div className="w-16 h-[1px] bg-[#C98E87] my-3" />
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageTransition>
  );
}
