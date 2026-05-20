"use client";

import * as React from "react";

export interface BuyNowButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  initialText?: string;
  hoverText?: string;
}

const BuyNowButton = React.forwardRef<HTMLDivElement, BuyNowButtonProps>(
  ({ initialText = "BUY NOW", hoverText = "SHOPNOW", className = "", ...props }, ref) => {
    if (initialText.length !== hoverText.length) {
      console.error("Initial and hover text must have the same length.");
      return null;
    }

    return (
      <div ref={ref} className={`group inline-flex cursor-pointer ${className}`} {...props}>
        {initialText.split("").map((char, index) => (
          <div
            key={index}
            className="relative flex h-10 w-8 items-center justify-center overflow-hidden bg-[#3d2b26] text-xs font-bold tracking-wide text-[#fffdf9] transition-all duration-700"
          >
            <div
              className={`absolute inset-0 flex items-center justify-center bg-[#1f1714] transition-transform duration-300 ${
                index % 2 === 0 ? "translate-y-full" : "-translate-y-full"
              } group-hover:translate-y-0`}
            >
              {hoverText[index]}
            </div>
            {char}
          </div>
        ))}
      </div>
    );
  },
);

BuyNowButton.displayName = "BuyNowButton";

export default BuyNowButton;
