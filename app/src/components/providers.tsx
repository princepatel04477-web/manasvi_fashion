"use client";

import { ShopProvider } from "@/context/shop-context";
import { SessionProvider } from "next-auth/react";
import { LenisProvider, useLenis } from "@/lib/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Inner component that runs *inside* LenisProvider so useLenis() works.
 * Connects each Lenis scroll tick to ScrollTrigger.update(), keeping all
 * scrub animations driven by the smoothed virtual position.
 *
 * Also calls ScrollTrigger.refresh() once document.fonts are ready so that
 * element positions are measured after web fonts have shifted layout.
 */
function ScrollTriggerBridge({ children }: { children: React.ReactNode }) {
  // Called on every Lenis scroll tick — keeps ScrollTrigger scrub in sync
  useLenis(({ scroll }) => {
    // Update all ScrollTrigger instances with the smoothed scroll position
    ScrollTrigger.update();
    // Suppress unused-variable lint — scroll is available if needed downstream
    void scroll;
  });

  useEffect(() => {
    // Refresh ScrollTrigger once all web fonts finish loading.
    // Fonts (especially large display serifs) shift layout enough to
    // miscalculate trigger positions if refresh runs before they load.
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      console.log("[ScrollTrigger] Refreshed after fonts.ready");
    });

    // Also refresh on resize with a small debounce
    let debounceId = 0;
    const onResize = () => {
      clearTimeout(debounceId);
      debounceId = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(debounceId);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Root provider tree for the entire app.
 * LenisProvider wraps everything so useLenis() works anywhere in the tree.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <SessionProvider>
        <ShopProvider>
          <ScrollTriggerBridge>{children}</ScrollTriggerBridge>
        </ShopProvider>
      </SessionProvider>
    </LenisProvider>
  );
}
