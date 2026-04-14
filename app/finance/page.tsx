import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import FinancePageClient from "@/components/finance/FinancePageClient";

export default function FinancePage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A] font-sans selection:bg-[#D1F2EB] overflow-x-hidden">
      <PremiumNavbar />
      <Suspense>
        <FinancePageClient />
      </Suspense>
      <PremiumFooter />
    </main>
  );
}
