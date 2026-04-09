import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BatteryCharging, PoundSterling, Route, TrendingUp } from "lucide-react";
import type { InlineEVRecommendation } from "./types";

interface EVCardInlineProps {
  item: InlineEVRecommendation;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EVCardInline({ item }: EVCardInlineProps) {
  const compareHref = `/compare?vehicles=${item.model.id}`;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]">
      <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111]">
        <Image
          src={item.model.heroImage}
          alt={`${item.model.brand} ${item.model.model}`}
          fill
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur">
          <TrendingUp className="h-3.5 w-3.5" />
          Deal score {item.dealScore}
        </div>
      </div>

      <div className="relative mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              {item.model.brand}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {item.model.model}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-emerald-300">
              {formatCurrency(item.model.price)}
            </p>
            <p className="text-sm text-zinc-400">from {formatCurrency(item.monthlyCost)}/mo</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-zinc-300">{item.summary}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-zinc-500">Range</p>
            <p className="mt-1 font-medium text-white">{item.model.rangeKm} km</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-zinc-500">Battery</p>
            <p className="mt-1 font-medium text-white">{item.model.batteryKWh} kWh</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-zinc-500">Charge</p>
            <p className="mt-1 font-medium text-white">{item.model.fastChargeTime}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-zinc-500">Best for</p>
            <p className="mt-1 font-medium text-white">{item.model.bestFor}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/vehicles/${item.model.id}`}
            className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
          >
            View details
          </Link>
          <Link
            href={compareHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            Compare
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5"><PoundSterling className="h-3.5 w-3.5" />UK finance-aligned estimate</span>
          <span className="inline-flex items-center gap-1.5"><Route className="h-3.5 w-3.5" />Real-world buyer context</span>
          <span className="inline-flex items-center gap-1.5"><BatteryCharging className="h-3.5 w-3.5" />Platform-matched EV specs</span>
        </div>
      </div>
    </article>
  );
}
