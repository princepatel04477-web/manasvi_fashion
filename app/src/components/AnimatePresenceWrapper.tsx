"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { animate } from "animejs";

export default function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.querySelector(".route-progress-bar");
    if (el) {
      // Show and reset progress bar
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.width = "0%";
      
      // Animate progress bar to 100%
      animate(".route-progress-bar", {
        width: ["0%", "100%"],
        duration: 600,
        easing: "easeInOutQuart",
      });

      // Fade out after completion
      const fadeTimeout = setTimeout(() => {
        animate(".route-progress-bar", {
          opacity: 0,
          duration: 200,
          easing: "easeOutQuad",
        });
      }, 600);

      return () => clearTimeout(fadeTimeout);
    }
  }, [pathname]);

  return (
    <>
      {/* Global thin progress bar */}
      <div 
        className="route-progress-bar fixed top-0 left-0 h-[2px] bg-[#C98E87] z-50 pointer-events-none transition-opacity duration-200" 
        style={{ width: "0%", opacity: 0 }} 
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
