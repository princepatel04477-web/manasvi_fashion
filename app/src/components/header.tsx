"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const navRef1 = useRef<HTMLElement>(null);
  const navRef2 = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sy = window.scrollY;
      const navOpacity = interpolate(sy, { inputRange: [190, 360], outputRange: [0, 1], ease: luxuryEase });
      const navY = interpolate(sy, { inputRange: [190, 360], outputRange: [20, 0], ease: luxuryEase });
      const logoOpacity = interpolate(sy, { inputRange: [650, 730], outputRange: [0, 1], ease: luxuryEase });

      if (navRef1.current) {
        set(navRef1.current, {
          opacity: navOpacity,
          translateY: `${navY}px`
        });
      }
      if (navRef2.current) {
        set(navRef2.current, {
          opacity: navOpacity,
          translateY: `${navY}px`
        });
      }
      if (logoRef.current) {
        set(logoRef.current, {
          opacity: logoOpacity
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  if (!isHome) {
    return (
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <Link href="/" className="flex flex-col items-center gap-1 font-[var(--font-grance)] text-2xl font-semibold tracking-[0.04em] text-[#3d2b26]">
              <span>MANASVI</span>
              <span className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.22em] opacity-90">Fashion</span>
            </Link>
          </div>
          <nav className="hidden gap-6 text-xs uppercase tracking-[0.22em] text-[#3d2b26] md:flex [text-rendering:optimizeLegibility]">
            {["/new-arrivals", "/kurtis", "/tunic-tops", "/dresses", "/contact", "/cart"].map((path, i) => (
              <Link key={path} href={path} className="opacity-90 transition-colors duration-300 hover:text-black">
                {["New", "Kurtis", "Tunics", "Dresses", "Contact", "Cart"][i]}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-4 text-[#fff8f2] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] [will-change:transform,opacity]"
      >
        <nav
          ref={navRef1}
          style={{ opacity: 0, transform: "translateY(20px)" }}
          className="col-start-1 hidden items-center gap-6 font-[var(--font-cormorant)] text-sm font-semibold uppercase tracking-[0.16em] md:flex [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
        >
          {[
            ["/kurtis", "Kurti"],
            ["/tunic-tops", "Tunic Tops"],
            ["/collections", "Collections"],
          ].map(([path, label]) => (
            <Link key={path} href={path} className="opacity-90 transition-colors duration-300 hover:text-black">
              {label}
            </Link>
          ))}
        </nav>

        <div
          ref={logoRef}
          style={{ opacity: 0 }}
          className="col-start-2 justify-self-center [will-change:opacity]"
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-0 [font-kerning:normal] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
          >
            <div className="font-[var(--font-bodoni)] text-[1.625rem] leading-none tracking-[0.055em] text-[#fff8f2] md:text-3xl">
              MANASVI
            </div>
            <div className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.22em] text-[#fff8f2] opacity-90">
              Fashion
            </div>
          </Link>
        </div>

        <nav
          ref={navRef2}
          style={{ opacity: 0, transform: "translateY(20px)" }}
          className="col-start-3 hidden items-center justify-end gap-6 font-[var(--font-cormorant)] text-sm font-semibold uppercase tracking-[0.16em] md:flex [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
        >
          {[
            ["/about", "About"],
            ["/contact", "Contact"],
            ["/cart", "Cart"],
          ].map(([path, label]) => (
            <Link key={path} href={path} className="opacity-90 transition-colors duration-300 hover:text-black">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
