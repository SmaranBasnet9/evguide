import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import FinancePageClient from "@/components/finance/FinancePageClient";

export default function FinancePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-brand/20 overflow-x-hidden">
      <PremiumNavbar />
      <Suspense>
        <FinancePageClient />
      </Suspense>
      <PremiumFooter />
    </main>
  );
}
