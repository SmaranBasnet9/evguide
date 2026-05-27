"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck, Zap, PoundSterling, Leaf, CheckCircle, Loader2,
  ChevronRight, BarChart3, Building2, Users, ArrowRight,
} from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

const inputCls = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-white/50";
const selectCls = `${inputCls} appearance-none`;

const INDUSTRIES = [
  "Logistics & delivery", "Construction", "Healthcare", "Field services",
  "Sales & territory", "Government / local authority", "Facilities management",
  "Professional services", "Retail distribution", "Other",
];

type CalcResult = {
  fuelSavingPerVehicle: number;
  maintenanceSavingPerVehicle: number;
  vedSavingPerVehicle: number;
  totalAnnualSavingPerVehicle: number;
  totalFleetSaving: number;
  co2ReductionTonnes: number;
  chargePointsNeeded: number;
  chargeInfrastructureCost: number;
  ozevGrantValue: number;
  netInfrastructureCost: number;
  salarySacrificeAnnualSaving: number;
  paybackMonths: number;
};

function calculateFleetSavings(params: {
  fleetSize: number;
  annualMileagePerVehicle: number;
  vehicleType: string;
  avgP11D: number;
  taxRate: number;
}): CalcResult {
  const { fleetSize, annualMileagePerVehicle, vehicleType, avgP11D, taxRate } = params;

  // Fuel cost comparison (p/mile)
  const currentCostPerMile = vehicleType === "petrol" ? 6.2 : 5.3; // petrol 28mpg / diesel 35mpg at 175p/l
  const evCostPerMile = 3.5; // 12p/kWh business, 3.5mi/kWh avg fleet
  const fuelSavingPerMile = currentCostPerMile - evCostPerMile;
  const fuelSavingPerVehicle = Math.round((annualMileagePerVehicle * fuelSavingPerMile) / 100);

  // Maintenance (diesel ~£1,300/yr, petrol ~£1,100/yr; EV ~£450/yr)
  const currentMaintenanceCost = vehicleType === "diesel" ? 1300 : 1100;
  const evMaintenanceCost = 450;
  const maintenanceSavingPerVehicle = currentMaintenanceCost - evMaintenanceCost;

  // VED (diesel/petrol ~£220/yr; EVs free until 2025 → £0)
  const vedSavingPerVehicle = 220;

  const totalAnnualSavingPerVehicle = fuelSavingPerVehicle + maintenanceSavingPerVehicle + vedSavingPerVehicle;
  const totalFleetSaving = totalAnnualSavingPerVehicle * fleetSize;

  // CO2: diesel ~120g/km, EV ~0 tailpipe
  const co2ReductionKgPerVehicle = (annualMileagePerVehicle * 1.60934) * 0.120; // km × 120g/km
  const co2ReductionTonnes = Math.round((co2ReductionKgPerVehicle * fleetSize) / 1000);

  // Charging infrastructure
  const chargePointsNeeded = Math.ceil(fleetSize * 0.65);
  const costPerPoint = 1100;
  const chargeInfrastructureCost = chargePointsNeeded * costPerPoint;
  const ozevGrantValue = Math.min(chargePointsNeeded, 40) * 350;
  const netInfrastructureCost = chargeInfrastructureCost - ozevGrantValue;

  // Salary sacrifice (simplified)
  // BiK EV: 2% of P11D vs diesel: ~30% BiK
  const evBiK = avgP11D * 0.02;
  const dieselBiK = avgP11D * 0.28;
  const evTaxable = evBiK * (taxRate / 100);
  const dieselTaxable = dieselBiK * (taxRate / 100);
  const salarySacrificeAnnualSaving = Math.round((dieselTaxable - evTaxable) * fleetSize);

  // Payback period on infrastructure
  const monthlyFleetSaving = totalFleetSaving / 12;
  const paybackMonths = monthlyFleetSaving > 0 ? Math.ceil(netInfrastructureCost / monthlyFleetSaving) : 0;

  return {
    fuelSavingPerVehicle,
    maintenanceSavingPerVehicle,
    vedSavingPerVehicle,
    totalAnnualSavingPerVehicle,
    totalFleetSaving,
    co2ReductionTonnes,
    chargePointsNeeded,
    chargeInfrastructureCost,
    ozevGrantValue,
    netInfrastructureCost,
    salarySacrificeAnnualSaving,
    paybackMonths,
  };
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export default function FleetPage() {
  const [fleetSize, setFleetSize] = useState(20);
  const [annualMileage, setAnnualMileage] = useState(15000);
  const [vehicleType, setVehicleType] = useState("diesel");
  const [avgP11D, setAvgP11D] = useState(30000);
  const [taxRate, setTaxRate] = useState(40);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  // Enquiry form
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", industry: "", message: "",
  });

  function setF(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    const r = calculateFleetSavings({
      fleetSize,
      annualMileagePerVehicle: annualMileage,
      vehicleType,
      avgP11D,
      taxRate,
    });
    setResult(r);
    setShowResults(true);
  }

  async function handleEnquiry(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("Name required.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) return setFormError("Valid email required.");
    if (!form.company.trim()) return setFormError("Company name required.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/fleet-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fleet_size: fleetSize,
          annual_mileage: annualMileage,
          annual_saving: result?.totalFleetSaving ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed.");
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">

        {/* Hero */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-xs font-semibold text-brand mb-6">
            <Truck className="h-3.5 w-3.5" />
            EVGuide Fleet Tool — Phase 3
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Transition your fleet to EV.<br />Know the numbers before you commit.
          </h1>
          <p className="mt-4 text-lg text-white/50 leading-relaxed">
            Route analysis, whole-life cost vs diesel, salary sacrifice calculator, and charge point planning — built for UK SMEs with 5–100 vehicles.
          </p>
        </div>

        {/* Value props */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: PoundSterling, label: "Whole-life cost",    sub: "True cost vs diesel — fuel, maintenance, VED" },
            { icon: Leaf,          label: "CO₂ reduction",      sub: "Scope 1 emissions eliminated" },
            { icon: Building2,     label: "Salary sacrifice",   sub: "BiK savings for employees + employer NI" },
            { icon: Zap,           label: "Charge planning",    sub: "Depot + OZEV workplace grant calculator" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <Icon className="mb-3 h-5 w-5 text-brand/70" />
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-1 text-xs text-white/40">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Calculator */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Step 1</p>
              <h2 className="mt-1 text-xl font-bold">Fleet cost calculator</h2>
            </div>

            <div className="space-y-4">
              {/* Fleet size */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className={labelCls}>Fleet size</label>
                  <span className="text-sm font-bold text-brand">{fleetSize} vehicles</span>
                </div>
                <input type="range" min={5} max={100} step={5} value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="h-2 w-full rounded-full accent-brand" />
                <div className="mt-1 flex justify-between text-xs text-white/30"><span>5</span><span>100</span></div>
              </div>

              {/* Annual mileage per vehicle */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className={labelCls}>Annual mileage per vehicle</label>
                  <span className="text-sm font-bold text-brand">{annualMileage.toLocaleString()} mi</span>
                </div>
                <input type="range" min={5000} max={50000} step={2500} value={annualMileage}
                  onChange={(e) => setAnnualMileage(Number(e.target.value))}
                  className="h-2 w-full rounded-full accent-brand" />
                <div className="mt-1 flex justify-between text-xs text-white/30"><span>5k</span><span>50k</span></div>
              </div>

              {/* Vehicle type */}
              <div>
                <label className={labelCls}>Current vehicle type</label>
                <div className="grid grid-cols-3 gap-2">
                  {["diesel", "petrol", "hybrid"].map((t) => (
                    <button key={t} type="button"
                      onClick={() => setVehicleType(t)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium capitalize transition ${vehicleType === t ? "border-brand/40 bg-brand/10 text-brand" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Average P11D */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className={labelCls}>Avg vehicle P11D value</label>
                  <span className="text-sm font-bold text-brand">{formatGBP(avgP11D)}</span>
                </div>
                <input type="range" min={15000} max={80000} step={2500} value={avgP11D}
                  onChange={(e) => setAvgP11D(Number(e.target.value))}
                  className="h-2 w-full rounded-full accent-brand" />
                <div className="mt-1 flex justify-between text-xs text-white/30"><span>£15k</span><span>£80k</span></div>
              </div>

              {/* Tax rate */}
              <div>
                <label className={labelCls}>Employee tax rate (for salary sacrifice)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ label: "Basic (20%)", value: 20 }, { label: "Higher (40%)", value: 40 }].map((t) => (
                    <button key={t.value} type="button"
                      onClick={() => setTaxRate(t.value)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${taxRate === t.value ? "border-brand/40 bg-brand/10 text-brand" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold text-white transition hover:bg-brand-hover"
            >
              <BarChart3 className="h-4 w-4" />
              Calculate fleet savings
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {!showResults ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] py-16 text-center px-6">
                <BarChart3 className="h-10 w-10 text-white/15 mb-4" />
                <p className="text-white/40 text-sm">Configure your fleet and click calculate to see projected savings</p>
              </div>
            ) : result && (
              <>
                {/* Headline saving */}
                <div className="rounded-2xl border border-brand/25 bg-brand/8 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">Annual fleet saving</p>
                  <p className="mt-2 text-5xl font-bold text-white">{formatGBP(result.totalFleetSaving)}</p>
                  <p className="mt-1 text-sm text-white/50">across {fleetSize} vehicles · {formatGBP(result.totalAnnualSavingPerVehicle)}/vehicle/yr</p>
                </div>

                {/* Breakdown */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Per-vehicle breakdown</p>
                  {[
                    { label: "Fuel savings",        value: formatGBP(result.fuelSavingPerVehicle),        sub: `${vehicleType} vs EV` },
                    { label: "Maintenance savings",  value: formatGBP(result.maintenanceSavingPerVehicle), sub: "No engine, oil, exhaust" },
                    { label: "VED savings",          value: formatGBP(result.vedSavingPerVehicle),         sub: "EVs currently VED exempt" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-white">{row.label}</p>
                        <p className="text-xs text-white/30">{row.sub}</p>
                      </div>
                      <p className="text-sm font-bold text-emerald-400">{row.value}/yr</p>
                    </div>
                  ))}
                </div>

                {/* CO2 + Salary sacrifice */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <Leaf className="mb-2 h-4 w-4 text-emerald-400" />
                    <p className="text-xl font-bold text-white">{result.co2ReductionTonnes}t</p>
                    <p className="text-xs text-white/40">CO₂ removed/yr</p>
                  </div>
                  <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
                    <PoundSterling className="mb-2 h-4 w-4 text-brand" />
                    <p className="text-xl font-bold text-white">{formatGBP(result.salarySacrificeAnnualSaving)}</p>
                    <p className="text-xs text-white/40">Salary sacrifice saving/yr</p>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Charging infrastructure</p>
                  {[
                    { label: "Charge points needed",  value: `${result.chargePointsNeeded} units` },
                    { label: "Gross install cost",     value: formatGBP(result.chargeInfrastructureCost) },
                    { label: "OZEV workplace grant",   value: `−${formatGBP(result.ozevGrantValue)}` },
                    { label: "Net cost",               value: formatGBP(result.netInfrastructureCost) },
                    { label: "Payback period",         value: `${result.paybackMonths} months` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
                      <p className="text-sm text-white/70">{row.label}</p>
                      <p className={`text-sm font-semibold ${row.label === "OZEV workplace grant" ? "text-emerald-400" : row.label === "Payback period" ? "text-brand" : "text-white"}`}>{row.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-hover"
                >
                  Talk to a fleet specialist <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Social proof / stats */}
        <div className="mt-16 mb-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Why EVGuide Fleet</p>
            <h2 className="mt-2 text-2xl font-bold">No competitor does EV-specific fleet planning</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: BarChart3, title: "EV-specific TCO",         desc: "Real-world battery degradation, charging costs, and maintenance factored in — not generic fleet tools" },
              { icon: Building2, title: "OZEV grant optimisation", desc: "Automatically calculates your Workplace Charging Scheme grant entitlement and infrastructure ROI" },
              { icon: Users,     title: "Salary sacrifice builder",desc: "Generate a full salary sacrifice proposal showing per-employee savings vs current car schemes" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <Icon className="mb-3 h-5 w-5 text-brand/70" />
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Pricing</p>
            <h2 className="mt-2 text-2xl font-bold">Simple SaaS pricing</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: "Starter",    price: "£299/mo", vehicles: "5–20 vehicles",   features: ["Fleet cost calculator", "Charging plan", "Monthly reporting", "Email support"] },
              { name: "Growth",     price: "£599/mo", vehicles: "21–60 vehicles",  features: ["Everything in Starter", "Salary sacrifice builder", "OZEV grant filing", "Dedicated account manager"], highlight: true },
              { name: "Enterprise", price: "£999/mo", vehicles: "61–100+ vehicles",features: ["Everything in Growth", "Route optimisation", "Custom integrations", "SLA + phone support"] },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-2xl border p-6 ${tier.highlight ? "border-brand/30 bg-brand/8" : "border-white/8 bg-white/[0.03]"}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">{tier.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">{tier.price}</p>
                <p className="mt-0.5 text-xs text-white/40">{tier.vehicles}</p>
                <ul className="mt-5 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-brand/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.highlight && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                  >
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry form */}
        {showForm && !done && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Get in touch</p>
              <h2 className="mt-1 text-xl font-bold">Talk to a fleet specialist</h2>
              <p className="mt-1 text-sm text-white/50">We&apos;ll set up a demo and walk through your specific fleet transition plan.</p>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">{formError}</div>
            )}

            <form onSubmit={handleEnquiry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full name *</label>
                  <input className={inputCls} placeholder="Jane Smith" value={form.name} onChange={(e) => setF("name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Work email *</label>
                  <input className={inputCls} type="email" placeholder="jane@company.com" value={form.email} onChange={(e) => setF("email", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Company *</label>
                  <input className={inputCls} placeholder="Company Ltd" value={form.company} onChange={(e) => setF("company", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} type="tel" placeholder="07700 900000" value={form.phone} onChange={(e) => setF("phone", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Industry</label>
                <select className={selectCls} value={form.industry} onChange={(e) => setF("industry", e.target.value)}>
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Anything else we should know?</label>
                <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Current fleet contracts, timeline, specific concerns…" value={form.message} onChange={(e) => setF("message", e.target.value)} />
              </div>
              <button type="submit" disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send enquiry →"}
              </button>
            </form>
          </div>
        )}

        {done && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-12 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <div>
              <p className="text-xl font-bold text-white">Enquiry received</p>
              <p className="mt-1 text-sm text-white/50">A fleet specialist will be in touch within one business day.</p>
            </div>
          </div>
        )}

        {!showForm && !done && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-bold text-white transition hover:bg-brand-hover"
            >
              Talk to a fleet specialist <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-white/30">Free demo · No obligation · Response within 1 business day</p>
          </div>
        )}

      </div>

      <PremiumFooter />
    </main>
  );
}
