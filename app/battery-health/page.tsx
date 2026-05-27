"use client";

import { useState } from "react";
import Link from "next/link";
import { Battery, Search, Loader2, CheckCircle, AlertTriangle, TrendingDown, Zap, RefreshCw, ArrowLeft } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-white/50";

type Report = {
  soh: number;
  cellBalance: string;
  estimatedChargeCycles: number;
  fleetAverageSoh: number;
  vsFleet: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vin: string;
  recommendations: string[];
  generatedAt: string;
};

function SohGauge({ pct, fleetAvg }: { pct: number; fleetAvg: number }) {
  const color = pct >= 95 ? "#10b981" : pct >= 88 ? "#1FBF9F" : pct >= 80 ? "#f59e0b" : "#ef4444";
  const label = pct >= 95 ? "Excellent" : pct >= 88 ? "Good" : pct >= 80 ? "Fair" : "Below average";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">State of Health</p>
      <div className="relative mx-auto mb-4 h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 314} 314`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{pct}%</span>
          <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-xs text-white/30">This vehicle</p>
          <p className="text-lg font-bold" style={{ color }}>{pct}%</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-xs text-white/30">Fleet average</p>
          <p className="text-lg font-bold text-white/50">{fleetAvg}%</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-xs text-white/30">vs fleet</p>
          <p className={`text-lg font-bold ${pct > fleetAvg ? "text-emerald-400" : "text-red-400"}`}>
            {pct > fleetAvg ? "+" : ""}{pct - fleetAvg}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BatteryHealthPage() {
  const [form, setForm] = useState({
    vin: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setReport(null);

    const year = Number(form.year);
    const mileage = Number(form.mileage);

    if (form.vin.trim().length < 11) return setError("Enter a valid VIN (11–17 characters).");
    if (!form.brand.trim() || !form.model.trim()) return setError("Brand and model are required.");
    if (!year || year < 2011 || year > 2026) return setError("Valid year required (2011–2026).");
    if (isNaN(mileage) || mileage < 0) return setError("Valid mileage required.");

    setLoading(true);
    try {
      const res = await fetch("/api/battery-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vin: form.vin.trim(),
          brand: form.brand.trim(),
          model: form.model.trim(),
          year,
          mileage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? "Report generation failed.");
      }

      setReport((data as { report: Report }).report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-20">

        <Link
          href="/used-evs"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Used EVs
        </Link>

        <div className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Battery Health</p>
          <h1 className="mt-2 text-2xl font-bold">EV Battery Health Report</h1>
          <p className="mt-2 text-sm text-white/50">
            VIN-level battery diagnostics — cell balance, charge cycle count, degradation vs fleet average.
            Know exactly what you&apos;re buying before you commit.
          </p>
        </div>

        {/* What's included */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Battery,    label: "State of health",    sub: "SOH vs fleet avg" },
            { icon: RefreshCw,  label: "Cell balance",        sub: "Voltage uniformity" },
            { icon: TrendingDown, label: "Degradation curve", sub: "Vs similar models" },
            { icon: Zap,        label: "Charge cycles",       sub: "Estimated total" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <Icon className="mx-auto mb-2 h-4 w-4 text-brand/70" />
              <p className="text-xs font-semibold text-white">{label}</p>
              <p className="mt-0.5 text-[11px] text-white/40">{sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {!report && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Vehicle details</p>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className={labelCls}>VIN *</label>
              <input
                className={inputCls}
                placeholder="e.g. WBY1Z4C55FV278187"
                value={form.vin}
                onChange={(e) => set("vin", e.target.value.toUpperCase())}
                maxLength={17}
              />
              <p className="mt-1 text-[11px] text-white/30">Find on your V5C document, windscreen, or door frame</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Make *</label>
                <input className={inputCls} placeholder="e.g. Tesla" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Model *</label>
                <input className={inputCls} placeholder="e.g. Model 3" value={form.model} onChange={(e) => set("model", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Year *</label>
                <input className={inputCls} type="number" placeholder="2021" min={2011} max={2026} value={form.year} onChange={(e) => set("year", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Current mileage *</label>
                <input className={inputCls} type="number" placeholder="35000" min={0} value={form.mileage} onChange={(e) => set("mileage", e.target.value)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating report…</>
                : <><Search className="h-4 w-4" /> Generate battery report</>
              }
            </button>

            <p className="text-center text-[11px] text-white/30">
              Free during beta. Sign in required. £29 per report after launch.
            </p>
          </form>
        )}

        {/* Report */}
        {report && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Report for</p>
                <p className="text-lg font-bold text-white">{report.year} {report.brand} {report.model}</p>
                <p className="text-xs text-white/40">VIN: {report.vin} · {report.mileage.toLocaleString()} miles</p>
              </div>
              <button
                onClick={() => setReport(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
              >
                New report
              </button>
            </div>

            <SohGauge pct={report.soh} fleetAvg={report.fleetAverageSoh} />

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: RefreshCw, label: "Cell balance",    value: report.cellBalance.split("—")[0].trim(), sub: report.cellBalance.split("—")[1]?.trim() ?? "" },
                { icon: Zap,       label: "Charge cycles",   value: `~${report.estimatedChargeCycles.toLocaleString()}`, sub: "Estimated total" },
                { icon: TrendingDown, label: "vs Fleet avg", value: `${report.vsFleet > 0 ? "+" : ""}${report.vsFleet}%`, sub: report.vsFleet >= 0 ? "Above average" : "Below average" },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <Icon className="mb-2 h-4 w-4 text-brand/70" />
                  <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
                  <p className="mt-1 text-base font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40">{sub}</p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Recommendations</p>
              <div className="space-y-2">
                {report.recommendations.map((rec, i) => {
                  const isPositive = rec.toLowerCase().includes("excellent") || rec.toLowerCase().includes("above");
                  return (
                    <div key={i} className="flex items-start gap-3">
                      {isPositive
                        ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                        : <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      }
                      <p className="text-sm text-white/70">{rec}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-[11px] text-white/25">
              Report generated {new Date(report.generatedAt).toLocaleString("en-GB")}. Estimates based on model averages — not a replacement for a physical inspection.
            </p>

            <Link
              href="/used-evs"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Browse used EVs →
            </Link>
          </div>
        )}
      </div>

      <PremiumFooter />
    </main>
  );
}
