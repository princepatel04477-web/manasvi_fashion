"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
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
        router.push(`/auth/signin?registered=true&email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!supabase) {
      setError("Database connection offline. Please try again later.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const targetUrl = rawCallbackUrl ? `?callbackUrl=${encodeURIComponent(rawCallbackUrl)}` : "";
      const redirectTo = `${origin}/auth/callback${targetUrl}`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google registration. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Mobile Branding Header (Mobile Only) */}
      <div className="flex flex-col items-center text-center space-y-4 md:hidden">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-surface-container-low shadow-sm">
          <Link href="/">
            <img alt="Manasvi Fashion Surat Logo" className="w-20 h-20 rounded-full object-cover" src="/Man_logo.png" />
          </Link>
        </div>
        <div className="space-y-2">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-earth-brown">Create an Account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Join our community of elegance.</p>
        </div>
      </div>

      {/* Form container: Glass panel on desktop, Simple card on mobile */}
      <div className="relative z-10 w-full max-w-md bg-surface md:glass-panel p-6 md:p-10 rounded-xl border border-outline-variant/20 md:border-white/50 shadow-[0px_10px_30px_rgba(59,43,40,0.03)] md:shadow-[0_10px_40px_rgba(59,43,40,0.08)]">
        {/* Desktop Branding Header (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <img
                src="/Man_logo.png"
                alt="Manasvi Fashion Logo"
                className="w-24 h-24 rounded-full object-cover border border-[#C98E87]/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="font-headline-md text-headline-md text-earth-brown mb-2 mt-4">Create an Account</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Join our community of elegance.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-[#C98E87]/10 border border-[#C98E87]/30 p-4 text-xs text-[#8B6B61] flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87]"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative pt-4">
            <input
              className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer"
              id="fullname"
              placeholder=" "
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="fullname">Full Name</label>
          </div>

          {/* Email */}
          <div className="relative pt-4">
            <input
              className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer"
              id="email"
              placeholder=" "
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="email">Email Address</label>
          </div>

          {/* Phone Number */}
          <div className="relative pt-4">
            <input
              className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer"
              id="phone"
              placeholder=" "
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="phone">Phone Number</label>
          </div>

          {/* Shipping Address */}
          <div className="relative pt-4">
            <textarea
              className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer min-h-[80px] resize-none"
              id="address"
              placeholder=" "
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
            <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="address">Address</label>
          </div>

          {/* City & PIN */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative pt-4">
              <input
                className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer"
                id="city"
                placeholder=" "
                required
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="city">City</label>
            </div>
            <div className="relative pt-4">
              <input
                className="floating-input w-full border-0 border-b border-outline-variant bg-transparent py-2 px-0 text-on-surface focus:ring-0 transition-colors duration-300 peer"
                id="pincode"
                placeholder=" "
                required
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="pincode">PIN Code</label>
            </div>
          </div>

          {/* Password */}
          <div className="relative pt-4 flex items-center border-b border-outline-variant focus-within:border-antique-gold transition-colors duration-300">
            <input
              className="floating-input w-full border-0 bg-transparent py-2 px-0 text-on-surface focus:ring-0 duration-300 pr-10"
              id="password"
              placeholder=" "
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="floating-label absolute left-0 top-6 text-on-surface-variant font-label-md text-label-md transition-all pointer-events-none origin-left duration-300" htmlFor="password">Password</label>
            <button
              aria-label="Toggle password visibility"
              className="text-on-surface-variant hover:text-antique-gold focus:outline-none transition-colors cursor-pointer"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              )}
            </button>
          </div>

          {/* Submit CTA */}
          <button
            className="w-full bg-antique-gold md:champagne-gradient text-white font-label-md text-label-md py-4 mt-8 rounded uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:bg-opacity-95 cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            Create Account
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-4 border-t border-[#E7C2B8]/20">
          <p className="font-body-md text-body-md text-on-surface-variant text-center">
            Already have an account?{" "}
            <Link
              className="text-earth-brown font-semibold hover:text-antique-gold transition-colors underline decoration-antique-gold/30 underline-offset-4"
              href="/auth/signin"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Value Props & Social */}
      <div className="flex flex-col items-center w-full space-y-8">
        <div className="flex items-center justify-center space-x-4 w-full">
          <div className="h-px bg-outline-variant/50 w-full"></div>
          <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap px-2">OR REGISTER WITH</span>
          <div className="h-px bg-outline-variant/50 w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full border border-outline-variant/50 hover:border-antique-gold bg-transparent text-earth-brown font-label-md text-label-md py-3 flex items-center justify-center gap-3 transition-colors duration-300 group cursor-pointer disabled:opacity-50"
          type="button"
          disabled={loading}
        >
          <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
          </svg>
          Sign up with Google
        </button>

        {/* Mobile Value Props Container (Mobile Only) */}
        <div className="md:hidden w-full bg-surface-container-low p-6 border border-outline-variant/10 text-center space-y-6">
          <h3 className="font-headline-sm text-headline-sm text-earth-brown border-b border-outline-variant/20 inline-block pb-2 px-4">Why Shop With Us?</h3>
          <div className="grid grid-cols-1 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-antique-gold text-2xl font-light">diamond</span>
              <span className="font-label-md text-label-md text-on-surface">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-antique-gold text-2xl font-light">auto_awesome</span>
              <span className="font-label-md text-label-md text-on-surface">Elegant Designs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-antique-gold text-2xl font-light">lock</span>
              <span className="font-label-md text-label-md text-on-surface">Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-on-surface font-body-md antialiased overflow-x-hidden relative">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;600;700&family=EB+Garamond:wght@400;500&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

          .bg-background { background-color: #fdf9f4; }
          .bg-surface { background-color: #fdf9f4; }
          .bg-soft-ivory { background-color: #FAF7F5; }
          .text-earth-brown { color: #3B2B28; }
          .text-on-surface { color: #1c1c19; }
          .text-on-surface-variant { color: #4f4443; }
          .border-outline-variant { border-color: #d2c3c0; }
          .focus\\:border-champagne-gold:focus { border-color: #D4AF37; outline: none; }
          .text-champagne-gold { color: #D4AF37; }
          .decoration-champagne-gold\\/30 { text-decoration-color: rgba(212, 175, 55, 0.3); }

          .bg-surface-container-low { background-color: #f7f3ee; }
          .bg-surface-container-lowest { background-color: #ffffff; }
          .text-parchment { color: #F7F3EE; }
          .text-antique-gold { color: #B8924A; }
          .bg-antique-gold { background-color: #B8924A; }

          .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
          }
          
          .floating-input {
            background-color: transparent !important;
          }
          .floating-input:focus ~ .floating-label,
          .floating-input:not(:placeholder-shown) ~ .floating-label {
            transform: translateY(-1.5rem) scale(0.85);
            color: #B8924A;
          }

          .champagne-gradient {
            background: linear-gradient(135deg, #E6C27A 0%, #D4AF37 50%, #B8924A 100%);
          }

          .font-display-lg {
            font-family: 'EB Garamond', serif;
            font-size: 48px;
            line-height: 1.1;
            font-weight: 500;
          }
          .font-display-lg-mobile {
            font-family: 'EB Garamond', serif;
            font-size: 36px;
            line-height: 1.2;
            font-weight: 500;
          }
          .font-headline-md {
            font-family: 'EB Garamond', serif;
            font-size: 32px;
            line-height: 1.3;
            font-weight: 400;
          }
          .font-headline-sm {
            font-family: 'EB Garamond', serif;
            font-size: 24px;
            line-height: 1.4;
            font-weight: 500;
          }
          .font-body-md {
            font-family: 'DM Sans', sans-serif;
            font-size: 16px;
            line-height: 1.6;
          }
          .font-body-lg {
            font-family: 'DM Sans', sans-serif;
            font-size: 18px;
            line-height: 1.6;
          }
          .font-label-md {
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            line-height: 1.2;
            font-weight: 500;
          }
          .font-label-sm {
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            line-height: 1.2;
            font-weight: 700;
          }
        ` }} />

        <main className="min-h-screen flex flex-col md:flex-row w-full">
          {/* Left Side: Editorial Photography (Desktop Only) */}
          <section className="hidden md:flex w-[60%] relative h-screen">
            <div className="absolute inset-0 z-0">
              <img
                alt="Editorial Fashion"
                className="w-full h-full object-cover"
                src="/photos/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B2B28]/80 via-[#3B2B28]/30 to-transparent"></div>
            </div>
            <div className="relative z-10 flex flex-col justify-end p-16 w-full text-white pb-24">
              <h1 className="font-display-lg text-display-lg mb-4 text-white drop-shadow-md">
                MANASVI FASHION<br />
                <span className="text-champagne-gold opacity-90 text-4xl">by RN, &apos;Your Faith&apos;</span>
              </h1>
              <p className="font-body-lg text-body-lg text-white/80 max-w-md drop-shadow-sm border-l-2 border-champagne-gold pl-6 py-2">
                Experience affordable opulence and handcrafted elegance.
              </p>
            </div>
          </section>

          {/* Right Side: Signup Form */}
          <section className="w-full md:w-[40%] min-h-screen flex flex-col items-center justify-center bg-[#fdf9f4] md:bg-soft-ivory relative px-6 py-12 md:p-8">
            <div className="w-full max-w-md mx-auto space-y-8">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-12 text-[#3B2B28] min-h-[40vh]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#B8924A]" />
                    <p className="mt-4 font-[family:var(--font-libre-caslon)] text-sm font-light">Loading portal...</p>
                  </div>
                }
              >
                <SignUpForm />
              </Suspense>
            </div>

            {/* Desktop Value Props absolute bar (Desktop Only) */}
            <div className="absolute bottom-8 left-0 right-0 hidden md:flex justify-center gap-8 px-8 select-none pointer-events-none opacity-80">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-label-sm text-label-sm uppercase">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">diamond</span>
                <span className="font-label-sm text-label-sm uppercase">Elegant Designs</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="font-label-sm text-label-sm uppercase">Secure Shopping</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
