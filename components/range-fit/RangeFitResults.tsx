"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Gauge, Thermometer, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
import type { EVRangeFitResult, UserRoute, Season, RouteAnalysis } from "@/lib/range-fit/types";

// ── Grade badge ───────────────────────────────────────────────────────────────

const GRADE_STYLES: Record<EVRangeFitResult["grade"], { ring: string; bg: string; text: string; bar: string; border: string }> = {
  A: { ring: "ring-emerald-300", bg: "bg-emerald-50",  text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200" },
  B: { ring: "ring-brand/40",   bg: "bg-brand/5",     text: "text-brand",       bar: "bg-brand",       border: "border-brand/20"  },
  C: { ring: "ring-amber-300",  bg: "bg-amber-50",    text: "text-amber-700",   bar: "bg-amber-500",   border: "border-amber-200" },
  D: { ring: "ring-orange-300", bg: "bg-orange-50",   text: "text-orange-700",  bar: "bg-orange-500",  border: "border-orange-200"},
  F: { ring: "ring-red-300",    bg: "bg-red-50",      text: "text-red-700",     bar: "bg-red-500",     border: "border-red-200"   },
};

// ── Route verdict icon ────────────────────────────────────────────────────────

function VerdictIcon({ analysis }: { analysis: RouteAnalysis }) {
  if (analysis.chargingStops === 0) {
    if (analysis.verdict === "easy" || analysis.verdict === "comfortable") {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
    }
    return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
  }
  if (analysis.chargingStops === 1) {
    return <Zap className="h-4 w-4 text-amber-500 shrink-0" />;
  }
  return <XCircle className="h-4 w-4 text-orange-500 shrink-0" />;
}

function verdictText(analysis: RouteAnalysis): string {
  if (analysis.chargingStops === 0) {
    if (analysis.verdict === "easy") return "Covered easily";
    if (analysis.verdict === "comfortable") return "Covered comfortably";
    return "Covered (tight)";
  }
  const t = analysis.chargeTimeMinutes;
  return `${analysis.chargingStops}× charge stop (~${t} min)`;
}

// ── Single EV result card ─────────────────────────────────────────────────────

function EVRangeFitCard({ result, rank }: { result: EVRangeFitResult; rank: number }) {
  const { ev, score, grade, gradeLabel, routes: analyses, summary, summerRangeMiles, winterRangeMiles, peakDcKw, chargeTimeTo80Mins } = result;
  const g = GRADE_STYLES[grade];
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`rounded-2xl border ${g.border} bg-white overflow-hidden shadow-sm transition hover:shadow-md`}>
      <div className="p-5">
        {/* Top row: rank + score */}
        <div className="flex items-start gap-4">
          {/* Score ring */}
          <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border-2 ring-2 ${g.ring} ${g.bg}`}>
            <span className={`text-2xl font-black leading-none ${g.text}`}>{score}</span>
            <span className={`text-[9px] font-bold leading-none ${g.text}`}>/100</span>
          </div>

          {/* EV info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">#{rank}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${g.bg} ${g.text} ${g.border}`}>
                {grade} — {gradeLabel}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">{ev.brand}</p>
            <h3 className="text-lg font-black text-gray-900 leading-tight">{ev.model}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{summary}</p>
          </div>

          {/* Image */}
          {ev.heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ev.heroImage} alt={`${ev.brand} ${ev.model}`} className="hidden sm:block h-16 w-28 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100" />
          )}
        </div>

        {/* Score bar */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full transition-all ${g.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Route breakdown */}
        <div className="mt-4 space-y-2">
          {analyses.map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
              <VerdictIcon analysis={a} />
              <span className="flex-1 text-xs font-semibold text-gray-700">{a.route.label}</span>
              <span className="text-xs text-gray-400">{a.routeMiles} mi</span>
              <span className={`text-xs font-bold ${a.chargingStops === 0 ? "text-emerald-600" : a.chargingStops === 1 ? "text-amber-600" : "text-orange-600"}`}>
                {verdictText(a)}
              </span>
              {a.winterCaution && (
                <span title="Winter range caution"><Thermometer className="h-3 w-3 text-blue-500 shrink-0" /></span>
              )}
            </div>
          ))}
        </div>

        {/* Expandable stats */}
        {expanded && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <Gauge className="mx-auto h-4 w-4 text-brand mb-1" />
              <p className="text-[10px] text-gray-500">Real-world (summer)</p>
              <p className="text-sm font-black text-gray-900">{summerRangeMiles} mi</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <Thermometer className="mx-auto h-4 w-4 text-blue-500 mb-1" />
              <p className="text-[10px] text-gray-500">Winter range</p>
              <p className="text-sm font-black text-gray-900">{winterRangeMiles} mi</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <Zap className="mx-auto h-4 w-4 text-amber-500 mb-1" />
              <p className="text-[10px] text-gray-500">Peak DC charge</p>
              <p className="text-sm font-black text-gray-900">{peakDcKw} kW</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <Zap className="mx-auto h-4 w-4 text-emerald-500 mb-1" />
              <p className="text-[10px] text-gray-500">10→80% charge</p>
              <p className="text-sm font-black text-gray-900">{chargeTimeTo80Mins} min</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-gray-400 transition hover:text-gray-700"
          >
            {expanded ? "Hide details" : "See charging specs"}
          </button>
          <div className="flex-1" />
          <Link
            href={`/cars/${ev.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
          >
            View EV <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href={`/cars/${ev.id}#enquire`}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-hover"
          >
            Enquire <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Results page ──────────────────────────────────────────────────────────────

const SEASON_LABELS: Record<Season, string> = {
  summer: "Summer (best case)",
  average: "Average conditions",
  winter: "Winter (worst case)",
};

interface Props {
  results: EVRangeFitResult[];
  routes: UserRoute[];
  season: Season;
  onReset: () => void;
}

type FilterGrade = "all" | "A" | "B" | "C" | "D";

export default function RangeFitResults({ results, routes, season, onReset }: Props) {
  const [filter, setFilter] = useState<FilterGrade>("all");

  const perfectCount = results.filter((r) => r.grade === "A" || r.grade === "B").length;
  const displayed = filter === "all" ? results : results.filter((r) => r.grade === filter);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={onReset}
          className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Change routes
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Range Confidence Score™</p>
        <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
          {perfectCount} EV{perfectCount !== 1 ? "s" : ""} fit your life perfectly
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Based on {routes.map((r) => r.label).join(", ")} · {SEASON_LABELS[season]}
        </p>

        {/* Route pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {routes.map((r, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
              <Gauge className="h-3 w-3 text-brand" />
              {r.label}: {r.distanceMiles} mi {r.roundTrip ? "(return)" : "(one way)"} · {r.frequency}
            </span>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-400 transition hover:border-brand/40 hover:text-brand"
          >
            <RotateCcw className="h-3 w-3" /> Edit
          </button>
        </div>
      </div>

      {/* Grade filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "A", "B", "C", "D"] as FilterGrade[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilter(g)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              filter === g
                ? "border-brand bg-brand/10 text-brand"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {g === "all" ? `All EVs (${results.length})` : `Grade ${g} (${results.filter((r) => r.grade === g).length})`}
          </button>
        ))}
      </div>

      {/* Key legend */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Covered no charge needed</span>
        <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-500" /> 1 charge stop</span>
        <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-orange-500" /> Multiple stops</span>
        <span className="flex items-center gap-1"><Thermometer className="h-3.5 w-3.5 text-blue-500" /> Winter caution</span>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {displayed.map((result) => (
          <EVRangeFitCard key={result.ev.id} result={result} rank={results.indexOf(result) + 1} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 text-center">
        <p className="text-base font-bold text-gray-900">Not sure which to pick?</p>
        <p className="mt-1 text-sm text-gray-500">Our AI can factor in your budget, charging setup, and lifestyle too.</p>
        <Link
          href="/recommend"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-hover"
        >
          Get full AI recommendation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
