"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";

/**
 * Reusable hook to reveal elements (product cards and section headings)
 * on scroll using IntersectionObserver and Anime.js v4.
 *
 * @param ref Ref of the parent container element to observe
 * @param staggerDelay Stagger delay in milliseconds between revealing each card
 */
export default function useScrollReveal(
  ref: React.RefObject<HTMLElement | null>,
  staggerDelay: number = 90
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Query elements inside the container
    const cards = el.querySelectorAll(".product-card");
    const headings = el.querySelectorAll(".section-heading");

    // Set initial CSS values to prevent visual flashes
    cards.forEach((card) => {
      const htmlCard = card as HTMLElement;
      htmlCard.style.opacity = "0";
      htmlCard.style.transform = "translateY(50px)";
      htmlCard.style.willChange = "transform, opacity";
    });

    headings.forEach((heading) => {
      const htmlHeading = heading as HTMLElement;
      htmlHeading.style.opacity = "0";
      htmlHeading.style.transform = "translateY(30px)";
      htmlHeading.style.willChange = "transform, opacity";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate section headings first
            if (headings.length > 0) {
              animate(Array.from(headings), {
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 600,
                ease: "outQuart", // maps to easeOutQuart
              });
            }

            // Animate product cards staggered
            if (cards.length > 0) {
              animate(Array.from(cards), {
                translateY: [50, 0],
                opacity: [0, 1],
                delay: stagger(staggerDelay),
                duration: 750,
                ease: "outExpo", // maps to easeOutExpo
              });
            }

            // Disconnect observer after firing to animate once
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref, staggerDelay]);
}
