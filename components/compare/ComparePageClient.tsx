"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import PremiumCompareHero from "@/components/compare/PremiumCompareHero";
import PremiumCompareSummary from "@/components/compare/PremiumCompareSummary";
import PremiumCompareInsights from "@/components/compare/PremiumCompareInsights";
import PremiumCompareCTA from "@/components/compare/PremiumCompareCTA";
import PremiumCompareTable from "@/components/compare/PremiumCompareTable";
import { evModels } from "@/data/evModels";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { trackEvent } from "@/lib/tracking/client";
import type { EVModel } from "@/types";

const CompareDual3DScene = dynamic(
  () => import("@/components/compare/CompareDual3DScene"),
  { ssr: false },
);

// ── Brand → visual accent colour ─────────────────────────────────────────────

const BRAND_COLOR: Record<string, string> = {
  tesla:       "#E82127",
  bmw:         "#1C69D4",
  hyundai:     "#00AAD2",
  kia:         "#BB162B",
  mg:          "#C8102E",
  byd:         "#1565C0",
  volvo:       "#1B3A5C",
  polestar:    "#00B8A9",
  audi:        "#BB0A14",
  volkswagen:  "#001E50",
  vw:          "#001E50",
  renault:     "#F1CB00",
  nissan:      "#C3002F",
  rivian:      "#2B6CB0",
  lucid:       "#8B5CF6",
  mercedes:    "#00A0AF",
  mini:        "#1C69D4",
  ford:        "#003499",
  skoda:       "#4BA82E",
  cupra:       "#FF5A00",
  seat:        "#FF0030",
  leapmotor:   "#FF6600",
  xpeng:       "#0073FF",
  ora:         "#FF3CAC",
  smart:       "#00B2A9",
  vauxhall:    "#C8102E",
  fiat:        "#E4003A",
};

function brandColor(brand: string): string {
  return BRAND_COLOR[brand.toLowerCase()] ?? "#1FBF9F";
}

// ── Score helper ──────────────────────────────────────────────────────────────

function overallScore(v: EVModel): number {
  let s = 0;
  s += Math.max(0, 40 - Math.round(v.price / 2000));
  s += Math.min(25, Math.round(v.rangeKm / 20));
  if (v.batteryKWh > 0 && v.rangeKm > 0)
    s += Math.min(15, Math.round((v.rangeKm / v.batteryKWh) * 2));
  const a = parseFloat(String(v.acceleration).match(/([0-9.]+)/)?.[1] ?? "10") || 10;
  s += Math.max(0, 20 - Math.round(a * 2));
  return Math.max(10, Math.min(99, s));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ComparePageClient() {
  const searchParams = useSearchParams();
  const [models, setModels] = useState<EVModel[]>(evModels);
  const autoOpenQuote = searchParams.get("openQuote") === "true";
  const [selectedA, setSelectedA] = useState<string>(
    () => searchParams.get("carA") ?? searchParams.get("vehicles")?.split(",")[0] ?? "",
  );
  const [selectedB, setSelectedB] = useState<string>(() => {
    const vehicles = searchParams.get("vehicles")?.split(",") ?? [];
    return searchParams.get("carB") ?? vehicles[1] ?? "";
  });
  const comparisonRef = useRef<HTMLDivElement>(null);
  const trackedComparisonRef = useRef<string | null>(null);

  const modelA = models.find((m) => m.id === selectedA) ?? null;
  const modelB = models.find((m) => m.id === selectedB) ?? null;
  const showComparison = Boolean(modelA && modelB && selectedA !== selectedB);

  // Derive 3D accent colours from selected brands (fallback to teal/cyan)
  const colorA = modelA ? brandColor(modelA.brand) : "#1FBF9F";
  const colorB = modelB ? brandColor(modelB.brand) : "#22D3EE";

  // Load live DB models
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
            ...evModels.filter((s) => !mapped.some((db: EVModel) => db.id === s.id)),
          ];
          setModels(merged);
        }
      } catch {
        // fallback to static
      }
    }
    void loadModels();
    return () => { mounted = false; };
  }, []);

  // Track compare event (once per unique pair)
  useEffect(() => {
    if (!showComparison) { trackedComparisonRef.current = null; return; }
    const key = `${selectedA}:${selectedB}`;
    if (trackedComparisonRef.current === key) return;
    trackedComparisonRef.current = key;
    void trackEvent({ eventType: "compare_clicked", eventValue: { carA: selectedA, carB: selectedB } });
  }, [selectedA, selectedB, showComparison]);

  const handleSwap = () => { setSelectedA(selectedB); setSelectedB(selectedA); };
  const handleReset = () => {
    setSelectedA(""); setSelectedB("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const winner: EVModel | null =
    modelA && modelB
      ? overallScore(modelA) >= overallScore(modelB) ? modelA : modelB
      : null;

  return (
    <>
      {/* ── Vehicle selector hero — 3D cars always visible in bg ── */}
      <div className="relative">
        <CompareDual3DScene
          colorA={colorA}
          colorB={colorB}
          opacity={0.35}
          cameraZ={10}
          cameraY={1.2}
          separationX={3.8}
        />
        <PremiumCompareHero
          models={models}
          selectedA={selectedA}
          selectedB={selectedB}
          onSelectA={setSelectedA}
          onSelectB={setSelectedB}
          onSwap={handleSwap}
        />
      </div>

      {/* ── Comparison result ── */}
      {showComparison && modelA && modelB && winner && (
        <div ref={comparisonRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Summary — 3D cars behind, zoomed in, same brand colours */}
          <div className="relative overflow-hidden">
            <CompareDual3DScene
              colorA={colorA}
              colorB={colorB}
              opacity={0.22}
              cameraZ={7}
              cameraY={0.8}
              separationX={3.0}
            />
            <PremiumCompareSummary modelA={modelA} modelB={modelB} />
          </div>

          {/* Detailed comparison table */}
          <PremiumCompareTable modelA={modelA} modelB={modelB} />

          {/* Winner insights */}
          <PremiumCompareInsights modelA={modelA} modelB={modelB} />

          {/* CTA */}
          <PremiumCompareCTA
            modelA={modelA}
            modelB={modelB}
            winner={winner}
            onReset={handleReset}
            autoOpenQuote={autoOpenQuote}
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {!showComparison && (
        <div className="py-24 px-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10">
            <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white">Select two vehicles above</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
            Choose any two EVs from the dropdowns to see a full side-by-side breakdown of range, cost, charging, and specs.
          </p>
        </div>
      )}
    </>
  );
}
