"use client";

import { useEffect } from "react";
import { animate } from "animejs";
import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Modal entrance animation
    animate(".size-modal", {
      scale: [0.95, 1],
      opacity: [0, 1],
      duration: 300,
      easing: "easeOutQuad",
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeData = [
    { label: "XS", chest: "82", waist: "64", hip: "90", length: "106" },
    { label: "S", chest: "86", waist: "68", hip: "94", length: "107" },
    { label: "M", chest: "90", waist: "72", hip: "98", length: "108" },
    { label: "L", chest: "96", waist: "78", hip: "104", length: "109" },
    { label: "XL", chest: "102", waist: "84", hip: "110", length: "110" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#3B2B28]/45 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#E7C2B8]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-[0_25px_50px_-12px_rgba(61,43,38,0.25)] size-modal opacity-0 scale-95 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8B6B61] hover:text-[#3B2B28] p-2 hover:bg-[#E7C2B8]/10 rounded-full transition-all duration-200 cursor-pointer"
          aria-label="Close size guide"
        >
          <X size={18} />
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <span className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold">
            Measurement Chart
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#3B2B28] uppercase mt-1">
            Size Guide
          </h3>
          <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mt-2" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E7C2B8]/30">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-inter">
            <thead>
              <tr className="bg-[#3B2B28] text-[#FAF7F2]">
                <th className="py-3 px-4 font-semibold tracking-wider text-[11px] uppercase">Size</th>
                <th className="py-3 px-4 font-semibold tracking-wider text-[11px] uppercase">Chest (cm)</th>
                <th className="py-3 px-4 font-semibold tracking-wider text-[11px] uppercase">Waist (cm)</th>
                <th className="py-3 px-4 font-semibold tracking-wider text-[11px] uppercase">Hip (cm)</th>
                <th className="py-3 px-4 font-semibold tracking-wider text-[11px] uppercase">Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7C2B8]/20">
              {sizeData.map((row) => (
                <tr key={row.label} className="odd:bg-white even:bg-[#FAF7F2]/50 hover:bg-[#E7C2B8]/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#3B2B28]">{row.label}</td>
                  <td className="py-3 px-4 text-[#8B6B61]">{row.chest}</td>
                  <td className="py-3 px-4 text-[#8B6B61]">{row.waist}</td>
                  <td className="py-3 px-4 text-[#8B6B61]">{row.hip}</td>
                  <td className="py-3 px-4 text-[#8B6B61]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <p className="mt-5 text-[10px] sm:text-xs text-[#8B6B61] font-light leading-relaxed text-center">
          Note: Body measurements are listed in centimeters. If your measurements fall between sizes, we recommend selecting the larger size for a relaxed, graceful silhouette.
        </p>
      </div>
    </div>
  );
}
