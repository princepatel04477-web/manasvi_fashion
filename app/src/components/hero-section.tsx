"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const slides = [
    {
      image: "/photos/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png",
      eyebrow: "New Collection · SS 2026",
      row1: "Everyday",
      row2: "Comfort",
      row3: "Every Day Style",
      sub: "Where contemporary western fashion meets timeless Indian elegance.",
      ctaText: "Shop Collection",
      ctaLink: "/collections",
    },
    {
      image: "/photos/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png",
      eyebrow: "Summer Spotlight",
      row1: "Summer 2026",
      row2: "New Kurtis",
      row3: "Effortless & Light",
      sub: "Lightweight, breathable styles made for your everyday comfort.",
      ctaText: "Explore Now",
      ctaLink: "/kurtis",
    },
    {
      image: "/photos/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png",
      eyebrow: "Exclusive Offer",
      row1: "New Season",
      row2: "Surat Collection",
      row3: "Artisan Silhouettes",
      sub: "Discover radiant designs crafted from the finest cotton fabrics.",
      ctaText: "Shop Sale",
      ctaLink: "/collections",
    },
    {
      image: "/photos/33e487078704a681b64d3ed522344381e872d85ad370d1f7ac2c462f0ecf6fe6.png",
      eyebrow: "Summer Essentials",
      row1: "Knee-Length",
      row2: "Fresh Tunics",
      row3: "& Dresses",
      sub: "Beautiful hand-embroidered silhouettes for an effortless summer look.",
      ctaText: "Shop Dresses",
      ctaLink: "/dresses",
    },
    {
      image: "/photos/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png",
      eyebrow: "Arriving Daily",
      row1: "Ready to Wear",
      row2: "Shop Latest",
      row3: "Collection",
      sub: "Elegant block-printed styles designed with authentic Surat patterns.",
      ctaText: "New Arrivals",
      ctaLink: "/new-arrivals",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [timerKey, slides.length]);

  const handleDotClick = (idx: number) => {
    setActiveSlide(idx);
    setTimerKey((prev) => prev + 1);
  };

  const handleReplay = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest(".mh-nav__menu") ||
      target.closest(".mh-link") ||
      target.closest(".mh-indicator-dot")
    ) {
      return;
    }
    setTimerKey((prev) => prev + 1);
  };

  // ScrollTrigger parallax on active slide background
  useIsomorphicLayoutEffect(() => {
    const section = heroSectionRef.current;
    const parallax = parallaxWrapperRef.current;
    if (!section || !parallax) return;

    gsap.set(parallax, { height: "125%", top: "-12.5%", position: "absolute", width: "100%" });

    const st = gsap.to(parallax, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    stRef.current = (st.scrollTrigger as ScrollTrigger) ?? null;

    return () => {
      st.kill();
      stRef.current?.kill();
    };
  }, []);

  const ptData: [number, number, number, number, number, number, boolean][] = [
    [12, 18, 2.5, 4.2, 0.0, 0.55, false],
    [28, 30, 1.8, 5.6, 0.8, 0.40, false],
    [45, 22, 3.2, 4.8, 1.6, 0.65, true],
    [62, 35, 1.5, 6.1, 0.4, 0.35, false],
    [18, 42, 4.0, 5.2, 2.4, 0.50, true],
    [72, 25, 2.0, 4.5, 1.2, 0.45, false],
    [38, 55, 1.2, 7.0, 3.0, 0.30, false],
    [55, 18, 3.5, 4.0, 0.6, 0.60, true],
    [8, 60, 2.8, 5.8, 2.0, 0.40, false],
    [82, 40, 1.6, 6.4, 1.8, 0.35, false],
    [33, 70, 2.2, 5.0, 4.0, 0.45, true],
    [68, 52, 1.4, 7.2, 2.8, 0.30, false],
    [24, 15, 3.0, 4.6, 3.6, 0.55, false],
    [50, 44, 2.6, 5.4, 0.2, 0.48, true],
    [78, 30, 1.9, 6.8, 4.8, 0.38, false],
    [15, 80, 1.3, 7.5, 1.4, 0.28, false],
    [42, 62, 2.4, 5.6, 5.2, 0.42, true],
    [60, 72, 1.7, 6.2, 3.4, 0.33, false],
    [30, 85, 2.9, 4.4, 6.0, 0.50, false],
    [88, 20, 1.1, 7.8, 0.8, 0.25, false],
    [5, 36, 3.3, 5.0, 4.4, 0.55, true],
    [75, 65, 2.1, 6.6, 2.2, 0.38, false],
    [48, 90, 1.6, 8.0, 5.8, 0.28, false],
    [20, 48, 2.7, 4.8, 7.0, 0.48, true],
    [92, 55, 1.4, 7.4, 3.2, 0.32, false],
    [35, 12, 3.8, 4.2, 6.8, 0.58, true],
    [65, 82, 2.3, 5.8, 1.0, 0.40, false],
    [10, 25, 1.9, 6.0, 7.4, 0.35, false],
  ];

  const current = slides[activeSlide];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@200;300;400;500&display=swap');

        .mobile-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #0D0906;
        }

        .mobile-hero-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .mobile-hero__bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .mobile-hero__bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transform-origin: top center;
          animation: mhKenBurns 8s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }
        @keyframes mhKenBurns {
          from { transform: scale(1.10) translateY(2%); filter: brightness(0.5) saturate(0.8); }
          to   { transform: scale(1.00) translateY(0); filter: brightness(0.88) saturate(1.0); }
        }

        .mh-grad-top {
          position: absolute; top: 0; left: 0; right: 0;
          height: 220px;
          background: linear-gradient(to bottom, rgba(8,5,3,0.85) 0%, transparent 100%);
          z-index: 3;
          opacity: 0;
          animation: mhOpacFade 1.4s 0.2s ease forwards;
        }
        .mh-grad-bot {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 72%;
          background: linear-gradient(
            to top,
            rgba(5,3,2,1.00) 0%,
            rgba(5,3,2,0.95) 18%,
            rgba(5,3,2,0.80) 40%,
            rgba(5,3,2,0.40) 65%,
            transparent 100%
          );
          z-index: 3;
          opacity: 0;
          animation: mhOpacFade 1.4s 0.2s ease forwards;
        }
        @keyframes mhOpacFade { to { opacity: 1; } }

        .mh-grad-vign {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 80% 20%, rgba(184,146,74,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 70%, rgba(0,0,0,0.18) 0%, transparent 60%);
          z-index: 4; pointer-events: none;
        }

        #mh-particles {
          position: absolute; inset: 0;
          z-index: 5; pointer-events: none; overflow: hidden;
        }
        .mh-pt {
          position: absolute;
          border-radius: 50%;
          background: #D4AC6E;
          opacity: 0;
          animation: mhPtFloat var(--dur) var(--d) ease-in infinite;
        }
        .mh-pt.star {
          background: transparent;
          border-radius: 0;
        }
        .mh-pt.star::before, .mh-pt.star::after {
          content: ''; position: absolute;
          background: #D4AC6E;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 1px;
        }
        .mh-pt.star::before { width: 100%; height: 25%; }
        .mh-pt.star::after { width: 25%; height: 100%; }
        @keyframes mhPtFloat {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
          8%   { opacity: var(--mo, 0.6); }
          88%  { opacity: calc(var(--mo, 0.6) * 0.4); }
          100% { transform: translateY(-85vh) scale(0.3) rotate(180deg); opacity: 0; }
        }

        .mh-nav {
          position: absolute; top: 0; left: 0; right: 0;
          z-index: 20;
          padding: 36px 22px 0;
          display: flex; justify-content: space-between; align-items: center;
          opacity: 0; transform: translateY(-14px);
          animation: mhSlideDown 0.65s 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes mhSlideDown { to { opacity: 1; transform: translateY(0); } }
        .mh-nav__logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #fff;
        }
        .mh-nav__menu { display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mh-nav__menu span {
          display: block; height: 1px; background: rgba(255, 255, 255, 0.85);
          transform-origin: right;
          transition: width 0.3s;
        }
        .mh-nav__menu span:nth-child(1) { width: 22px; }
        .mh-nav__menu span:nth-child(2) { width: 14px; }
        .mh-nav__menu span:nth-child(3) { width: 22px; }
        .mh-nav__menu:hover span:nth-child(2) { width: 22px; }

        @media (min-width: 768px) {
          .mh-nav {
            display: none;
          }
        }

        .mh-season {
          position: absolute;
          right: 16px; top: 42%;
          z-index: 10;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.62rem; font-weight: 300; font-style: italic;
          color: rgba(247, 243, 238, 0.22); letter-spacing: 0.1em;
          writing-mode: vertical-rl; transform: rotate(180deg);
          opacity: 0;
          animation: mhFadeUp 0.5s 2.2s ease forwards;
        }
        @media (min-width: 768px) {
          .mh-season {
            right: 42px;
            font-size: 0.85rem;
          }
        }

        .mh-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 15;
          padding: 0 22px 72px;
        }
        @media (min-width: 768px) {
          .mh-content {
            padding: 0 80px 110px;
            max-width: 700px;
          }
        }

        .mh-eyebrow {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
          opacity: 0;
          animation: mhFadeUp 0.55s 0.85s ease forwards;
        }
        @keyframes mhFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mh-eyebrow__line {
          flex: 0 0 28px; height: 1px; background: #B8924A;
          transform-origin: left; transform: scaleX(0);
          animation: mhDrawLine 0.45s 1.1s ease forwards;
        }
        @keyframes mhDrawLine { to { transform: scaleX(1); } }
        .mh-eyebrow__text {
          font-size: 0.54rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #B8924A;
        }
        @media (min-width: 768px) {
          .mh-eyebrow__text {
            font-size: 0.72rem;
          }
          .mh-eyebrow__line {
            flex: 0 0 42px;
          }
        }

        .mh-headline { margin-bottom: 12px; }
        .mh-h-row { display: block; overflow: hidden; line-height: 1; }
        .mh-h-row span {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          transform: translateY(105%); opacity: 0;
        }
        .mh-h-row.rw span {
          font-size: 0.82rem; font-weight: 300;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: rgba(247, 243, 238, 0.6);
          padding-bottom: 6px;
          animation: mhRevealUp 0.7s 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .mh-h-row.rm span {
          font-size: 3.5rem; font-weight: 300; font-style: italic;
          color: #F7F3EE; letter-spacing: -0.01em;
          line-height: 0.92; padding-bottom: 8px;
          animation: mhRevealUp 0.85s 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .mh-h-row.rl span {
          font-size: 0.82rem; font-weight: 300;
          letter-spacing: 0.36em; text-transform: uppercase;
          color: rgba(247, 243, 238, 0.6);
          padding-top: 4px;
          animation: mhRevealUp 0.7s 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes mhRevealUp { to { transform: translateY(0); opacity: 1; } }

        @media (min-width: 768px) {
          .mh-h-row.rw span {
            font-size: 1.2rem;
            letter-spacing: 0.4em;
          }
          .mh-h-row.rm span {
            font-size: 6.5rem;
            line-height: 0.95;
            padding-bottom: 16px;
          }
          .mh-h-row.rl span {
            font-size: 1.2rem;
            letter-spacing: 0.4em;
          }
        }

        .mh-accent-line {
          display: block; width: 72px; height: 1.5px;
          background: linear-gradient(to right, #B8924A, transparent);
          margin: 6px 0 8px;
          transform: scaleX(0); transform-origin: left;
          animation: mhDrawLine 0.5s 1.7s ease forwards;
        }
        @media (min-width: 768px) {
          .mh-accent-line {
            width: 140px;
            height: 2px;
          }
        }

        .mh-sub {
          font-size: 0.67rem; font-weight: 300;
          line-height: 1.78; color: rgba(247, 243, 238, 0.48);
          max-width: 210px; margin-bottom: 22px;
          opacity: 0;
          animation: mhFadeUp 0.55s 1.6s ease forwards;
        }
        @media (min-width: 768px) {
          .mh-sub {
            font-size: 1rem;
            max-width: 450px;
            margin-bottom: 36px;
          }
        }

        .mh-cta-row {
          display: flex; align-items: center; gap: 18px;
          opacity: 0;
          animation: mhFadeUp 0.55s 1.8s ease forwards;
        }
        .mh-btn {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          border: 1px solid #B8924A;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #B8924A; background: transparent; cursor: pointer;
          outline: none;
          transition: background 0.35s, color 0.35s;
        }
        .mh-btn::after {
          content: '';
          position: absolute; top: 0; left: -120%;
          width: 55%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.11), transparent);
          animation: mhShimmer 2.8s 3s ease infinite;
        }
        @keyframes mhShimmer {
          0%   { left: -120%; }
          40%, 100% { left: 160%; }
        }
        .mh-btn:hover { background: #B8924A; color: #0D0906; }
        .mh-btn__arr { font-size: 0.9rem; }
        .mh-link {
          font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(247, 243, 238, 0.35);
          cursor: pointer;
          position: relative; padding-bottom: 2px;
          transition: color 0.3s;
        }
        .mh-link::after {
          content: '';
          position: absolute; bottom: 0; left: 0;
          width: 0; height: 0.5px;
          background: rgba(247, 243, 238, 0.5);
          transition: width 0.4s;
        }
        .mh-link:hover { color: rgba(247, 243, 238, 0.6); }
        .mh-link:hover::after { width: 100%; }

        @media (min-width: 768px) {
          .mh-btn {
            padding: 16px 36px;
            font-size: 0.78rem;
          }
          .mh-link {
            font-size: 0.78rem;
          }
        }

        .mh-scroll-ind {
          position: absolute; right: 18px; bottom: 62px;
          z-index: 16;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          opacity: 0;
          animation: mhFadeUp 0.4s 2.4s ease forwards;
        }
        .mh-scroll-ind__txt {
          font-size: 0.45rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(247, 243, 238, 0.25);
          writing-mode: vertical-rl;
        }
        .mh-scroll-ind__bar {
          width: 1px; height: 32px;
          background: rgba(184, 146, 74, 0.25);
          position: relative; overflow: hidden;
        }
        .mh-scroll-ind__bar::after {
          content: '';
          position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: #B8924A;
          animation: mhScrollLine 1.6s 2.8s ease-in-out infinite;
        }
        @keyframes mhScrollLine {
          0% { top: -100%; } 100% { top: 100%; }
        }
        @media (min-width: 768px) {
          .mh-scroll-ind {
            right: 42px;
            bottom: 96px;
          }
          .mh-scroll-ind__bar {
            height: 48px;
          }
        }

        .mh-marquee-wrap {
          position: absolute; bottom: 0; left: 0; right: 0;
          z-index: 16;
          border-top: 1px solid rgba(184, 146, 74, 0.22);
          padding: 9px 0;
          background: rgba(5, 3, 2, 0.75);
          backdrop-filter: blur(6px);
          overflow: hidden;
          opacity: 0;
          animation: mhOpacFade 0.5s 2.2s ease forwards;
        }
        .mh-marquee-inner {
          display: flex;
          width: max-content;
          animation: mhScrollLeft 20s linear infinite;
        }
        @keyframes mhScrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .mh-marquee-inner span {
          font-size: 0.52rem; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(184, 146, 74, 0.65);
          white-space: nowrap;
        }
        .mh-marquee-inner i {
          display: inline-block;
          width: 4px; height: 4px;
          background: #B8924A; opacity: 0.45;
          border-radius: 50%; vertical-align: middle;
          margin: 0 14px;
          font-style: normal;
        }
        @media (min-width: 768px) {
          .mh-marquee-inner span {
            font-size: 0.75rem;
          }
          .mh-marquee-wrap {
            padding: 14px 0;
          }
        }

        .mh-indicators {
          position: absolute;
          left: 22px;
          bottom: 42px;
          z-index: 18;
          display: flex;
          gap: 8px;
        }
        .mh-indicator-dot {
          width: 14px;
          height: 2px;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          cursor: pointer;
          transition: width 0.35s ease, background 0.35s ease;
          outline: none;
        }
        .mh-indicator-dot.active {
          width: 28px;
          background: #B8924A;
        }
        @media (min-width: 768px) {
          .mh-indicators {
            left: 80px;
            bottom: 62px;
            gap: 12px;
          }
          .mh-indicator-dot {
            width: 22px;
            height: 3px;
          }
          .mh-indicator-dot.active {
            width: 44px;
          }
        }

        @media (min-width: 1024px) {
          /* Split layout container */
          .mobile-hero {
            background: #0D0906;
          }

          /* Image column (Right) */
          .hero-image-wrapper {
            width: 55% !important;
            left: 45% !important;
            height: 100% !important;
          }

          /* Content column (Left) */
          .mh-content {
            position: absolute !important;
            left: 0 !important;
            width: 45% !important;
            height: 100% !important;
            padding: 0 8% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            bottom: 0 !important;
            z-index: 15;
            background: #0d0906; /* Solid dark background for text readability */
          }

          /* Adjust spacing inside left column */
          .mh-eyebrow {
            margin-bottom: 24px;
          }
          .mh-headline {
            margin-bottom: 24px;
          }
          .mh-sub {
            margin-bottom: 42px;
            max-width: 100%;
          }

          /* Indicators placement */
          .mh-indicators {
            left: 8% !important;
            bottom: 80px !important;
          }

          /* Season watermark placement */
          .mh-season {
            right: 40px !important;
            top: 50% !important;
            transform: translateY(-50%) rotate(180deg) !important;
          }

          /* Scroll indicator placement */
          .mh-scroll-ind {
            right: 40px !important;
            bottom: 110px !important;
          }

          /* Gradient overlays constrained to the image column */
          .mh-grad-top, .mh-grad-bot, .mh-grad-vign {
            width: 55% !important;
            left: 45% !important;
          }
        }
      ` }} />

      {/* ─── HERO FULLSCREEN SECTION (Responsive Unified Slideshow) ────────────────────── */}
      <section
        ref={heroSectionRef}
        onClick={handleReplay}
        className="mobile-hero hero-section relative h-screen w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background colour fallback while image loads */}
          <div className="absolute inset-0 bg-[#b89e86]" />

          {/* heroImageRef — owned by anime.js in page.tsx */}
          <div
            ref={heroImageRef}
            className="hero-image-wrapper absolute inset-0 z-[2] [will-change:transform,opacity]"
          >
            {/* parallaxWrapperRef — owned by GSAP ScrollTrigger (yPercent) */}
            <div
              ref={parallaxWrapperRef}
              className="absolute inset-0 w-full [will-change:transform]"
              aria-hidden="true"
            >
              <img
                src={current.image}
                alt="Manasvi luxury campaign"
                className="h-full w-full object-cover object-top"
                style={{
                  animation: "mhKenBurns 8s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
                  transformOrigin: "top center",
                }}
              />
            </div>
          </div>

          {/* GRADIENTS */}
          <div className="mh-grad-top" />
          <div className="mh-grad-bot" />
          <div className="mh-grad-vign" />
          <div
            ref={vignetteRef}
            className="absolute inset-0 z-[4] pointer-events-none bg-[radial-gradient(circle_at_50%_56%,transparent_38%,rgba(37,24,18,0.16)_100%)]"
          />

          {/* PARTICLES */}
          <div id="mh-particles" className="absolute inset-0 z-[5] pointer-events-none overflow-hidden" aria-hidden="true">
            {ptData.map(([x, yBot, size, dur, delay, mo, isStar], index) => {
              const className = `mh-pt${isStar ? " star" : ""}`;
              const style = {
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                bottom: `${yBot}%`,
                "--dur": `${dur}s`,
                "--d": `${delay}s`,
                "--mo": String(mo),
              } as React.CSSProperties;
              return <div key={index} className={className} style={style} />;
            })}
          </div>

          {/* Film-grain texture */}
          <div
            ref={grainRef}
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,248,244,0.18) 0.8px, transparent 0.8px)",
              backgroundSize: "3px 3px",
            }}
            className="absolute inset-0 z-[6] pointer-events-none"
          />

          {/* Slideshow content */}
          <div key={`${activeSlide}-${timerKey}`} className="absolute inset-0 z-10">
            {/* SEASON WATERMARK */}
            <div className="mh-season">SS &apos; 26 — Surat</div>

            {/* HERO CONTENT */}
            <div className="mh-content">
              {/* Eyebrow */}
              <div className="mh-eyebrow">
                <div className="mh-eyebrow__line"></div>
                <span className="mh-eyebrow__text">{current.eyebrow}</span>
              </div>

              {/* Headline */}
              <div className="mh-headline">
                <div className="mh-h-row rw">
                  <span>{current.row1}</span>
                </div>
                <div className="mh-h-row rm">
                  <span>{current.row2}</span>
                </div>
                <div className="mh-accent-line"></div>
                <div className="mh-h-row rl">
                  <span>{current.row3}</span>
                </div>
              </div>

              {/* Sub */}
              <p className="mh-sub">{current.sub}</p>

              {/* CTA */}
              <div className="mh-cta-row">
                <Link href={current.ctaLink} className="mh-btn" onClick={(e) => e.stopPropagation()}>
                  {current.ctaText}
                  <span className="mh-btn__arr">→</span>
                </Link>
                <Link href="/collections" className="mh-link" onClick={(e) => e.stopPropagation()}>
                  Explore All
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile NAV */}
          <nav className="mh-nav">
            <div className="mh-nav__logo">Manasvi</div>
            <div
              className="mh-nav__menu"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-mobile-menu"));
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>

          {/* Slide Indicators */}
          <div className="mh-indicators">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`mh-indicator-dot ${activeSlide === idx ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* SCROLL INDICATOR */}
          <div className="mh-scroll-ind">
            <span className="mh-scroll-ind__txt">Scroll</span>
            <div className="mh-scroll-ind__bar"></div>
          </div>

          {/* MARQUEE */}
          <div className="mh-marquee-wrap">
            <div className="mh-marquee-inner">
              <span>
                Luxury Kurtis<i></i>Premium Sarees<i></i>
                Artisan Crafted<i></i>Surat Collection<i></i>
                Silk Tunics<i></i>Hand Embroidered<i></i>
                Contemporary Indian<i></i>
                Luxury Kurtis<i></i>Premium Sarees<i></i>
                Artisan Crafted<i></i>Surat Collection<i></i>
                Silk Tunics<i></i>Hand Embroidered<i></i>
                Contemporary Indian<i></i>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
