"use client";

import Link from "next/link";
import { DesignGroup } from "@/data/design-groups";
import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import BuyNowButton from "@/components/ui/buy-now-button";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";
import { animate } from "animejs";

export default function DesignGroupGrid({
  title,
  subtitle,
  groups,
  slideFromRight = false,
}: {
  title: string;
  subtitle: string;
  groups: DesignGroup[];
  slideFromRight?: boolean;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
      <div className="mb-8">
        <p className="text-[11px] sm:text-xs tracking-[0.22em] text-[#6a5b4f]">CURATED COLLECTION</p>
        <h1 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-5xl text-[#2f2924]">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#4b4139]">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 overflow-x-hidden">
        {groups.map((group) => (
          <VariantLayout key={group.id} group={group} slideFromRight={slideFromRight} />
        ))}
      </div>
    </main>
  );
}

function VariantLayout({ group, slideFromRight }: { group: DesignGroup; slideFromRight?: boolean }) {
  const [active, setActive] = useState(0);
  const mainImage = group.images[active] || group.images[0];
  const { addCustomToCart } = useShop();
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!slideFromRight) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && articleRef.current) {
            // Read the real distance at animation time — no state needed
            const dist = window.innerWidth < 768 ? 30 : 120;
            animate(articleRef.current, {
              translateX: [dist, 0],
              opacity: [0, 1],
              duration: 900,
              easing: "cubicBezier(0.16, 1, 0.3, 1)",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (articleRef.current) {
      observer.observe(articleRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [slideFromRight]);

  return (
    <article
      ref={articleRef}
      style={slideFromRight ? { opacity: 0 } : undefined}
      className="rounded-2xl border border-[#d9cfbf] bg-[#fffdf9] p-4 shadow-[0_10px_28px_rgba(63,52,44,0.08)]"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="group overflow-hidden rounded-xl bg-[#f5efe6] lg:col-span-8">
          <div className="aspect-[4/5] w-full">
            <img
              src={mainImage}
              alt={`${group.title} selected color`}
              className="h-full w-full scale-[1.06] object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-100"
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2f2924]">{group.title}</h2>
          <p className="mt-2 text-sm text-[#6d5f54]">{group.subtitle}</p>
          <p className="mt-3 text-lg font-semibold text-[#3d2b26]">{formatINR(group.price)}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.12em] text-[#5a4d43]">Color Variants</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {group.images.map((image, idx) => (
              <button
                key={image}
                onClick={() => setActive(idx)}
                className={`group h-14 w-14 overflow-hidden rounded-full border-2 transition ${active === idx ? "border-[#3d2b26]" : "border-[#d8c8b6]"}`}
                aria-label={`${group.title} color ${idx + 1}`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full scale-[1.08] object-contain bg-[#f5efe6] transition-transform duration-500 ease-out group-hover:scale-100"
                />
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() =>
                addCustomToCart({
                  productId: group.id,
                  title: group.title,
                  image: mainImage,
                  price: group.price,
                  size: "Free",
                  slug: group.href,
                })
              }
              className="group relative inline-flex h-[50px] w-full sm:w-[190px] items-center justify-start overflow-hidden rounded-[12px] bg-[#3d2b26] pl-6 pr-4 text-[#fffdf9] transition-all duration-300"
            >
              <span className="mr-8 text-sm tracking-wide transition-opacity duration-500 group-hover:opacity-0">
                Add to Cart
              </span>
              <i className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-sm bg-[#fffdf926] transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </button>

            <Link href={group.href} aria-label={`Buy now ${group.title}`}>
              <BuyNowButton />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
