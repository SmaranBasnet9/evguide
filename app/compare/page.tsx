import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import ComparePageClient from "@/components/compare/ComparePageClient";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans selection:bg-[#D1F2EB]">
      <PremiumNavbar />
      <Suspense>
        <ComparePageClient />
      </Suspense>
      <PremiumFooter />
    </main>
  );
}
