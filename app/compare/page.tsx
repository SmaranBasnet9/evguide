"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import PremiumCompareHero from "@/components/compare/PremiumCompareHero";
import PremiumCompareSummary from "@/components/compare/PremiumCompareSummary";
import PremiumCompareTable from "@/components/compare/PremiumCompareTable";
import PremiumCompareInsights from "@/components/compare/PremiumCompareInsights";
import PremiumCompareCTA from "@/components/compare/PremiumCompareCTA";
import { evModels } from "@/data/evModels";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { trackEvent } from "@/lib/tracking/client";
import type { EVModel } from "@/types";

export default function ComparePage() {
  return (
    <Suspense>
      <ComparePageInner />
    </Suspense>
  );
}

function ComparePageInner() {
  const searchParams = useSearchParams();
  const [models, setModels] = useState<EVModel[]>(evModels);
  const [selectedA, setSelectedA] = useState<string>(() => {
    const carA = searchParams.get("carA");
    return carA && evModels.some((m) => m.id === carA) ? carA : "";
  });
  const [selectedB, setSelectedB] = useState<string>(() => {
    const carB = searchParams.get("carB");
    return carB && evModels.some((m) => m.id === carB) ? carB : "";
  });
  const comparisonRef = useRef<HTMLDivElement>(null);
  const trackedComparisonRef = useRef<string | null>(null);

  const modelA = models.find((m) => m.id === selectedA) ?? null;
  const modelB = models.find((m) => m.id === selectedB) ?? null;
  const showComparison = Boolean(modelA && modelB && selectedA !== selectedB);

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
          setModels(mapped);
        }
      } catch {
        // Fallback to static
      }
    }

    loadModels();
    return () => { mounted = false; };
  }, []);

  const handleSwap = () => {
    setSelectedA(selectedB);
    setSelectedB(selectedA);
  };

  useEffect(() => {
    if (showComparison) {
      const comparisonKey = `${selectedA}:${selectedB}`;

      if (trackedComparisonRef.current === comparisonKey) {
        return;
      }

      trackedComparisonRef.current = comparisonKey;
      void trackEvent({
        eventType: "compare_clicked",
        eventValue: { carA: selectedA, carB: selectedB },
      });
    } else {
      trackedComparisonRef.current = null;
    }
  }, [selectedA, selectedB, showComparison]);

  const handleReset = () => {
    setSelectedA("");
    setSelectedB("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <PremiumNavbar />
      
      <PremiumCompareHero
        models={models}
        selectedA={selectedA}
        selectedB={selectedB}
        onSelectA={setSelectedA}
        onSelectB={setSelectedB}
        onSwap={handleSwap}
      />
      
      {showComparison && modelA && modelB && (
        <div ref={comparisonRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <PremiumCompareSummary modelA={modelA} modelB={modelB} />
          <PremiumCompareTable modelA={modelA} modelB={modelB} />
          <PremiumCompareInsights modelA={modelA} modelB={modelB} />
          <PremiumCompareCTA modelA={modelA} modelB={modelB} onReset={handleReset} />
        </div>
      )}
      
      {/* We keep AllModelsComparison at the very bottom as a fallback grid */}
      <div className={`${showComparison ? "opacity-30 pointer-events-none hidden" : "opacity-100"} transition-opacity duration-500`}>
        {!showComparison && (
          <div className="text-center py-20 px-6">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-zinc-900">
              <svg className="h-6 w-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">Awaiting Selection</h3>
            <p className="mx-auto max-w-md text-zinc-500">
              Select two vehicles from the dropdown above to engage the comparison engine and view decision insights.
            </p>
          </div>
        )}
      </div>

      <PremiumFooter />
    </main>
  );
}
