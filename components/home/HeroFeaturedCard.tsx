"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BatteryCharging, MapPin, TrendingUp, Zap } from "lucide-react";
import type { EVModel } from "@/types";

interface HeroFeaturedCardProps {
  model: EVModel | null;
}

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      {/* Outer glow */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-brand/10 blur-3xl" />

      {/* Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
              Featured EV
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {model.brand} {model.model}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/15 px-3 py-1.5 text-xs font-semibold text-brand">
            <TrendingUp className="h-3 w-3" />
            92% match
          </span>
        </div>

        {/* Best for tag */}
        <div className="mt-3 flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-white/30" />
          <span className="text-sm text-white/50">Best for {model.bestFor.toLowerCase()}</span>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-white/8" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className={`rounded-xl p-4 ${
                spec.accent
                  ? "border border-brand/25 bg-brand/10"
                  : "border border-white/6 bg-white/[0.04]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{spec.label}</p>
              <p className={`mt-2 text-lg font-semibold ${spec.accent ? "text-brand" : "text-white"}`}>
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        {/* Range bar */}
        <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-white/40">
              <BatteryCharging className="h-3.5 w-3.5 text-brand" />
              Range confidence
            </span>
            <span className="font-semibold text-white">
              ~{Math.round(model.rangeKm * 0.82)} km real-world
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "82%" }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full rounded-full bg-brand"
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/cars/${model.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.05] py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
        >
          View full details
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Powered by badge */}
        <p className="mt-3 text-center text-[10px] text-white/20">
          <Zap className="mr-1 inline h-2.5 w-2.5 text-brand/50" />
          AI-matched · No signup required
        </p>
      </div>
    </motion.div>
  );
}

export function HeroFeaturedCardSkeleton() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-brand/5 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-7 w-44 animate-pulse rounded-xl bg-white/10" />
          </div>
          <div className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="mt-3 h-4 w-36 animate-pulse rounded-lg bg-white/8" />
        <div className="my-5 h-px bg-white/8" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl bg-white/8" />
          ))}
        </div>
        <div className="mt-4 h-16 animate-pulse rounded-xl bg-white/8" />
        <div className="mt-4 h-10 animate-pulse rounded-xl bg-white/8" />
      </div>
    </div>
  );
}
