import { Building2, Gauge, MapPin, PoundSterling, Trophy } from "lucide-react";
import type { EVModel } from "@/types";
import { applyEvEnrichment } from "@/data/evEnrichment";

interface Props {
  modelA: EVModel;
  modelB: EVModel;
}

function computeOverallScore(v: EVModel): number {
  let score = 0;
  score += Math.max(0, 40 - Math.round(v.price / 2000));
  score += Math.min(25, Math.round(v.rangeKm / 20));
  if (v.batteryKWh > 0 && v.rangeKm > 0) {
    score += Math.min(15, Math.round((v.rangeKm / v.batteryKWh) * 2));
  }
  const accel = parseFloat(String(v.acceleration).match(/([0-9.]+)/)?.[1] ?? "10");
  score += Math.max(0, 20 - Math.round(accel * 2));
  return Math.max(10, Math.min(99, score));
}

function parseAccel(s: string): number {
  return parseFloat(String(s).match(/([0-9.]+)/)?.[1] ?? "99") || 99;
}

export default function PremiumCompareInsights({ modelA, modelB }: Props) {
  const eA = applyEvEnrichment(modelA);
  const eB = applyEvEnrichment(modelB);
  const scoreA = computeOverallScore(modelA);
  const scoreB = computeOverallScore(modelB);
  const winner = scoreA >= scoreB ? modelA : modelB;
  const loser = scoreA >= scoreB ? modelB : modelA;
  const scoreDiff = Math.abs(scoreA - scoreB);
  const winnerScore = Math.max(scoreA, scoreB);

  const overallReason =
    scoreDiff <= 3
      ? "Very closely matched — either is a strong choice depending on your priorities."
      : winner.price < loser.price
      ? `£${(loser.price - winner.price).toLocaleString()} cheaper with comparable range and daily usability.`
      : winner.rangeKm > loser.rangeKm
      ? "Stronger real-world range gives more day-to-day confidence without range anxiety."
      : "Wins on overall balance of cost, range, and performance.";

  const budgetWinner = modelA.price < modelB.price ? modelA : modelB.price < modelA.price ? modelB : null;
  const rangeWinner =
    (eA.realWorldRangeMiles ?? 0) > (eB.realWorldRangeMiles ?? 0) ? modelA
    : (eB.realWorldRangeMiles ?? 0) > (eA.realWorldRangeMiles ?? 0) ? modelB
    : null;
  const cityScoreA = (1 / modelA.batteryKWh) * 10000 + (1 / modelA.price) * 100000;
  const cityScoreB = (1 / modelB.batteryKWh) * 10000 + (1 / modelB.price) * 100000;
  const cityWinner = cityScoreA !== cityScoreB ? (cityScoreA > cityScoreB ? modelA : modelB) : null;
  const aA = parseAccel(modelA.acceleration);
  const aB = parseAccel(modelB.acceleration);
  const perfWinner = aA !== aB ? (aA < aB ? modelA : modelB) : null;

  const categories = [
    {
      icon: PoundSterling,
      label: "Best for Budget",
      color: "text-emerald-400",
      accentBg: "bg-emerald-400/10",
      accentBorder: "border-emerald-400/20",
      winner: budgetWinner,
      reason: budgetWinner
        ? `£${Math.abs(modelA.price - modelB.price).toLocaleString()} cheaper — lower monthly payments too.`
        : "Both are priced the same.",
    },
    {
      icon: MapPin,
      label: "Best for Range",
      color: "text-cyan-400",
      accentBg: "bg-cyan-400/10",
      accentBorder: "border-cyan-400/20",
      winner: rangeWinner,
      reason: rangeWinner
        ? `~${Math.abs(Math.round((eA.realWorldRangeMiles ?? modelA.rangeKm * 0.51) - (eB.realWorldRangeMiles ?? modelB.rangeKm * 0.51)))} more real-world miles per charge.`
        : "Essentially the same real-world range.",
    },
    {
      icon: Building2,
      label: "Best for City",
      color: "text-violet-400",
      accentBg: "bg-violet-400/10",
      accentBorder: "border-violet-400/20",
      winner: cityWinner,
      reason: cityWinner
        ? "More efficient in stop-start traffic — lower running cost per urban mile."
        : "Both equally suited to city driving.",
    },
    {
      icon: Gauge,
      label: "Best for Performance",
      color: "text-rose-400",
      accentBg: "bg-rose-400/10",
      accentBorder: "border-rose-400/20",
      winner: perfWinner,
      reason: perfWinner
        ? `Quicker to 100 km/h by ${Math.abs(aA - aB).toFixed(1)}s.`
        : "Both accelerate identically.",
    },
  ];

  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Verdict</p>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">Who wins?</h2>

        {/* Overall winner banner */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand/25 bg-brand/[0.06]">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand/30 bg-brand/15">
              <Trophy className="h-6 w-6 text-brand" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/70">Overall Winner</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {winner.brand} {winner.model}
              </p>
              <p className="mt-1 text-sm text-gray-500">{overallReason}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-gray-400">Score</p>
              <p className="text-4xl font-bold text-brand">
                {winnerScore}
                <span className="text-base font-medium text-gray-300">/99</span>
              </p>
            </div>
          </div>
        </div>

        {/* Category cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${cat.accentBorder} ${cat.accentBg}`}>
                    <Icon className={`h-4 w-4 ${cat.color}`} />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{cat.label}</p>
                </div>
                {cat.winner ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      {cat.winner.brand} {cat.winner.model}
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-gray-400">{cat.reason}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-400">Tied</p>
                    <p className="mt-1.5 text-xs leading-5 text-gray-400">{cat.reason}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
