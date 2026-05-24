"use client";

/**
 * /src/lib/lenis.ts
 *
 * Re-exports the official lenis/react primitives with the exact Lenis options
 * requested. Import from here throughout the app so the config lives in one place.
 *
 * useLenis() — hook that returns the Lenis instance and accepts an optional
 *              scroll callback. Requires a <LenisProvider> ancestor.
 *
 * LenisProvider — thin wrapper around ReactLenis with root=true so it attaches
 *                 to the document scroller and owns its animation frame loop.
 */

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisProps, LenisRef } from "lenis/react";
import { forwardRef } from "react";

// ─── Lenis configuration ────────────────────────────────────────────────────
const LENIS_OPTIONS: LenisProps["options"] = {
  lerp: 0.08,          // Smoothing factor (0 = instant, 1 = never arrives)
  duration: 1.2,       // Duration used when not in lerp mode
  smoothWheel: true,   // Smooth mouse-wheel events
  autoRaf: true,       // Let Lenis drive its own RAF so wheel/touch input advances
};

// ─── LenisProvider ──────────────────────────────────────────────────────────
/**
 * Wrap your app (or layout) with this.  Use root=true so Lenis attaches to
 * the document scroll container instead of creating an inner overflow div.
 *
 * ScrollTrigger integration lives in the app providers via useLenis(), while
 * this wrapper keeps the Lenis instance running.
 */
const LenisProvider = forwardRef<LenisRef, { children: React.ReactNode }>(
  function LenisProvider({ children }, ref) {
    return (
      <ReactLenis
        ref={ref}
        root
        options={LENIS_OPTIONS}
      >
        {children}
      </ReactLenis>
    );
  }
);

LenisProvider.displayName = "LenisProvider";

export { LenisProvider, useLenis };
