"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all GSAP plugins once at module level
gsap.registerPlugin(SplitText, ScrollTrigger);

// SSR-safe hook: always useEffect on the server, useLayoutEffect on the client.
// MUST be defined inside a module-scoped constant — NOT conditionally per render.
// Using `typeof window` at module level is safe because modules are evaluated once.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface HeroSectionProps {
  cms: {
    heroBanner: string;
    heroTitle: string;
    heroSubtitle: string;
    sectionTunicImage: string;
    sectionTunicLink: string;
    sectionTunicAlt: string;
    sectionKurtiImage: string;
    sectionKurtiLink: string;
    sectionKurtiAlt: string;
  };
  // Forwarded refs so the parent (page.tsx) can drive anime.js scroll animations
  heroImageRef: React.RefObject<HTMLDivElement | null>;
  vignetteRef: React.RefObject<HTMLDivElement | null>;
  grainRef: React.RefObject<HTMLDivElement | null>;
  brandWrapperRef: React.RefObject<HTMLDivElement | null>;
  brandHeaderRef: React.RefObject<HTMLHeadingElement | null>;
  brandSubtitleRef: React.RefObject<HTMLParagraphElement | null>;
}

export default function HeroSection({
  cms,
  heroImageRef,
  vignetteRef,
  grainRef,
  brandWrapperRef,
  brandHeaderRef,
  brandSubtitleRef,
}: HeroSectionProps) {
  // ── Refs owned by this component ─────────────────────────────────────────
  const ctaCard1Ref = useRef<HTMLAnchorElement>(null);
  const ctaCard2Ref = useRef<HTMLAnchorElement>(null);
  // The parallax wrapper sits INSIDE heroImageRef (which anime.js owns for scale/opacity)
  // GSAP translates this inner wrapper vertically — the two don't fight.
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // ── Entrance animation (GSAP timeline) ───────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const h1 = brandHeaderRef.current;
      const subtitle = brandSubtitleRef.current;
      const imgWrapper = heroImageRef.current;
      const card1 = ctaCard1Ref.current;
      const card2 = ctaCard2Ref.current;

      if (!h1 || !subtitle || !imgWrapper || !card1 || !card2) return;

      // 1. Split the h1 title into individual characters
      const split = new SplitText(h1, { type: "chars", charsClass: "gsap-char" });
      splitRef.current = split;
      const chars = split.chars;

      // 2. Set every element to its start state BEFORE building the timeline
      gsap.set(chars,           { y: 100, rotateX: -90, opacity: 0 });
      gsap.set(subtitle,        { y: 28, opacity: 0 });
      gsap.set([card1, card2],  { y: 30, opacity: 0 });

      // 3. Build the master entrance timeline
      const tl = gsap.timeline({ paused: true });
      tlRef.current = tl;

      // Track 1 — Hero image wrapper: scale-in (2s, starts at 0)
      tl.from(imgWrapper, { scale: 1.12, duration: 2, ease: "power3.out" }, 0);

      // Track 2 — Title characters: staggered 3-D flip-up (0.2s offset)
      tl.to(
        chars,
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.05, duration: 1.2, ease: "power4.out" },
        0.2
      );

      // Track 3 — Subtitle: slides up 0.3s after title starts (= 0.5s from start)
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.5);

      // Track 4 — CTA collection cards: staggered fade + lift
      tl.to(
        [card1, card2],
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.15, ease: "power3.out" },
        0.9
      );

      // Play after one frame so layout is fully painted
      requestAnimationFrame(() => tl.play());
    });

    return () => {
      ctx.revert();
      tlRef.current?.kill();
      splitRef.current?.revert();
    };
  }, [cms.heroTitle]); // Re-run if CMS title changes

  // ── ScrollTrigger parallax on the inner image wrapper ────────────────────
  // Structure:
  //   .hero-section (section trigger)
  //   └── .sticky.overflow-hidden  ← overflow:hidden clips the parallax bleed
  //       └── heroImageRef div     ← anime.js owns: scale + opacity
  //           └── parallaxWrapperRef  ← GSAP owns: yPercent (parallax translate)
  //               └── img
  //
  // Separating the two layers means anime.js and GSAP never write the same
  // CSS property on the same element.
  useIsomorphicLayoutEffect(() => {
    const section = heroSectionRef.current;
    const parallax = parallaxWrapperRef.current;
    if (!section || !parallax) return;

    // Oversizing the image wrapper lets it translate down without showing a gap.
    // 25% yPercent travel on a 125% tall element keeps it filled at all scroll positions.
    gsap.set(parallax, { height: "125%", top: "-12.5%", position: "absolute", width: "100%" });

    const st = gsap.to(parallax, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        // "top top" = when section top hits viewport top
        start: "top top",
        // "bottom top" = when section bottom hits viewport top (section scrolled past)
        end: "bottom top",
        scrub: true,         // ties animation progress directly to scroll position
        invalidateOnRefresh: true, // recalculate positions after ScrollTrigger.refresh()
      },
    });

    // Store ScrollTrigger instance for cleanup
    stRef.current = (st.scrollTrigger as ScrollTrigger) ?? null;

    return () => {
      st.kill();
      stRef.current?.kill();
    };
  }, []); // parallax setup never needs to re-run

  return (
    <>
      {/* ─── HERO FULLSCREEN SECTION (Main Banner) ────────────────────── */}
      <section
        ref={heroSectionRef}
        className="hero-section relative h-screen w-full"
      >
        {/*
          overflow-hidden on this div is what clips the parallax bleed.
          The parallaxWrapperRef child extends beyond 100% height so it can
          translate without exposing a gap at the edges.
        */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Background colour fallback while image loads */}
          <div className="absolute inset-0 bg-[#b89e86]" />

          {/*
            heroImageRef — owned by anime.js in page.tsx (scale + opacity).
            It wraps the parallax div to keep transforms on separate layers.
          */}
          <div
            ref={heroImageRef}
            className="hero-image-wrapper absolute inset-0 [will-change:transform,opacity]"
          >
            {/*
              parallaxWrapperRef — owned by GSAP ScrollTrigger (yPercent).
              Oversized (125% tall) so vertical translation doesn't bleed outside
              the overflow:hidden boundary of the parent sticky div.
            */}
            <div
              ref={parallaxWrapperRef}
              className="absolute inset-0 w-full [will-change:transform]"
              aria-hidden="true"
            >
              <img
                src={cms.heroBanner}
                alt="Manasvi luxury campaign"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Vignette overlay */}
          <div
            ref={vignetteRef}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_56%,transparent_38%,rgba(37,24,18,0.16)_100%)]"
          />

          {/* Film-grain texture */}
          <div
            ref={grainRef}
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,248,244,0.18) 0.8px, transparent 0.8px)",
              backgroundSize: "3px 3px",
            }}
            className="absolute inset-0"
          />

          {/* Brand typography centred on hero */}
          <div
            ref={brandWrapperRef}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pt-20 sm:pt-24 text-center [transform-origin:50%_50%] [will-change:transform,opacity]"
          >
            <div>
              {/* TITLE — chars are split by GSAP SplitText */}
              <h1
                ref={brandHeaderRef}
                style={{ transformOrigin: "50% 42%", perspective: "600px" }}
                className="cormorant-garamond-manasvi text-[clamp(3.6rem,16vw,12rem)] sm:text-[clamp(4.6rem,16vw,14rem)] leading-none text-[#fffaf5] [font-kerning:normal] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
              >
                {cms.heroTitle}
              </h1>

              {/* SUBTITLE — slides up after title */}
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

      {/* ─── KURTI FULLSCREEN SECTION ───────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden bg-[#b89e86] z-10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={cms.sectionKurtiImage}
            alt={cms.sectionKurtiAlt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f140f]/75 via-[#1f140f]/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="im-fell-great-primer-regular text-sm uppercase tracking-[0.3em] text-[#E7C2B8] mb-3">
            Collection
          </p>
          <h2 className="cormorant-garamond-manasvi text-5xl sm:text-6xl md:text-7xl mb-8 tracking-wide font-normal [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
            Kurtis
          </h2>
          <Link
            ref={ctaCard1Ref}
            href={cms.sectionKurtiLink}
            className="px-8 py-3.5 bg-[#FAF7F2] text-[#160E0C] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm hover:bg-[#E7C2B8] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
          >
            Explore Kurtis
          </Link>
        </div>
      </section>

      {/* ─── TUNIC FULLSCREEN SECTION ───────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden bg-[#b89e86] z-10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={cms.sectionTunicImage}
            alt={cms.sectionTunicAlt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f140f]/75 via-[#1f140f]/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="im-fell-great-primer-regular text-sm uppercase tracking-[0.3em] text-[#E7C2B8] mb-3">
            Collection
          </p>
          <h2 className="cormorant-garamond-manasvi text-5xl sm:text-6xl md:text-7xl mb-8 tracking-wide font-normal [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
            Tunic Tops
          </h2>
          <Link
            ref={ctaCard2Ref}
            href={cms.sectionTunicLink}
            className="px-8 py-3.5 bg-[#FAF7F2] text-[#160E0C] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm hover:bg-[#E7C2B8] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer"
          >
            Explore Tunic Tops
          </Link>
        </div>
      </section>
    </>
  );
}
