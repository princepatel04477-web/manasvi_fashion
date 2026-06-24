"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying credentials...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const rawCallbackUrl = searchParams.get("callbackUrl") || searchParams.get("state") || "/";

      // Resolve a safe redirect target url
      let callbackUrl = "/";
      if (rawCallbackUrl) {
        try {
          const decoded = decodeURIComponent(rawCallbackUrl);
          // Only redirect to relative paths or current origin to avoid open redirect vulnerabilities
          if (decoded.startsWith("/") || decoded.startsWith(window.location.origin)) {
            callbackUrl = decoded;
          }
        } catch (e) {
          console.warn("[auth/callback] Failed to parse callbackUrl:", e);
        }
      }

      if (error) {
        console.error("[auth/callback] OAuth error from Supabase:", error, errorDescription);
        router.replace(`/auth/signin?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (!code) {
        console.error("[auth/callback] No code parameter found in the URL.");
        router.replace("/auth/signin?error=Missing authentication code");
        return;
      }

      if (!supabase) {
        console.error("[auth/callback] Supabase client is not initialized.");
        router.replace("/auth/signin?error=Database client offline");
        return;
      }

      try {
        setStatus("Exchanging authentication token...");
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("[auth/callback] Failed to exchange code for session:", exchangeError.message);
          router.replace(`/auth/signin?error=${encodeURIComponent(exchangeError.message)}`);
          return;
        }

        const session = data.session;
        if (!session || !session.user) {
          console.error("[auth/callback] No session received after code exchange.");
          router.replace("/auth/signin?error=Unable to establish session");
          return;
        }

        setStatus("Syncing portal session...");
        const email = session.user.email;
        const name = session.user.user_metadata.full_name || session.user.user_metadata.name || email?.split("@")[0];
        const image = session.user.user_metadata.avatar_url || session.user.user_metadata.picture || "";
        const id = session.user.id;

        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          name,
          image,
          id,
          authType: "oauth",
          callbackUrl,
        });

        if (signInResult?.error) {
          console.error("[auth/callback] NextAuth sign in failed:", signInResult.error);
          router.replace(`/auth/signin?error=${encodeURIComponent(signInResult.error)}`);
          return;
        }

        setStatus("Welcome back! Redirecting...");
        router.replace(callbackUrl);
        router.refresh();
      } catch (err: any) {
        console.error("[auth/callback] Unexpected callback error:", err);
        router.replace(`/auth/signin?error=${encodeURIComponent(err.message || "An unexpected error occurred")}`);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-[#3B2B28] min-h-[60vh] bg-[#fdf9f4]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;600;700&family=EB+Garamond:wght@400;500&display=swap');
        .font-display { font-family: 'EB Garamond', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}} />
      <Loader2 className="w-10 h-10 animate-spin text-[#B8924A] mb-6" />
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-wide mb-2">Establishing Secure Connection</h2>
      <p className="font-body text-sm text-[#4f4443] opacity-80">{status}</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12 text-[#3B2B28] min-h-[60vh] bg-[#fdf9f4]">
          <Loader2 className="w-10 h-10 animate-spin text-[#B8924A] mb-4" />
          <p className="text-sm font-light">Loading callback portal...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
