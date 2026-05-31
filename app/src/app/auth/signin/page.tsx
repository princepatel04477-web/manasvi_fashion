"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const CAMPAIGN_IMAGES = [
  "/manasvi-hero.png",
  "/photos/Gemini_Generated_Image_7p370v7p370v7p37.png",
  "/photos/Gemini_Generated_Image_h8k8lch8k8lch8k8.png",
  "/photos/Gemini_Generated_Image_o7map6o7map6o7ma.png",
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
          {/* We only render the images when active or adjacent to avoid resource overhead, 
              but since they are background campaign pieces, simple fade is perfect */}
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
            &ldquo;Welcoming you into an intimate boutique environment, curated for timeless feminine grace.&rdquo;
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

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  
  // Auth Modes: "password" or "otp"
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  
  // Standard Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // MFA 2FA State
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaSentTo, setMfaSentTo] = useState("");
  const [simulatedPasscode, setSimulatedPasscode] = useState("");

  // OTP Form State
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error") || "");
  const isRegistered = searchParams.get("registered") === "true";

  const ADMIN_EMAILS = [
    "princepatel01258@gmail.com",
    "prince@example.com",
    "aryan@example.com"
  ];

  // Auto-login from query parameter (Magic Link click flow)
  useEffect(() => {
    const urlOtp = searchParams.get("otp");
    const urlEmail = searchParams.get("email");
    const urlPhone = searchParams.get("phone");
    const urlAutoSubmit = searchParams.get("autoSubmit") === "true";

    if (urlOtp && (urlEmail || urlPhone) && urlAutoSubmit) {
      const input = urlEmail || urlPhone || "";
      setEmailOrPhone(input);
      setOtp(urlOtp);
      setAuthMode("otp");
      setOtpSent(true);

      const triggerAutoLogin = async () => {
        setLoading(true);
        setError("");
        setOtpSuccessMessage("Verifying secure direct link...");
        
        const targetCallbackUrl = rawCallbackUrl 
          ? rawCallbackUrl 
          : (ADMIN_EMAILS.includes(input.toLowerCase()) ? "/dashboard" : "/");

        try {
          const res = await signIn("credentials", {
            redirect: false,
            emailOrPhone: input,
            otp: urlOtp,
            authType: "otp",
            callbackUrl: targetCallbackUrl,
          });

          if (res?.error) {
            setError(res.error);
          } else {
            router.push(targetCallbackUrl);
            router.refresh();
          }
        } catch (err) {
          setError("Failed during automatic magic link verification.");
        } finally {
          setLoading(false);
        }
      };

      triggerAutoLogin();
    }
  }, [searchParams]);

  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }
    
    setOtpSending(true);
    setError("");
    setOtpSuccessMessage("");
    setSimulatedPasscode("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim() }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOtpSent(true);
        setOtpSuccessMessage(data.message || "Verification code sent!");
        if (data.passcode) {
          setSimulatedPasscode(data.passcode);
        }
      } else {
        setError(data.error || "Failed to send verification code. Please try again.");
      }
    } catch (err) {
      setError("Network error. Failed to reach authentication server.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const resolvedInput = authMode === "password" ? email : emailOrPhone;
    const targetCallbackUrl = rawCallbackUrl 
      ? rawCallbackUrl 
      : (ADMIN_EMAILS.includes(resolvedInput.toLowerCase()) ? "/dashboard" : "/");

    try {
      if (authMode === "password") {
        if (!mfaStep) {
          // Verify credentials first, send OTP, trigger MFA step
          const verifyResponse = await fetch("/api/auth/verify-credentials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          });

          const data = await verifyResponse.json();
          if (verifyResponse.ok && data.success) {
            setMfaStep(true);
            setMfaSentTo(data.sentTo);
            setOtpSuccessMessage(`Verification passcode sent to ${data.sentTo}`);
            if (data.passcode) {
              setSimulatedPasscode(data.passcode);
            }
          } else {
            setError(data.error || "Invalid email or password.");
          }
          setLoading(false);
          return;
        } else {
          // Perform full NextAuth sign-in with password + MFA OTP
          const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            otp,
            authType: "mfa",
            callbackUrl: targetCallbackUrl,
          });

          if (res?.error) {
            setError(res.error);
          } else {
            router.push(targetCallbackUrl);
            router.refresh();
          }
        }
      } else {
        // Passwordless OTP Login
        const res = await signIn("credentials", {
          redirect: false,
          emailOrPhone,
          otp,
          authType: "otp",
          callbackUrl: targetCallbackUrl,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          router.push(targetCallbackUrl);
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 sm:px-8 py-12 md:py-0 flex flex-col justify-center md:min-h-screen">
      <div className="space-y-8">
        {/* Title Block */}
        <div className="space-y-3">
          <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-[#8B6B61] block">
            Boutique Invitation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#3B2B28] font-light tracking-wide">
            Welcome Back
          </h1>
          <p className="text-xs text-[#8B6B61]/80 leading-relaxed font-light">
            Sign in to continue your curated Manasvi Fashion boutique experience.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex gap-2 p-1 bg-white border border-[#E7C2B8]/40 rounded-full max-w-[320px] shadow-sm">
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setError("");
              setOtpSuccessMessage("");
              setSimulatedPasscode("");
              setMfaStep(false);
            }}
            className={`flex-1 py-2 text-[10px] font-semibold tracking-wider uppercase rounded-full transition-all duration-300 ${
              authMode === "password"
                ? "bg-[#3B2B28] text-[#FAF7F2] shadow-sm"
                : "text-[#8B6B61] hover:text-[#3B2B28]"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("otp");
              setError("");
              setOtpSuccessMessage("");
              setSimulatedPasscode("");
            }}
            className={`flex-1 py-2 text-[10px] font-semibold tracking-wider uppercase rounded-full transition-all duration-300 ${
              authMode === "otp"
                ? "bg-[#3B2B28] text-[#FAF7F2] shadow-sm"
                : "text-[#8B6B61] hover:text-[#3B2B28]"
            }`}
          >
            Passcode / SMS / Link
          </button>
        </div>

        {/* Notifications */}
        {isRegistered && !error && !otpSuccessMessage && (
          <div className="rounded-xl bg-[#FAF7F2] border border-[#8B6B61]/20 p-4 text-xs text-[#8B6B61] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87] animate-pulse"></span>
            <span>Account created successfully. Please authenticate below.</span>
          </div>
        )}

        {otpSuccessMessage && !error && (
          <div className="rounded-xl bg-[#FAF7F2] border border-emerald-500/20 p-4 text-xs text-[#8B6B61] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{otpSuccessMessage}</span>
            </div>
            {simulatedPasscode && (
              <div className="bg-[#FAF7F2] border border-dashed border-[#E7C2B8] p-3 rounded-lg flex flex-col items-center justify-center gap-1.5 animate-fadeIn">
                <span className="text-[9px] uppercase tracking-widest text-[#8B6B61] font-semibold">Simulated Verification Passcode (Demo Mode)</span>
                <span className="font-mono text-xl font-bold tracking-[0.2em] text-[#3B2B28]">{simulatedPasscode}</span>
                <span className="text-[9px] text-[#8B6B61]/80 text-center font-light mt-0.5">Please copy this code and input it below to sign in.</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-[#C98E87]/10 border border-[#C98E87]/30 p-4 text-xs text-[#8B6B61] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C98E87]"></span>
            <span>
              {error === "CredentialsSignin"
                ? "Invalid credentials. Please verify your details."
                : error}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {authMode === "password" ? (
            <>
              {!mfaStep ? (
                <>
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
                      placeholder="e.g. princepatel01258@gmail.com"
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
                        placeholder="••••••••"
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
                </>
              ) : (
                <>
                  <div className="space-y-2 p-4 bg-[#FAF7F2] border border-[#E7C2B8]/30 rounded-xl mb-4 text-xs text-[#8B6B61] leading-relaxed">
                    <span className="font-semibold block text-[#3B2B28]">2-Factor Authentication Required</span>
                    <p className="font-light">Credentials verified. Enter the 6-digit passcode sent to {mfaSentTo} to complete sign in.</p>
                  </div>

                  <div className="space-y-1 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                        6-Digit MFA Passcode
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          setError("");
                          setOtpSuccessMessage("");
                          try {
                            const verifyResponse = await fetch("/api/auth/verify-credentials", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: email.trim(), password }),
                            });
                            const data = await verifyResponse.json();
                            if (verifyResponse.ok && data.success) {
                              setOtpSuccessMessage(`New code sent to ${data.sentTo}`);
                            } else {
                              setError(data.error || "Failed to resend code.");
                            }
                          } catch (err) {
                            setError("Network error. Failed to resend passcode.");
                          }
                        }}
                        className="text-[9px] font-semibold uppercase tracking-wider text-[#C98E87] hover:text-[#8B6B61] transition-colors"
                      >
                        Resend Code
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                      required
                      placeholder="e.g. 123456"
                      className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none tracking-[0.3em] font-mono transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMfaStep(false);
                      setOtp("");
                      setError("");
                      setOtpSuccessMessage("");
                      setSimulatedPasscode("");
                    }}
                    className="text-[10px] uppercase tracking-wider font-semibold text-[#8B6B61] hover:text-[#3B2B28] transition duration-300 block text-left"
                  >
                    ← Back to Credentials
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                  Email Address or Phone Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                    disabled={otpSent}
                    placeholder="e.g. customer@gmail.com or +919988776655"
                    className="flex-1 bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35 font-light disabled:opacity-50"
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending || !emailOrPhone}
                      className="px-4 py-2 border border-[#3B2B28] text-[#3B2B28] text-[9px] uppercase tracking-wider font-semibold rounded-lg hover:bg-[#3B2B28] hover:text-[#FAF7F2] transition-colors disabled:opacity-50 self-end"
                    >
                      {otpSending ? "Sending..." : "Send Code"}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8B6B61]">
                      6-Digit Passcode
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      className="text-[9px] font-semibold uppercase tracking-wider text-[#C98E87] hover:text-[#8B6B61] transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    required
                    placeholder="e.g. 123456"
                    className="w-full bg-transparent border-b border-[#E7C2B8]/40 py-3 text-base md:text-sm text-[#3B2B28] outline-none tracking-[0.3em] font-mono transition-all duration-300 focus:border-[#8B6B61] focus:shadow-[0_4px_12px_-4px_rgba(231,194,184,0.15)] placeholder-[#8B6B61]/35"
                  />
                </div>
              )}
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between text-xs text-[#8B6B61]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-[#E7C2B8]/60 bg-transparent text-[#8B6B61] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="font-light">Remember me</span>
            </label>
            <button
              type="button"
              className="hover:text-[#3B2B28] font-light tracking-wide transition duration-300"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In CTA */}
          <button
            type="submit"
            disabled={loading || (authMode === "otp" && !otpSent) || (authMode === "password" && mfaStep && !otp)}
            className="w-full bg-gradient-to-r from-[#C98E87] via-[#8B6B61] to-[#3B2B28] text-[#FAF7F2] py-4 rounded-full text-[10px] font-semibold tracking-[0.25em] uppercase transition-all duration-500 hover:shadow-[0_8px_24px_-8px_rgba(139,107,97,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? "Authenticating Session..." : (authMode === "password" && !mfaStep ? "Sign In" : "Verify & Sign In")}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E7C2B8]/20" />
          </div>
          <span className="relative px-4 bg-[#FAF7F2] text-[9px] font-medium uppercase tracking-[0.2em] text-[#8B6B61]/70">
            or connect with
          </span>
        </div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: rawCallbackUrl || "/" })}
          className="w-full border border-[#E7C2B8]/60 bg-transparent text-[#3B2B28] py-3.5 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-white hover:border-[#8B6B61] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#8B6B61]" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google Account</span>
        </button>

        {/* Seeded Sandbox Accordion */}
        <div className="pt-4 border-t border-[#E7C2B8]/20">
          <details className="group cursor-pointer">
            <summary className="list-none flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B6B61]/80 hover:text-[#8B6B61] transition duration-300">
              <span>Seeded Sandbox Credentials</span>
              <svg
                className="w-3.5 h-3.5 transform group-open:rotate-180 transition-transform duration-300 text-[#8B6B61]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 bg-white/40 border border-[#E7C2B8]/30 rounded-xl p-4 text-xs text-[#8B6B61] space-y-3 leading-relaxed">
              <p className="font-light">Use these seeded credentials to access the boutique operations dashboard:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 p-3 rounded-lg border border-[#E7C2B8]/20 font-mono text-[11px]">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-[#8B6B61]/60 mb-0.5">Email</span>
                  <span className="font-semibold text-[#3B2B28] select-all">princepatel01258@gmail.com</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-[#8B6B61]/60 mb-0.5">Password</span>
                  <span className="font-semibold text-[#3B2B28] select-all">Prince_1258</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Link to Sign Up */}
        <div className="text-center text-xs text-[#8B6B61]/85 pt-2">
          New to the boutique?{" "}
          <Link href="/auth/signup" className="font-semibold text-[#8B6B61] hover:text-[#3B2B28] underline underline-offset-4 transition">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2] relative">
        {/* Left side: Cinematic lookbook film loop viewport */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-screen sticky top-0 z-0">
          <CinematicSlideshow />
        </div>

        {/* Right side: Editorial form viewport */}
        <div className="w-full md:w-1/2 min-h-[55vh] md:min-h-screen flex items-center justify-center bg-[#FAF7F2] z-10 shadow-[-20px_0_40px_rgba(59,43,40,0.03)] border-t md:border-t-0 md:border-l border-[#E7C2B8]/20 relative">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-12 text-[#2a1d19]">
                <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#8B6B61] animate-pulse">
                  Manasvi Fashion
                </span>
                <p className="mt-4 font-serif text-sm text-[#8B6B61] font-light">Loading portal...</p>
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </main>
    </PageTransition>
  );
}
