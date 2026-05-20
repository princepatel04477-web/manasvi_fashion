"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && footerRef.current) {
            animate(footerRef.current, {
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 800,
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{ opacity: 0, transform: "translateY(40px)" }}
      className="mt-20 bg-[#3d2b26] px-6 py-16 text-[#fff8f4]"
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div><h3 className="font-[var(--font-grance)] text-2xl">MANASVI</h3><p className="mt-3 text-sm text-[#d9a58f]">Luxury women&apos;s kurtis and dresses.</p></div>
        <div><h4 className="mb-2 font-semibold">Shop</h4><p>New Arrivals</p><p>Kurtis</p><p>Dresses</p></div>
        <div><h4 className="mb-2 font-semibold">Support</h4><p>Shipping Policy</p><p>Returns</p><p>Track Order</p></div>
        <div><h4 className="mb-2 font-semibold">Newsletter</h4><input placeholder="Email" className="w-full rounded-md bg-[#fff8f4] p-2 text-[#3d2b26]" /></div>
      </div>
    </footer>
  );
}
