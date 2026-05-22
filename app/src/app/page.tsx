"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";

export default function Home() {
  const [cms, setCms] = useState({
    heroBanner: "/manasvi-hero.png",
    heroTitle: "MANASVI",
    heroSubtitle: "FASHION",
    sectionTunicImage: "/photos/9ba35110773d4f9f8f2bfcffc17bfd3cd034c4679562654196a1c52b120c67d6.png",
    sectionTunicLink: "/tunic-tops",
    sectionTunicAlt: "Freshly picked moments embroidered tunic top",
    sectionKurtiImage: "/photos/red-kurti-carousel.png",
    sectionKurtiLink: "/kurtis",
    sectionKurtiAlt: "Freshly picked moments embroidered red kurti"
  });

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setCms(data);
        }
      })
      .catch((err) => console.error("Error loading CMS:", err));
  }, []);

  const [viewport, setViewport] = useState(() => {
    if (typeof window === "undefined") {
      return { width: 1440, height: 900 };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  const heroImageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const brandWrapperRef = useRef<HTMLDivElement>(null);
  const brandHeaderRef = useRef<HTMLHeadingElement>(null);
  const brandSubtitleRef = useRef<HTMLParagraphElement>(null);

  const introStateRef = useRef({ blur: 2.4, opacity: 0 });

  const sourceBrandSize = Math.min(Math.max(viewport.width * 0.17, 83.2), 240);
  const finalLogoSize = viewport.width >= 768 ? 30 : 26;
  const navCenterY = viewport.width >= 640 ? 34 : 25;
  const heroBrandCenterOffset = 6;
  const brandTravelY = -(viewport.height / 2 + heroBrandCenterOffset - navCenterY);
  const finalBrandScale = finalLogoSize / sourceBrandSize;

  const heroScroll = 680;
  const heroFade = 720;
  const heroLong = 780;

  useEffect(() => {
    const updateViewport = () => {
      setViewport((current) => {
        if (current.width === window.innerWidth && current.height === window.innerHeight) {
          return current;
        }
        return { width: window.innerWidth, height: window.innerHeight };
      });
    };

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const updateScrollAnimations = () => {
      const sy = window.scrollY;

      // 1. Hero Image Scale/Opacity
      const scaleImg = interpolate(sy, { inputRange: [0, heroLong], outputRange: [1.12, 1.03], ease: luxuryEase });
      const opImg = interpolate(sy, { inputRange: [0, heroLong], outputRange: [1, 0.95], ease: luxuryEase });
      if (heroImageRef.current) {
        set(heroImageRef.current, {
          scale: scaleImg,
          opacity: opImg
        });
      }

      // 2. Vignette & Grain Opacity
      const opVignette = interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.19, 0.1], ease: luxuryEase });
      const opGrain = interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.24, 0.14], ease: luxuryEase });
      if (vignetteRef.current) {
        set(vignetteRef.current, { opacity: opVignette });
      }
      if (grainRef.current) {
        set(grainRef.current, { opacity: opGrain });
      }

      // 3. Brand Wrapper
      const scaleBrand = interpolate(sy, { inputRange: [0, heroScroll], outputRange: [1, finalBrandScale], ease: luxuryEase });
      const yBrand = interpolate(sy, { inputRange: [0, heroScroll], outputRange: [0, brandTravelY], ease: luxuryEase });
      const opBrandBase = interpolate(sy, { inputRange: [0, heroScroll, heroFade], outputRange: [1, 1, 0], ease: luxuryEase });
      const opBrandCombined = opBrandBase * introStateRef.current.opacity;
      if (brandWrapperRef.current) {
        set(brandWrapperRef.current, {
          scale: scaleBrand,
          translateY: `${yBrand}px`,
          opacity: opBrandCombined
        });
      }

      // 4. Brand Header
      const trBrand = interpolate(sy, { inputRange: [0, heroScroll], outputRange: [0.055, 0.055], ease: luxuryEase });
      const wtBrand = interpolate(sy, { inputRange: [0, heroScroll], outputRange: [360, 520], ease: luxuryEase });
      const blurBrand = interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.35, 0], ease: luxuryEase });
      const combinedBlurVal = blurBrand + introStateRef.current.blur;
      const glowBrand = interpolate(sy, { inputRange: [0, heroLong], outputRange: [0.34, 0.12], ease: luxuryEase });

      if (brandHeaderRef.current) {
        set(brandHeaderRef.current, {
          letterSpacing: `${trBrand}em`,
          fontWeight: Math.round(wtBrand),
          filter: `blur(${combinedBlurVal}px)`,
          textShadow: `0 18px 42px rgba(44, 28, 21, ${glowBrand})`
        });
      }

      // 5. Brand Subtitle
      const opSub = interpolate(sy, { inputRange: [0, 260, 430], outputRange: [1, 0.74, 0], ease: luxuryEase });
      const ySub = interpolate(sy, { inputRange: [0, 430], outputRange: [0, -26], ease: luxuryEase });
      if (brandSubtitleRef.current) {
        set(brandSubtitleRef.current, {
          opacity: opSub,
          translateY: `${ySub}px`
        });
      }

    };

    const handleScroll = () => {
      updateScrollAnimations();
    };

    const introAnim = animate(introStateRef.current, {
      blur: 0,
      opacity: 1,
      duration: 1400,
      easing: "cubicBezier(0.16, 1, 0.3, 1)",
      update: () => {
        updateScrollAnimations();
      }
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollAnimations();

    return () => {
      introAnim.pause();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [viewport, brandTravelY, finalBrandScale]);

  return (
    <main className="min-h-screen bg-[#f6eee8]">
      <section className="relative h-screen w-full">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[#b89e86]" />
          <div ref={heroImageRef} className="absolute inset-0 [will-change:transform,opacity]">
            <img
              src={cms.heroBanner}
              alt="Manasvi luxury campaign"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div
            ref={vignetteRef}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_56%,transparent_38%,rgba(37,24,18,0.16)_100%)]"
          />
          <div
            ref={grainRef}
            style={{
              backgroundImage: "radial-gradient(rgba(255,248,244,0.18) 0.8px, transparent 0.8px)",
              backgroundSize: "3px 3px",
            }}
            className="absolute inset-0"
          />

          <div
            ref={brandWrapperRef}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pt-20 sm:pt-24 text-center [transform-origin:50%_50%] [will-change:transform,opacity]"
          >
            <div>
              <h1
                ref={brandHeaderRef}
                style={{
                  transformOrigin: "50% 42%",
                }}
                className="cormorant-garamond-manasvi text-[clamp(3.6rem,16vw,12rem)] sm:text-[clamp(4.6rem,16vw,14rem)] leading-none text-[#fffaf5] transition-[filter] duration-300 [font-kerning:normal] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
              >
                {cms.heroTitle}
              </h1>
              <p
                ref={brandSubtitleRef}
                className="-mt-2 sm:-mt-4 im-fell-great-primer-regular text-[clamp(0.95rem,2.6vw,1.6rem)] sm:text-[clamp(1.05rem,2.4vw,1.8rem)] font-normal uppercase tracking-[0.28em] sm:tracking-[0.36em] text-white/90"
              >
                {cms.heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f6eee8] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <Link
            href={cms.sectionTunicLink}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[#f9f2ec] shadow-[0_24px_55px_rgba(76,54,42,0.18)] transition-transform duration-500 hover:-translate-y-1"
            aria-label="Shop Tunic Tops"
          >
            <div className="relative h-[320px] sm:h-[420px] md:h-[520px]">
              <img
                src={cms.sectionTunicImage}
                alt={cms.sectionTunicAlt}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f140f]/65 via-[#1f140f]/10 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="im-fell-great-primer-regular text-sm uppercase tracking-[0.3em] text-white/75">Collection</p>
              <h2 className="cormorant-garamond-manasvi text-3xl sm:text-4xl">Tunic Tops</h2>
            </div>
          </Link>

          <Link
            href={cms.sectionKurtiLink}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[#f9f2ec] shadow-[0_24px_55px_rgba(76,54,42,0.18)] transition-transform duration-500 hover:-translate-y-1"
            aria-label="Shop Kurtis Collection"
          >
            <div className="relative h-[320px] sm:h-[420px] md:h-[520px]">
              <img
                src={cms.sectionKurtiImage}
                alt={cms.sectionKurtiAlt}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f140f]/65 via-[#1f140f]/10 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="im-fell-great-primer-regular text-sm uppercase tracking-[0.3em] text-white/75">Collection</p>
              <h2 className="cormorant-garamond-manasvi text-3xl sm:text-4xl">Kurtis</h2>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
