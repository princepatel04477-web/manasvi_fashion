"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const CAMPAIGN_IMAGES = [
  "/photos/Gemini_Generated_Image_h8k8lch8k8lch8k8.png",
  "/photos/Gemini_Generated_Image_o7map6o7map6o7ma.png",
  "/photos/Gemini_Generated_Image_7p370v7p370v7p37.png",
  "/manasvi-hero.png",
];

function CinematicSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CAMPAIGN_IMAGES.length);
    }, 8000); // Cross-fade every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#3B2B28] soft-grain">
      {CAMPAIGN_IMAGES.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? "opacity-90" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center ken-burns-slow scale-105"
            style={{ backgroundImage: `url('${img}')` }}
          />
        </div>
      ))}

      {/* Warm Cinematic sunset light leak layer */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-[#FAF7F2]/10 via-[#F4D7CF]/20 to-[#DFAE9F]/15 cinematic-leak" />

      {/* Dark luxury vignetting and editorial styling gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#3B2B28]/85 via-[#3B2B28]/20 to-[#3B2B28]/45" />

      {/* Editorial Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 text-[#FAF7F2] z-10">
        <div>
          <span className="font-serif text-xs uppercase tracking-[0.35em] text-[#E7C2B8]/90">Surat Edition</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl tracking-[0.1em] font-light text-shadow-elegant">
            MANASVI FASHION
          </h2>
        </div>

        <div className="max-w-md space-y-6">
          <p className="font-serif text-lg md:text-xl italic font-light leading-relaxed text-[#FAF7F2]/90">
            &ldquo;Create your account and become part of our exclusive operations, craft, and premium customer network.&rdquo;
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-[#E7C2B8] to-transparent opacity-60" />
          <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E7C2B8]">
            <span>Kurtis</span>
            <span className="w-1 h-1 rounded-full bg-[#E7C2B8]/40"></span>
            <span>Dresses</span>
            <span className="w-1 h-1 rounded-full bg-[#E7C2B8]/40"></span>
            <span>Tunic Tops</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          shippingAddress,
          city,
          postalCode
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to register account.");
      } else {
        // Successful registration, redirect to signin
        router.push(`/auth/signin?registered=true&email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2] relative">
      {/* Left side: Cinematic slideshow */}
      <div className="w-full md:w-1/2 h-[45vh] md:h-screen sticky top-0 z-0">
        <CinematicSlideshow />
      </div>

      {/* Right side: SignUp Form viewport */}
      <div className="w-full md:w-1/2 min-h-[55vh] md:min-h-screen flex items-center justify-center bg-[#FAF7F2] z-10 shadow-[-20px_0_40px_rgba(59,43,40,0.03)] border-t md:border-t-0 md:border-l border-[#E7C2B8]/20 relative">
        <div className="w-full max-w-md px-4 sm:px-8 py-12 md:py-0 flex flex-col justify-center md:min-h-screen">
          <div className="space-y-8">
            {/* Title Block */}
            <div className="space-y-3">
              <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-[#8B6B61] block">
                Exclusive Invitation
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#3B2B28] font-light tracking-wide">
                Create Account
              </h1>
              <p className="text-xs text-[#8B6B61]/80 leading-relaxed font-light">
                Register to enter the Manasvi Fashion boutique operations and premium membership portal.
              </p>
            </div>

            {/* Error handling */}
            {error && (
              <div className="rounded-xl bg-[#C98E87]/10 border border-[#C98E87]/30 p-4 text-xs text-[#8B6B61] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87]"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Full Name
                </label>
                <input
                  type="text"
                  autoCapitalize="words"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Prince Patel"
                  className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Email Address
                </label>
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. prince@example.com"
                  className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 pr-10 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-[#8B6B61]/70 hover:text-[#3B2B28] transition-colors duration-300 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Details (Boutique Delivery) */}
              <div className="pt-4 border-t border-[#E7C2B8]/20 mt-6">
                <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-[#8B6B61] block mb-4">
                  Boutique Shipping Profile
                </span>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Shipping Address
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="e.g. 101, Rosewood Heights, VIP Road"
                  className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                    City
                  </label>
                  <input
                    type="text"
                    autoCapitalize="words"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Surat"
                    className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 395007"
                    className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C98E87] via-[#8B6B61] to-[#3B2B28] text-[#FAF7F2] py-4 rounded-full text-[10px] font-semibold tracking-[0.25em] uppercase transition-all duration-500 hover:shadow-[0_8px_24px_-8px_rgba(139,107,97,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? "Registering Credentials..." : "Create Account"}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7C2B8]/20" />
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="text-center text-xs text-[#8B6B61]/85 pt-2">
              Already have a boutique account?{" "}
              <Link href="/auth/signin" className="font-semibold text-[#8B6B61] hover:text-[#3B2B28] underline underline-offset-4 transition">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
