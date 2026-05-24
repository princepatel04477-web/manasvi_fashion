"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { Truck, RotateCcw, Coins, Award } from "lucide-react";

export default function TrustBadges() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(".trust-badge", {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: stagger(80),
            duration: 500,
            easing: "easeOutQuart",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const badges = [
    {
      icon: Truck,
      title: "Free Delivery",
      subtitle: "Above ₹999 across India",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Returns",
      subtitle: "Hassle-free exchange",
    },
    {
      icon: Coins,
      title: "Cash on Delivery Available",
      subtitle: "Pay when order arrives",
    },
    {
      icon: Award,
      title: "100% Authentic Fabrics",
      subtitle: "Surat artisan sourced",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto py-8 px-4"
    >
      <div className="grid grid-cols-2 md:flex md:flex-row md:justify-center md:items-center gap-6 md:gap-8 lg:gap-12">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="trust-badge flex items-center gap-3 text-left opacity-0 translate-y-5"
            >
              <div className="p-2 rounded-xl bg-[#E7C2B8]/15 text-[#8B6B61] flex-shrink-0">
                <Icon size={18} className="stroke-[1.5]" />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-serif text-[13px] font-bold text-[#3B2B28] leading-tight">
                  {badge.title}
                </h4>
                <span className="font-inter text-[11px] text-[#8B6B61] leading-tight mt-0.5">
                  {badge.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
