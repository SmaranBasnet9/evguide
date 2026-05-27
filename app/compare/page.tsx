import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import ComparePageClient from "@/components/compare/ComparePageClient";

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand/20">
      <PremiumNavbar />
      <Suspense>
        <ComparePageClient />
      </Suspense>
      <PremiumFooter />
    </main>
  );
}
