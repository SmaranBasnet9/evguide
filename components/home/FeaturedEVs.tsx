"use client";

import { useState, useMemo, useRef } from "react";
import type { EVModel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft, BatteryCharging, Gauge } from "lucide-react";
import VehicleImagePlaceholder from "@/components/vehicles/VehicleImagePlaceholder";

interface FeaturedEVsProps {
  models: EVModel[];
}

function estimateMonthlyCost(price: number) {
  const deposit = price * 0.1;
  const principal = price - deposit;
  const monthlyRate = 0.069 / 12;
  const months = 48;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment + 112);
}

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDescriptor(model: EVModel): string {
  if (model.bestFor) return model.bestFor;
  if (model.price < 30000) return "Affordable electric city car";
  if (model.price < 50000) return "Popular mid-range electric SUV";
  return "Premium long-range electric";
}

function getSavingLabel(model: EVModel): string | null {
  // Rough estimate: show saving for models with price below average market
  if (model.price < 32000) return `Avg saving £${(2000 + Math.round(model.price * 0.04)).toLocaleString("en-GB")} off RRP`;
  if (model.price < 50000) return `Avg saving £${(3000 + Math.round(model.price * 0.05)).toLocaleString("en-GB")} off RRP`;
  return null;
}

// ── Single deal card ──────────────────────────────────────────────────────────

function DealCard({ model }: { model: EVModel }) {
  const saving = getSavingLabel(model);
  const monthly = estimateMonthlyCost(model.price);

  return (
    <article className="group relative flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] sm:min-w-0">
      {/* Card top: name + saving badge */}
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              {model.brand}
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900">
              {model.model}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{getDescriptor(model)}</p>
          </div>
          {model.badge && (
            <span className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[10px] font-semibold text-brand">
              {model.badge}
            </span>
          )}
        </div>
      </div>

      {/* Car image — fixed aspect ratio ensures identical height across all cards */}
      <div className="relative mt-4 w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "16/9" }}>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand/[0.07] to-transparent" />
        {model.heroImage ? (
          <Image
            src={model.heroImage}
            alt={`${model.brand} ${model.model}`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <VehicleImagePlaceholder
            brand={model.brand}
            model={model.model}
            className="absolute inset-0"
          />
        )}
      </div>

      {/* Spec chips */}
      <div className="flex flex-wrap gap-1.5 px-5">
        {model.rangeKm > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-brand/25 bg-brand/[0.08] px-2.5 py-1 text-[10px] font-semibold text-brand">
            <Gauge className="h-2.5 w-2.5" />{model.rangeKm} km range
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
          <BatteryCharging className="h-2.5 w-2.5" />Fast charge
        </span>
      </div>

      {/* Card bottom: pricing + CTA */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">From</p>
          <p className="text-xl font-black text-gray-900 leading-tight">{formatGBP(model.price)}</p>
          <p className="text-xs text-gray-400">
            or <span className="font-semibold text-gray-600">{formatGBP(monthly)}/mo</span> on finance
          </p>
          {saving && (
            <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5">
              <span className="text-xs font-bold text-gray-700">{saving}</span>
            </div>
          )}
        </div>

        <Link
          href={`/cars/${model.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-all hover:scale-110 hover:bg-brand hover:text-white"
          aria-label={`View ${model.brand} ${model.model}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function FeaturedEVs({ models }: FeaturedEVsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "value" | "range" | "family" | "city">("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayModels = useMemo(() => {
    const pool = [...models];
    if (activeFilter === "value") return pool.sort((a, b) => a.price - b.price).slice(0, 6);
    if (activeFilter === "range")  return pool.sort((a, b) => b.rangeKm - a.rangeKm).slice(0, 6);
    if (activeFilter === "family") {
      const fam = pool.filter((m) =>
        m.bestFor?.toLowerCase().includes("famil") ||
        m.bestFor?.toLowerCase().includes("people") ||
        m.bestFor?.toLowerCase().includes("versatil"),
      );
      return (fam.length >= 1 ? fam : pool).slice(0, 6);
    }
    if (activeFilter === "city") {
      const city = pool.filter((m) => m.price < 34000);
      return (city.length >= 1 ? city : pool.sort((a, b) => a.price - b.price)).slice(0, 6);
    }
    return pool.slice(0, 6);
  }, [models, activeFilter]);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  }

  const FILTERS = [
    { key: "all" as const,    label: "All" },
    { key: "value" as const,  label: "Best Value" },
    { key: "range" as const,  label: "Longest Range" },
    { key: "family" as const, label: "Family" },
    { key: "city" as const,   label: "City EV" },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Electric is trending</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
              Hottest EV &amp; Hybrid Deals
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Prices updated daily · Finance available on every car
            </p>
          </div>

          {/* Desktop scroll arrows */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === key
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Horizontally scrollable deal cards */}
        <div
          ref={scrollRef}
          className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayModels.map((model) => (
            <DealCard key={model.id} model={model} />
          ))}
        </div>

        {/* Browse all link */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
          >
            Browse all EVs &amp; Hybrids
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
