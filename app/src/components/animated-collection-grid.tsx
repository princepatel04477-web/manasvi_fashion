"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import ProductCard from "@/components/product-card";
import { Product } from "@/types";

export default function AnimatedCollectionGrid({ title, subtitle, products }: { title: string; subtitle: string; products: Product[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      animate(headerRef.current, {
        opacity: [0, 1],
        scale: [1.06, 1],
        translateY: [24, 0],
        duration: 800,
        easing: "easeOutQuad",
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = gridRef.current?.querySelectorAll(".product-card-reveal");
            if (cards && cards.length > 0) {
              animate(Array.from(cards), {
                opacity: [0, 1],
                scale: [1.08, 1],
                translateY: [28, 0],
                delay: stagger(60),
                duration: 550,
                easing: "easeOutQuad",
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        ref={headerRef}
        style={{ opacity: 0, transform: "scale(1.06) translateY(24px)" }}
        className="mb-8"
      >
        <p className="text-[11px] sm:text-xs tracking-[0.22em] text-[#6e2b38]">CURATED COLLECTION</p>
        <h1 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#3d2b26cc]">{subtitle}</p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            style={{ opacity: 0, transform: "scale(1.08) translateY(28px)" }}
            className="product-card-reveal transition-transform duration-300 hover:scale-[0.98] [will-change:transform,opacity]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
