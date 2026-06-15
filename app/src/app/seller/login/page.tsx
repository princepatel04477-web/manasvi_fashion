"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

const ALLOWED_SELLERS = [
  "varunyatechnologies@gmail.com",
  "manasvifashion1515@gmail.com"
];

function SellerLoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") || "");

  // If already logged in and authorised, redirect directly to dashboard
  useEffect(() => {
    if (session?.user?.email && ALLOWED_SELLERS.includes(session.user.email.toLowerCase())) {
      router.push("/seller/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.toLowerCase().trim();

    if (!ALLOWED_SELLERS.includes(normalizedEmail)) {
      setError("Unauthorized. Access restricted to registered boutique sellers only.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
        callbackUrl: "/seller/dashboard",
      });

      if (res?.error) {
        setError("Invalid email or password credentials.");
      } else {
        router.push("/seller/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-[#1E1715]/90 border border-[#C98E87]/20 rounded-3xl shadow-2xl backdrop-blur-md">
      <div className="text-center space-y-3 mb-8">
        <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-[#C98E87] block">
          Boutique Portal
        </span>
        <h1 className="font-serif text-3xl text-[#FAF7F2] font-light tracking-wide">
          Seller Atelier
        </h1>
        <div className="w-12 h-[1px] bg-[#C98E87] mx-auto" />
        <p className="text-xs text-[#8B6B61]/80 font-light">
          Authorized operations, order metrics & inventory management.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/30 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C98E87]">
            Seller Email
          </label>
          <div className="relative">
            <User className="absolute left-0 bottom-3.5 w-4 h-4 text-[#8B6B61]/70" />
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seller@manasvifashionsurat.com"
              className="w-full bg-transparent border-b border-[#E7C2B8]/20 py-3 pl-7 text-sm text-[#FAF7F2] outline-none transition-all duration-300 focus:border-[#C98E87] placeholder-[#8B6B61]/40 font-light"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C98E87]">
            Access Key / Password
          </label>
          <div className="relative">
            <Lock className="absolute left-0 bottom-3.5 w-4 h-4 text-[#8B6B61]/70" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-[#E7C2B8]/20 py-3 pl-7 pr-10 text-sm text-[#FAF7F2] outline-none transition-all duration-300 focus:border-[#C98E87] placeholder-[#8B6B61]/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-3 text-[#8B6B61]/70 hover:text-[#C98E87] transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-[#C98E87] to-[#8B6B61] text-[#FAF7F2] py-4 rounded-full text-[10px] font-semibold tracking-[0.25em] uppercase transition-all duration-500 hover:shadow-[0_8px_24px_-8px_rgba(201,142,135,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? "Verifying Credentials..." : "Enter Atelier"}
        </button>
      </form>
    </div>
  );
}

export default function SellerLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#140E0D] relative overflow-hidden soft-grain">
      {/* Background soft glow elements */}
      <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C98E87] opacity-[0.03] filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8B6B61] opacity-[0.03] filter blur-[150px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="text-[#FAF7F2] font-serif text-sm tracking-widest animate-pulse">
          LOADING PORTAL...
        </div>
      }>
        <SellerLoginForm />
      </Suspense>
    </main>
  );
}
