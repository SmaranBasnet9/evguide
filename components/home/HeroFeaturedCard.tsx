"use client";

import Link from "next/link";
import { ArrowRight, BatteryCharging, Leaf, MapPin, TrendingUp, Wind, Zap } from "lucide-react";
import type { EVModel } from "@/types";

interface HeroFeaturedCardProps {
  model: EVModel | null;
}

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function formatGBP(value: number) {
  return GBP.format(value);
}

function estimateMonthly(price: number) {
  const principal = price * 0.9;
  const r = 0.069 / 12;
  const n = 48;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) + 112);
}

export default function HeroFeaturedCard({ model }: HeroFeaturedCardProps) {
  if (!model) return <HeroFeaturedCardSkeleton />;

  const monthly = estimateMonthly(model.price);

  const specs = [
    { label: "Price", value: formatGBP(model.price), accent: false },
    { label: "Monthly est.", value: `${formatGBP(monthly)}/mo`, accent: true },
    { label: "Range", value: `${model.rangeKm} km`, accent: false },
    { label: "Battery", value: `${model.batteryKWh} kWh`, accent: false },
  ];

  const rangeWidth = 82;

  return (
    <div className="anim-fade-up relative" style={{ animationDelay: "300ms" }}>
      {/* Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-green-500/[0.18] bg-[rgba(8,22,10,0.62)] p-5 shadow-[inset_0_1px_0_rgba(0,230,118,0.12),0_32px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">

        {/* Inner green gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-950/40 via-transparent to-emerald-950/20" />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-green-400/60">
              <Leaf className="h-3 w-3 text-green-400/70" />
              Featured EV
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {model.brand} {model.model}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/35 bg-green-500/[0.14] px-3 py-1.5 text-xs font-semibold text-green-400">
            <TrendingUp className="h-3 w-3" />
            92% match
          </span>
        </div>

        {/* Best for + Zero Emissions row */}
        <div className="relative mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-white/30" />
            <span className="text-sm text-white/50">Best for {model.bestFor.toLowerCase()}</span>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-green-600/25 bg-green-950/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-400/80">
            <Wind className="h-2.5 w-2.5" />
            Zero CO₂
          </span>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className={`rounded-xl p-4 ${
                spec.accent
                  ? "border border-green-500/30 bg-green-500/[0.10]"
                  : "border border-green-900/40 bg-green-950/[0.25]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{spec.label}</p>
              <p className={`mt-2 text-lg font-semibold ${spec.accent ? "text-green-400" : "text-white"}`}>
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        {/* Range bar — CSS width instead of motion */}
        <div className="mt-4 rounded-xl border border-green-900/40 bg-green-950/[0.22] px-4 py-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-white/40">
              <BatteryCharging className="h-3.5 w-3.5 text-green-400" />
              Range confidence
            </span>
            <span className="font-semibold text-green-300">
              ~{Math.round(model.rangeKm * 0.82)} km real-world
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full transition-[width] duration-[1200ms] ease-out"
              style={{
                width: `${rangeWidth}%`,
                background: "linear-gradient(90deg, #00c853 0%, #00e676 60%, #69f0ae 100%)",
                boxShadow: "0 0 6px rgba(0,230,118,0.4)",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/cars/${model.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-green-700/25 bg-green-950/30 py-3 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-green-500/45 hover:bg-green-500/[0.12] hover:text-green-300"
        >
          View full details
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Powered by badge */}
        <p className="mt-3 text-center text-[10px] text-white/20">
          <Zap className="mr-1 inline h-2.5 w-2.5 text-green-500/50" />
          AI-matched · No signup required
        </p>
      </div>
    </div>
  );
}

export function HeroFeaturedCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-green-900/30 bg-[rgba(8,22,10,0.5)] p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-green-900/40" />
          <div className="h-7 w-44 animate-pulse rounded-xl bg-green-900/30" />
        </div>
        <div className="h-7 w-24 animate-pulse rounded-full bg-green-900/30" />
      </div>
      <div className="mt-3 h-4 w-36 animate-pulse rounded-lg bg-green-900/25" />
      <div className="my-5 h-px bg-green-900/30" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-xl bg-green-950/40" />
        ))}
      </div>
      <div className="mt-4 h-16 animate-pulse rounded-xl bg-green-950/40" />
      <div className="mt-4 h-10 animate-pulse rounded-xl bg-green-950/30" />
    </div>
  );
}
