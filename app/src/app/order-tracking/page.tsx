"use client";

import { useState } from "react";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");

  const track = async () => {
    const res = await fetch(`/api/track?id=${id}`);
    const data = await res.json();
    setStatus(data.status);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 px-4 md:px-6 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-12 md:mb-16 flex flex-col gap-3 animate-slide-in">
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight">
            Track Your Order
          </h1>
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-xs sm:text-sm text-[#8B6B61] tracking-wide font-light">
            Enter your order ID below to verify details of your wardrobe selection.
          </p>
        </div>

        {/* TRACKING INPUT BLOCK */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <input 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            placeholder="e.g. order_12345" 
            className="flex-1 rounded-xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-sm p-4 font-inter text-xs tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 warm-shadow text-[#3B2B28]" 
          />
          <button 
            onClick={track} 
            className="px-8 py-4 bg-[#3B2B28] text-white rounded-xl font-cormorant text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#8B6B61] shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          >
            Track Selection
          </button>
        </div>

        {/* STATUS BLOCK */}
        {status && (
          <div className="mt-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-[#E7C2B8]/40 warm-shadow max-w-2xl animate-slide-in">
            <p className="font-inter text-[10px] tracking-widest text-[#C98E87] uppercase font-semibold">
              Current Shipment State
            </p>
            <p className="mt-2 font-cormorant text-2xl font-light text-[#3B2B28] leading-snug">
              {status}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
