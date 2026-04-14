"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import PremiumCompareHero from "@/components/compare/PremiumCompareHero";
import PremiumCompareSummary from "@/components/compare/PremiumCompareSummary";
import PremiumCompareTable from "@/components/compare/PremiumCompareTable";
import PremiumCompareInsights from "@/components/compare/PremiumCompareInsights";
import PremiumCompareCTA from "@/components/compare/PremiumCompareCTA";
import EVComparisonTable from "@/components/compare/EVComparisonTable";
import { evModels } from "@/data/evModels";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { trackEvent } from "@/lib/tracking/client";
import type { EVModel } from "@/types";

export default function ComparePageClient() {
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
  const [selectedC, setSelectedC] = useState<string>(() => {
    const carC = searchParams.get("carC");
    return carC && evModels.some((m) => m.id === carC) ? carC : "";
  });
  const comparisonRef = useRef<HTMLDivElement>(null);
  const trackedComparisonRef = useRef<string | null>(null);

  const modelA = models.find((m) => m.id === selectedA) ?? null;
  const modelB = models.find((m) => m.id === selectedB) ?? null;
  const modelC = (selectedC && selectedC !== selectedA && selectedC !== selectedB)
    ? (models.find((m) => m.id === selectedC) ?? null)
    : null;
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

    void loadModels();
    return () => {
      mounted = false;
    };
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
    setSelectedC("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PremiumCompareHero
        models={models}
        selectedA={selectedA}
        selectedB={selectedB}
        onSelectA={setSelectedA}
        onSelectB={setSelectedB}
        onSwap={handleSwap}
      />

      <div className="bg-white border-b border-[#E5E7EB] py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#374151] shrink-0">
            + Compare 3rd vehicle (optional)
          </span>
          <div className="w-full sm:flex-1 relative">
            <select
              value={selectedC}
              onChange={(e) => setSelectedC(e.target.value)}
              className="appearance-none w-full bg-white border border-[#E5E7EB] text-[#1A1A1A] pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1F2EB] focus:border-[#1FBF9F] transition-all font-semibold text-sm hover:bg-[#F8FAF9] cursor-pointer"
            >
              <option value="">No third vehicle</option>
              {models.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  disabled={m.id === selectedA || m.id === selectedB}
                >
                  {m.brand} {m.model}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showComparison && modelA && modelB && (
        <div ref={comparisonRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <PremiumCompareSummary modelA={modelA} modelB={modelB} />
          <PremiumCompareTable modelA={modelA} modelB={modelB} />
          <PremiumCompareInsights modelA={modelA} modelB={modelB} />
          <EVComparisonTable vehicles={[modelA, modelB, ...(modelC ? [modelC] : [])]} />
          <PremiumCompareCTA modelA={modelA} modelB={modelB} onReset={handleReset} />
        </div>
      )}

      <div className={`${showComparison ? "opacity-30 pointer-events-none hidden" : "opacity-100"} transition-opacity duration-500`}>
        {!showComparison && (
          <div className="text-center py-20 px-6">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#E8F8F5]">
              <svg className="h-6 w-6 text-[#1FBF9F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-[#1A1A1A]">Select two vehicles</h3>
            <p className="mx-auto max-w-md text-[#4B5563]">
              Choose two EVs from the dropdowns above to see a side-by-side comparison of range, cost, and specs.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
