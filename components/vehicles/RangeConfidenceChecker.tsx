"use client";

/**
 * RangeConfidenceChecker
 *
 * "Does this EV fit my daily commute?"
 *
 * The #1 anxiety reducer for EV buyers. This interactive widget lets users
 * enter their daily round-trip mileage and instantly see whether the vehicle's
 * real-world range covers it — with a seasonal winter check too.
 */

import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { calcRangeConfidence } from "@/lib/ev-intelligence";
import type { RangeConfidenceResult } from "@/types";

interface Props {
  rangeKm: number;
  vehicleLabel: string;
}

export default function RangeConfidenceChecker({ rangeKm, vehicleLabel }: Props) {
  const [dailyMiles, setDailyMiles] = useState<number>(30);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<RangeConfidenceResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  function handleCheck() {
    const r = calcRangeConfidence(rangeKm, dailyMiles);
    setResult(r);
    setChecked(true);
    setExpanded(true);
  }

  const verdictConfig = result
    ? {
        comfortable: {
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
          bg: "bg-emerald-50 border-emerald-200",
          label: "Fits comfortably",
          labelColor: "text-emerald-700",
        },
        caution: {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          bg: "bg-amber-50 border-amber-200",
          label: "Fits with seasonal caution",
          labelColor: "text-amber-700",
        },
        tight: {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          bg: "bg-red-50 border-red-200",
          label: "May not fit comfortably",
          labelColor: "text-red-700",
        },
      }[result.verdict]
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Does this fit my commute?</p>
            {checked && result ? (
              <p className={`text-sm font-medium ${verdictConfig?.labelColor}`}>
                {verdictConfig?.label}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Check if {vehicleLabel}&apos;s range covers your daily drive
              </p>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {/* Expandable body */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
          {/* Input */}
          <div>
            <label htmlFor="daily-miles" className="block text-sm font-medium text-slate-700 mb-2">
              Your daily round trip (miles)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="daily-miles"
                type="range"
                min={5}
                max={200}
                step={5}
                value={dailyMiles}
                onChange={(e) => {
                  setDailyMiles(Number(e.target.value));
                  setChecked(false);
                  setResult(null);
                }}
                className="flex-1 h-2 bg-slate-200 rounded-full accent-blue-600"
              />
              <span className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-900">
                {dailyMiles} mi
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Include both directions. Average UK commute is ~20–30 miles/day.
            </p>
          </div>

          <button
            onClick={handleCheck}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Check range fit
          </button>

          {/* Results */}
          {checked && result && verdictConfig && (
            <div className={`rounded-xl border p-4 ${verdictConfig.bg}`}>
              <div className="flex items-start gap-3">
                {verdictConfig.icon}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${verdictConfig.labelColor}`}>
                    {verdictConfig.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{result.verdictReason}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-white/70 p-3 text-center">
                  <p className="text-xs text-slate-500">WLTP range</p>
                  <p className="text-lg font-bold text-slate-900">{result.wltpMiles} mi</p>
                </div>
                <div className="rounded-lg bg-white/70 p-3 text-center">
                  <p className="text-xs text-slate-500">Real world</p>
                  <p className="text-lg font-bold text-slate-900">{result.realWorldMiles} mi</p>
                </div>
                <div className="rounded-lg bg-white/70 p-3 text-center">
                  <p className="text-xs text-slate-500">Winter est.</p>
                  <p className="text-lg font-bold text-slate-900">{result.winterMiles} mi</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 text-center">
                {result.chargesPerWeek === 1
                  ? "You'd need to charge approx. once per week."
                  : `You'd need to charge approx. ${result.chargesPerWeek}× per week.`}
              </p>
            </div>
          )}

          {/* Context note */}
          <p className="text-xs text-slate-400">
            Real-world range estimated at 82% of WLTP. Winter range at 70%. Actual results vary by driving style, temperature, and motorway use.
          </p>
        </div>
      )}
    </div>
  );
}
