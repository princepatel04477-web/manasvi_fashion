"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Menu, ShoppingBag, Sparkles, Apple, Loader2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Libre_Caslon_Text, Hanken_Grotesk } from "next/font/google";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") || "");
  const isRegistered = searchParams.get("registered") === "true";

  const ADMIN_EMAILS = [
    "princepatel01258@gmail.com",
    "varunyatechnologies@gmail.com"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Resolve target callback url
    const targetCallbackUrl = rawCallbackUrl 
      ? rawCallbackUrl 
      : (ADMIN_EMAILS.includes(email.toLowerCase()) ? "/dashboard" : "/");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: targetCallbackUrl,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(targetCallbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      {/* Brand Logo Container */}
      <div className="w-full flex justify-center mb-10 mt-4">
        <Link href="/">
          <img
            alt="Manasvi Fashion Brand Identity"
            className="w-48 h-auto object-contain cursor-pointer"
            src="https://lh3.googleusercontent.com/aida/AP1WRLvT4HkmwmY75T06vlWf1hS8zoA8Ili5wJ0YCXU-cNiQRWGSywDSL3TbhaIKBDSQJNkotE7WjbHhRRZmk7hNMbhT4heGLcRytt0oIuDDHguYEHfdHsCohVKW1nutjTPT2cI3WK6QfeMh6e1dpsNgoyJFd6-laAgWxrfMTw8f3Gm7khfwYqGqaJXdwily7KsO7UTakjP0p6T7SEJLcRHgcDCVTV1CWFYD4TtxyUulCWfO2DxhWijCNvMEtiM"
          />
        </Link>
      </div>

      {/* Greeting */}
      <div className="text-center mb-10 w-full">
        <h1 className="font-[family:var(--font-libre-caslon)] text-[28px] leading-[36px] text-[#251714] mb-2">Welcome Back</h1>
        <p className="font-[family:var(--font-hanken-grotesk)] text-[16px] leading-[24px] text-[#4f4443] italic">Enter your details to explore our curated collections.</p>
      </div>

      {/* Notifications */}
      {isRegistered && !error && (
        <div className="w-full mb-6 rounded-xl bg-[#fcf9f4] border border-[#8B6B61]/20 p-4 text-xs text-[#8B6B61] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87] animate-pulse"></span>
          <span>Account created successfully. Please authenticate below.</span>
        </div>
      )}

      {error && (
        <div className="w-full mb-6 rounded-xl bg-[#C98E87]/10 border border-[#C98E87]/30 p-4 text-xs text-[#8B6B61] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87]"></span>
          <span>
            {error === "CredentialsSignin"
              ? "Invalid credentials. Please verify your email and password."
              : error}
          </span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        {/* Email/Phone Field */}
        <div className="relative group">
          <label className="font-[family:var(--font-hanken-grotesk)] text-[12px] leading-[16px] tracking-[0.1em] font-medium uppercase text-[#4f4443] block mb-1" htmlFor="identity">Email Address</label>
          <input
            className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-[#3B2B28]/20 py-3 text-[18px] leading-[28px] font-normal placeholder-[#C98E87]/50 transition-all duration-300 focus:outline-none focus:border-b-[#B8924A] text-[#1c1c19]"
            id="identity"
            name="identity"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@email.com"
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <div className="flex justify-between items-end mb-1">
            <label className="font-[family:var(--font-hanken-grotesk)] text-[12px] leading-[16px] tracking-[0.1em] font-medium uppercase text-[#4f4443]" htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => alert("Password recovery is coming soon. Please contact administrator.")}
              className="font-[family:var(--font-hanken-grotesk)] text-[12px] leading-[16px] tracking-[0.1em] font-medium uppercase text-[#B8924A] hover:text-[#3B2B28] transition-colors duration-300"
            >
              Forgot?
            </button>
          </div>
          <input
            className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-[#3B2B28]/20 py-3 text-[18px] leading-[28px] font-normal placeholder-[#C98E87]/50 transition-all duration-300 focus:outline-none focus:border-b-[#B8924A] text-[#1c1c19] pr-10"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-3 text-[#4f4443] hover:text-[#1c1c19] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>

        {/* Primary Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3B2B28] text-[#FAF7F2] py-4 px-8 uppercase font-[family:var(--font-hanken-grotesk)] text-[12px] leading-[16px] tracking-[0.1em] font-medium transition-all duration-300 hover:bg-[#B8924A] active:scale-95 shadow-sm mt-4 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Divider with Sparkle Refinement */}
      <div className="w-full flex items-center justify-center my-12">
        <div className="flex-grow h-[0.5px] bg-[#3B2B28]/10"></div>
        <div className="px-4 text-[#4f4443]">
          <Sparkles className="w-4 h-4 text-[#C98E87]" />
        </div>
        <div className="flex-grow h-[0.5px] bg-[#3B2B28]/10"></div>
      </div>

      {/* Social Logins */}
      <div className="w-full grid grid-cols-2 gap-4 font-[family:var(--font-hanken-grotesk)] text-[12px] leading-[16px] tracking-[0.1em] font-medium">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: rawCallbackUrl || "/" })}
          className="flex items-center justify-center py-3 border border-[#3B2B28]/10 hover:bg-white transition-all duration-300 group cursor-pointer"
        >
          <img
            alt="Google"
            className="w-5 h-5 mr-3 opacity-80 group-hover:opacity-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLgxgYMhhMKCFPZBpLJdMp8xw31k34xp6canTtVMpbCWMYiNgggJc7aGJwvT2TxdZeo2vAJ36azthtCzx4zVMtcIkpNfJ5GTGzB4B-14BC79JDmmoAFXytjCc9Z-l1DsazO87uPwrnYzBKKdYaQ-1icy70jim2H9pxeCwf-mXpMH0HVxjqP6lewGNgLZlW8jiZgCbs7_99wvpQRrvkjxw0jLCz9G3kHvc3I8Aql6oqqMDK9vG29uEEM1BbwAfOkg00LD-Y3Cwz47g"
          />
          <span className="uppercase">Google</span>
        </button>
        <button
          type="button"
          onClick={() => alert("Apple Sign In is coming soon.")}
          className="flex items-center justify-center py-3 border border-[#3B2B28]/10 hover:bg-white transition-all duration-300 group cursor-pointer"
        >
          <Apple className="w-5 h-5 mr-3 text-[#0D0906]/80 group-hover:text-[#0D0906]" />
          <span className="uppercase">Apple</span>
        </button>
      </div>

      {/* Footnote / Sign Up */}
      <div className="mt-auto pt-16 text-center">
        <p className="font-[family:var(--font-hanken-grotesk)] text-[16px] leading-[24px] text-[#4f4443]">
          Don&apos;t have an account? 
          <Link href="/auth/signup" className="text-[#B8924A] font-bold ml-1 hover:underline underline-offset-4 decoration-[#C98E87] transition-all">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <PageTransition>
      <div className={`${libreCaslon.variable} ${hankenGrotesk.variable} min-h-screen bg-[#FAF7F2] font-[family:var(--font-hanken-grotesk)] text-[#1c1c19] selection:bg-[#C98E87]/30 relative`}>
        {/* Localized style block for custom animations and elements */}
        <style dangerouslySetInnerHTML={{ __html: `
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* TopAppBar Shell */}
        <header className="flex justify-between items-center px-[20px] md:px-[80px] h-16 w-full fixed top-0 z-50 bg-[#FAF7F2] border-b border-[#3B2B28]/10">
          <Link href="/" className="cursor-pointer active:opacity-70 transition-opacity flex items-center">
            <Menu className="w-5 h-5 text-[#251714]" />
          </Link>
          <Link href="/" className="font-[family:var(--font-libre-caslon)] text-[20px] tracking-widest uppercase text-[#251714]">
            Manasvi
          </Link>
          <Link href="/cart" className="cursor-pointer active:opacity-70 transition-opacity flex items-center">
            <ShoppingBag className="w-5 h-5 text-[#251714]" />
          </Link>
        </header>

        {/* Content viewport */}
        <main className="min-h-screen pt-24 pb-12 flex flex-col items-center px-[20px] md:px-[80px] max-w-[500px] mx-auto">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-12 text-[#251714] min-h-[50vh]">
                <Loader2 className="w-6 h-6 animate-spin text-[#B8924A]" />
                <p className="mt-4 font-[family:var(--font-libre-caslon)] text-sm font-light">Loading portal...</p>
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </main>

        {/* Bottom Ornamentation (Artisanal Detail) */}
        <footer className="w-full py-8 flex flex-col items-center opacity-40 select-none">
          <div className="h-[0.5px] w-12 bg-[#3B2B28] mb-4"></div>
          <p className="font-[family:var(--font-hanken-grotesk)] text-[10px] uppercase tracking-[0.3em] text-[#1c1c19]">Boutique Elegance • Artisanal Heritage</p>
        </footer>
      </div>
    </PageTransition>
  );
}
