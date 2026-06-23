"use client";

import PageTransition from "@/components/PageTransition";
import MobileFirstExperience from "@/components/mobile-first-experience";

export default function HomeClient() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#F7F3EE]">
        {/* Unified Responsive Experience */}
        <MobileFirstExperience />


      </main>
    </PageTransition>
  );
}
