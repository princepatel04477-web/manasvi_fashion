"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf7f2] px-6 text-center text-[#2a1d19]">
      <div className="max-w-md rounded-2xl border border-[#d9a58f44] bg-white p-10 shadow-sm">
        <span className="font-serif text-sm uppercase tracking-[0.2em] text-[#8b6b61]">Boutique Operations</span>
        <h1 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Clearance Required</h1>
        
        <p className="mt-6 text-sm leading-relaxed text-[#5c4a44]">
          This studio is reserved exclusively for verified partners and administrators of Manasvi Fashion. Your account does not have access.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="luxury-btn block rounded-lg py-3 text-center text-sm font-medium"
          >
            Return to Storefront
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="rounded-lg border border-[#8b6b61] py-3 text-sm font-medium text-[#8b6b61] transition hover:bg-[#faf7f2]"
          >
            Sign In with Another Account
          </button>
        </div>
      </div>
    </main>
  );
}
