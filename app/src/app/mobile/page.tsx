import MobileFirstExperience from "@/components/mobile-first-experience";
import PageTransition from "@/components/PageTransition";

export default function MobilePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#F7F3EE]">
        <MobileFirstExperience />
      </main>
    </PageTransition>
  );
}
