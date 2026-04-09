"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import FinanceDashboard from "@/components/finance/FinanceDashboard";
import { evModels } from "@/data/evModels";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import type { EVModel } from "@/types";

function FinanceContent() {
  const searchParams = useSearchParams();
  const [allModels, setAllModels] = useState<EVModel[]>(evModels);
  const initialCarId = searchParams.get("car") ?? "";

  useEffect(() => {
    let mounted = true;

    async function loadModels() {
      try {
        const res = await fetch("/api/evs", { cache: "no-store" });
        if (!res.ok) return;

        const payload = await res.json();
        if (!mounted || !Array.isArray(payload?.data)) return;

        const mapped = payload.data
          .filter((item: Partial<DbEV>) => item?.id && item?.brand && item?.model)
          .map((item: DbEV) => mapDbEV(item));

        if (mapped.length > 0) {
          const merged = [
            ...mapped,
            ...evModels.filter((staticModel) => !mapped.some((db: EVModel) => db.id === staticModel.id)),
          ];
          setAllModels(merged);
        }
      } catch {
        // Fallback to static
      }
    }

    loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <PremiumNavbar />
      <FinanceDashboard initialCarId={initialCarId} allModels={allModels} />
      <PremiumFooter />
    </main>
  );
}

export default function FinancePage() {
  return (
    <Suspense>
      <FinanceContent />
    </Suspense>
  );
}