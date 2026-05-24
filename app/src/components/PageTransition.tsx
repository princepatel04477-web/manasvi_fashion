"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORY_ORDER = [
  "/",
  "/kurtis",
  "/tunic-tops",
  "/dresses",
  "/collections",
  "/new-arrivals"
];

function getNavigationDirection(prev: string, current: string): "forward" | "back" | "fade" {
  const prevIdx = CATEGORY_ORDER.indexOf(prev);
  const currentIdx = CATEGORY_ORDER.indexOf(current);

  if (prevIdx !== -1 && currentIdx !== -1) {
    return currentIdx > prevIdx ? "forward" : "back";
  }
  return "fade";
}

const fadeVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

const forwardVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, x: -40, transition: { duration: 0.3 } }
};

const backVariants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, x: 40, transition: { duration: 0.3 } }
};

// Module-level variable to store the previous pathname across page transitions
let globalPrevPath = "";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState<"forward" | "back" | "fade">("fade");

  useEffect(() => {
    if (globalPrevPath && globalPrevPath !== pathname) {
      const dir = getNavigationDirection(globalPrevPath, pathname);
      setDirection(dir);
    } else {
      setDirection("fade");
    }
    globalPrevPath = pathname;
  }, [pathname]);

  const currentVariants = 
    direction === "forward" ? forwardVariants :
    direction === "back" ? backVariants :
    fadeVariants;

  return (
    <motion.div
      variants={currentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
export default PageTransition;
