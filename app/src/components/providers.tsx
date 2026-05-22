"use client";

import { ShopProvider } from "@/context/shop-context";
import { SessionProvider } from "next-auth/react";
import Lenis from "lenis";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true });
    (window as any).lenis = lenis;
    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frameId);
      (window as any).lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return (
    <SessionProvider>
      <ShopProvider>{children}</ShopProvider>
    </SessionProvider>
  );
}
