"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";

export default function Home() {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === "undefined") {
      return { width: 1440, height: 900 };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  const tunicRef = useRef<HTMLElement | null>(null);
  const kurtiRef = useRef<HTMLElement | null>(null);

  const heroImageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const brandWrapperRef = useRef<HTMLDivElement>(null);
  const brandHeaderRef = useRef<HTMLHeadingElement>(null);
  const brandSubtitleRef = useRef<HTMLParagraphElement>(null);
  const tunicSectionRef = useRef<HTMLDivElement>(null);
  const kurtiSectionRef = useRef<HTMLDivElement>(null);

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

  function getElementScrollProgress(element: HTMLElement | null) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalTravel = viewportHeight + rect.height;
    const currentTravel = viewportHeight - rect.top;
    const progress = currentTravel / totalTravel;
    return Math.max(0, Math.min(1, progress));
  }

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

      // 6. Tunic Section
      const tunicProg = getElementScrollProgress(tunicRef.current);
      const xTunic = interpolate(tunicProg, { inputRange: [0, 0.45], outputRange: [120, 0], ease: luxuryEase });
      const opTunic = interpolate(tunicProg, { inputRange: [0, 0.18, 0.45], outputRange: [0, 0.6, 1], ease: luxuryEase });
      if (tunicSectionRef.current) {
        set(tunicSectionRef.current, {
          translateX: `${xTunic}px`,
          opacity: opTunic
        });
      }

      // 7. Kurti Section
      const kurtiProg = getElementScrollProgress(kurtiRef.current);
      const xKurti = interpolate(kurtiProg, { inputRange: [0, 0.45], outputRange: [-120, 0], ease: luxuryEase });
      const opKurti = interpolate(kurtiProg, { inputRange: [0, 0.18, 0.45], outputRange: [0, 0.6, 1], ease: luxuryEase });
      if (kurtiSectionRef.current) {
        set(kurtiSectionRef.current, {
          translateX: `${xKurti}px`,
          opacity: opKurti
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
    <main className="bg-[#f6eee8]">
      <section className="relative h-[320vh] w-full">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[#b89e86]" />
          <div ref={heroImageRef} className="absolute inset-0 [will-change:transform,opacity]">
            <img
              src="/manasvi-hero.png"
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
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pt-24 text-center [transform-origin:50%_50%] [will-change:transform,opacity]"
          >
            <div>
              <h1
                ref={brandHeaderRef}
                style={{
                  transformOrigin: "50% 42%",
                }}
                className="cormorant-garamond-manasvi text-[clamp(5.2rem,17vw,15rem)] leading-none text-[#fffaf5] transition-[filter] duration-300 [font-kerning:normal] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
              >
                MANASVI
              </h1>
              <p
                ref={brandSubtitleRef}
                className="-mt-3 im-fell-great-primer-regular text-[clamp(1.1rem,2.4vw,1.8rem)] font-normal uppercase tracking-[0.36em] text-white/90 sm:-mt-4"
              >
                FASHION
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={tunicRef} className="bg-[#f6eee8] py-0">
        <div className="w-full overflow-hidden">
          <div ref={tunicSectionRef} className="[will-change:transform,opacity]">
            <Link href="/tunic-tops" className="group block">
              <img
                src="/photos/9ba35110773d4f9f8f2bfcffc17bfd3cd034c4679562654196a1c52b120c67d6.png"
                alt="Freshly picked moments embroidered tunic top"
                className="block h-[76vw] max-h-[620px] w-full object-cover object-[54%_center] transition-transform duration-700 ease-out group-hover:scale-[1.06] sm:h-[70vw] md:hidden"
              />
              <img
                src="/photos/9ba35110773d4f9f8f2bfcffc17bfd3cd034c4679562654196a1c52b120c67d6.png"
                alt="Freshly picked moments embroidered tunic top"
                className="hidden w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] md:block"
              />
            </Link>
          </div>
        </div>
      </section>

      <section ref={kurtiRef} className="bg-[#f6eee8] py-0">
        <div className="w-full overflow-hidden">
          <div ref={kurtiSectionRef} className="[will-change:transform,opacity]">
            <Link href="/kurtis" className="group block">
              <img
                src="/photos/red-kurti-carousel.png"
                alt="Freshly picked moments embroidered red kurti"
                className="block h-[76vw] max-h-[620px] w-full object-cover object-[52%_center] transition-transform duration-700 ease-out group-hover:scale-[1.06] sm:h-[70vw] md:hidden"
              />
              <img
                src="/photos/red-kurti-carousel.png"
                alt="Freshly picked moments embroidered red kurti"
                className="hidden w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] md:block"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
