"use client";

import { useEffect, useState } from "react";

// Simple cubic bezier solver
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_MAX_ITERATIONS = 10;
  const SUBDIVISION_PRECISION = 0.0000001;

  const mSampleValues = new Float32Array(11);
  for (let i = 0; i < 11; ++i) {
    mSampleValues[i] = calcBezier(i * 0.1, x1, x2);
  }

  function calcBezier(aT: number, aA1: number, aA2: number) {
    return ((3.0 * aA1 - 3.0 * aA2 + 1.0) * aT * aT * aT +
            (3.0 * aA2 - 6.0 * aA1) * aT * aT +
            3.0 * aA1 * aT);
  }

  function getSlope(aT: number, aA1: number, aA2: number) {
    return (3.0 * (3.0 * aA1 - 3.0 * aA2 + 1.0) * aT * aT +
            2.0 * (3.0 * aA2 - 6.0 * aA1) * aT +
            3.0 * aA1);
  }

  function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number) {
    let currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function getTForX(aX: number) {
    let intervalStart = 0.0;
    let currentSample = 1;
    for (; currentSample !== 10 && mSampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += 0.1;
    }
    --currentSample;

    const dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
    const guessForT = intervalStart + dist * 0.1;

    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, x1, x2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + 0.1, x1, x2);
    }
  }

  return function (x: number) {
    if (x1 === y1 && x2 === y2) {
      return x; // Linear
    }
    if (x === 0 || x === 1) {
      return x;
    }
    return calcBezier(getTForX(x), y1, y2);
  };
}

export const luxuryEase = cubicBezier(0.16, 1, 0.3, 1);

export interface InterpolationConfig {
  inputRange: number[];
  outputRange: number[];
  ease?: (t: number) => number;
  clamp?: boolean;
}

export function interpolate(value: number, config: InterpolationConfig): number {
  const { inputRange, outputRange, ease, clamp = true } = config;
  
  if (value <= inputRange[0]) {
    return outputRange[0];
  }
  if (value >= inputRange[inputRange.length - 1]) {
    return outputRange[outputRange.length - 1];
  }

  // Find index
  let i = 0;
  for (; i < inputRange.length - 1; i++) {
    if (value <= inputRange[i + 1]) {
      break;
    }
  }

  const minIn = inputRange[i];
  const maxIn = inputRange[i + 1];
  const minOut = outputRange[i];
  const maxOut = outputRange[i + 1];

  let progress = (value - minIn) / (maxIn - minIn);
  if (clamp) {
    progress = Math.max(0, Math.min(1, progress));
  }

  if (ease) {
    progress = ease(progress);
  }

  return minOut + progress * (maxOut - minOut);
}

// Hook to track window scroll position
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Set initial scroll
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}
