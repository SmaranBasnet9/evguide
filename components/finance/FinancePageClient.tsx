"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FinanceDashboard from "@/components/finance/FinanceDashboard";
import { evModels } from "@/data/evModels";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import type { EVModel } from "@/types";

export default function FinancePageClient() {
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

    void loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  return <FinanceDashboard initialCarId={initialCarId} allModels={allModels} />;
}
