"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";

interface PageLoaderProps {
  isLoading: boolean;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const entranceFired = useRef(false);

  useEffect(() => {
    // 1. Entrance animation (runs on mount)
    const container = containerRef.current;
    if (!container || entranceFired.current) return;
    entranceFired.current = true;

    const brand = container.querySelector(".loader-brand");
    const line = container.querySelector(".loader-line");

    // Set initial values
    if (brand) {
      (brand as HTMLElement).style.opacity = "0";
      (brand as HTMLElement).style.letterSpacing = "0.1em";
    }
    if (line) {
      (line as HTMLElement).style.transform = "scaleX(0)";
    }

    // Run entrance sequence using delay offset
    if (brand) {
      animate(brand, {
        letterSpacing: ["0.1em", "0.5em"],
        opacity: [0, 1],
        duration: 900,
        easing: "easeOutExpo",
      });
    }

    if (line) {
      animate(line, {
        scaleX: [0, 1],
        duration: 600,
        delay: 500, // starts 400ms before brand ends (900 - 400 = 500ms)
        easing: "easeInOutQuart",
      });
    }
  }, []);

  useEffect(() => {
    // 2. Exit animation (runs when isLoading changes to false)
    if (!isLoading && visible) {
      animate(".loader-overlay", {
        opacity: 0,
        translateY: -20,
        duration: 500,
        easing: "easeInQuart",
        complete: () => setVisible(false),
      });
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="loader-overlay fixed inset-0 bg-[#FAF7F2] z-50 flex flex-col items-center justify-center"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="loader-brand font-cormorant text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.1em] text-[#3B2B28] font-light select-none">
          MANASVI
        </h1>
        <div 
          className="loader-line w-32 sm:w-40 h-[1px] bg-[#C98E87] mt-3 origin-center" 
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
