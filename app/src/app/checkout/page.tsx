"use client";

import { FormEvent, useState, useEffect } from "react";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { cartTotal, clearCart } = useShop();
  const [status, setStatus] = useState("");

  // States bound to real user inputs
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");

  // Auto pre-populate form when real logged-in user profile details load
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      if (u.name) setName(u.name);
      if (u.shippingAddress) setAddress(u.shippingAddress);
      if (u.city) setCity(u.city);
      if (u.postalCode) setPin(u.postalCode);
    }
  }, [session]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 flex flex-col justify-center items-center">
        <span className="font-cormorant text-xs uppercase tracking-[0.25em] text-[#8B6B61] animate-pulse mb-2">Manasvi Fashion</span>
        <p className="font-inter text-xs text-[#8B6B61]/80 font-light">Verifying secure checkout session...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, city, pin })
    });
    const data = await res.json();
    setStatus(`Order placed successfully: ${data.orderId}`);
    clearCart();
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 md:px-6 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-10 flex flex-col gap-3 animate-slide-in">
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight">
            Secure Checkout
          </h1>
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] tracking-wide font-light">
            Complete your shipping details below to place your order securely.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 sm:p-8 warm-shadow">
          <div className="space-y-4">
            <input 
              required 
              type="text"
              autoCapitalize="words"
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter text-base md:text-sm tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28]" 
            />
            <input 
              required 
              type="text"
              placeholder="Address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter text-base md:text-sm tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28]" 
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input 
                required 
                type="text"
                autoCapitalize="words"
                placeholder="City" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter text-base md:text-sm tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28]" 
              />
              <input 
                required 
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="PIN Code" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter text-base md:text-sm tracking-wider placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28]" 
              />
            </div>
            <select className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter text-base md:text-sm tracking-wider focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] cursor-pointer min-h-[52px]">
              <option>UPI Payment (Fastest)</option>
              <option>Razorpay Secure</option>
              <option>Stripe Card (International)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#E7C2B8]/30 flex justify-between items-baseline">
            <span className="font-cormorant text-xl text-[#3B2B28] italic">Order Total</span>
            <span className="font-cormorant text-2xl font-medium text-[#3B2B28]">
              {formatINR(cartTotal)}
            </span>
          </div>

          <button className="w-full py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:bg-[#8B6B61] shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2">
            Place Selection Order
          </button>
          
          {status && (
            <p className="font-cormorant text-sm italic text-[#8B6B61] text-center mt-3 animate-pulse">
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
