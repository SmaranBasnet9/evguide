import Image from "next/image";
import { Battery, Gauge, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import type { EVModel } from "@/types";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";

interface PremiumCompareSummaryProps {
  modelA: EVModel;
  modelB: EVModel;
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function computeEmi(price: number) {
  return Math.round((price * 0.9 * (0.099 / 12) * Math.pow(1 + 0.099 / 12, 48)) / (Math.pow(1 + 0.099 / 12, 48) - 1));
}

function computeScore(m: EVModel) {
  let s = Math.max(0, 40 - Math.round(m.price / 2000));
  s += Math.min(25, Math.round(m.rangeKm / 20));
  if (m.batteryKWh > 0 && m.rangeKm > 0) s += Math.min(15, Math.round((m.rangeKm / m.batteryKWh) * 2));
  const a = parseFloat(String(m.acceleration).match(/([0-9.]+)/)?.[1] ?? "10") || 10;
  s += Math.max(0, 20 - Math.round(a * 2));
  return Math.max(10, Math.min(99, s));
}

function SummaryCard({ model, isWinner }: { model: EVModel; isWinner: boolean }) {
  const score = computeScore(model);
  const emi = computeEmi(model.price);

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-300 ${
      isWinner
        ? "border-brand/30 bg-white shadow-[0_0_60px_rgba(31,191,159,0.12)]"
        : "border-gray-200 bg-gray-50"
    }`}>
      {isWinner && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      )}

      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {model.heroImage ? (
          <Image
            src={model.heroImage}
            alt={`${model.brand} ${model.model}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <VehicleImagePlaceholder brand={model.brand} model={model.model} className="absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Score badge */}
        <div className="absolute left-4 top-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
            isWinner ? "border-brand/40 bg-brand/20 text-brand" : "border-gray-200 bg-gray-100 text-gray-700"
          }`}>
            <TrendingUp className="h-3 w-3" />
            {isWinner ? "Winner" : "Contender"}
          </span>
        </div>

        {/* Best for */}
        {model.bestFor && (
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] text-white/70 backdrop-blur-md">
              Best for {model.bestFor.toLowerCase()}
            </span>
          </div>
        )}

        {/* Score number */}
        <div className="absolute bottom-4 right-4 text-right">
          <p className={`text-3xl font-bold ${isWinner ? "text-brand" : "text-white/60"}`}>
            {score}
            <span className="text-sm font-medium text-white/30">/99</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">{model.brand}</p>
        <h3 className="mt-1 text-2xl font-semibold text-gray-900">{model.model}</h3>

        {/* Why */}
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <ShieldCheck className={`mt-0.5 h-4 w-4 shrink-0 ${isWinner ? "text-brand" : "text-gray-400"}`} />
          <p className="text-sm leading-6 text-gray-500">
            {isWinner
              ? "Stronger overall balance of cost, range, and efficiency."
              : "A solid contender — worth comparing on your specific priorities."}
          </p>
        </div>

        {/* Price row */}
        <div className="mt-4 flex items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Price</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{formatGBP(model.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Est. monthly</p>
            <p className={`mt-1 text-xl font-semibold ${isWinner ? "text-brand" : "text-gray-700"}`}>
              {formatGBP(emi)}<span className="text-sm text-gray-300">/mo</span>
            </p>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Battery, label: "Range", value: `${model.rangeKm} km` },
            { icon: Zap, label: "Battery", value: `${model.batteryKWh} kWh` },
            { icon: Gauge, label: "Speed", value: `${model.topSpeedKph} km/h` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 py-3">
              <Icon className={`mb-1.5 h-3.5 w-3.5 ${isWinner ? "text-brand/70" : "text-gray-400"}`} />
              <p className="text-sm font-semibold text-gray-900">{value}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PremiumCompareSummary({ modelA, modelB }: PremiumCompareSummaryProps) {
  const scoreA = computeScore(modelA);
  const scoreB = computeScore(modelB);

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section label */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Side by side</p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900">A clearer decision</h2>
          <p className="mt-2 text-sm text-gray-400">
            Compare cost, range, and daily fit — then pick the one that makes sense.
          </p>
        </div>

        {/* Cards with VS badge */}
        <div className="relative grid gap-5 md:grid-cols-2">
          <SummaryCard model={modelA} isWinner={scoreA >= scoreB} />

          {/* VS badge */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-500 shadow-xl">
              VS
            </div>
          </div>

          <SummaryCard model={modelB} isWinner={scoreB > scoreA} />
        </div>
      </div>
    </section>
  );
}
