import Image from "next/image";
import { Battery, Gauge, Zap, TrendingUp, Info, ShieldCheck } from "lucide-react";
import type { EVModel } from "@/types";

interface PremiumCompareSummaryProps {
  modelA: EVModel;
  modelB: EVModel;
}

function computeEmi(price: number) {
  return Math.round((price * 0.8) / 60);
}

function computeMockScore(m: EVModel) {
  let score = 50;
  if (m.tier === "affordable") score += 20;
  if (computeEmi(m.price) < 500) score += 10;
  if (m.rangeKm > 400) score += 10;
  score += Math.min(10, m.rangeKm / 50);
  return Math.max(10, Math.min(99, Math.round(score)));
}

function SummaryCard({ model }: { model: EVModel }) {
  const score = computeMockScore(model);
  const isHighMatch = score >= 80;
  const isGreatMatch = score >= 60 && score < 80;

  const scoreBadge = isHighMatch ? { text: "Better value", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
    : isGreatMatch ? { text: "Balanced pick", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" }
    : { text: "Premium choice", color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30" };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-[#111111] p-4 transition-all duration-300">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[80px]" />

      <div className="relative mb-6 w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/5 bg-zinc-900">
        <Image
          src={model.heroImage || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop"}
          alt={`${model.brand} ${model.model}`}
          fill
          className="object-cover"
        />

        <div className="absolute top-4 left-4 z-10">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${scoreBadge.color}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {scoreBadge.text}
          </div>
        </div>

        {model.bestFor ? (
          <div className="absolute bottom-4 left-4 z-10 max-w-[80%]">
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
              <Info className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
              <span className="truncate">Best for {model.bestFor.toLowerCase()}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative z-20 flex flex-grow flex-col">
        <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-zinc-500">{model.brand}</div>
        <h3 className="mb-4 text-3xl font-extrabold text-white">{model.model}</h3>

        <div className="mb-4 rounded-[1.25rem] border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm leading-6 text-zinc-200">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4.5 w-4.5 text-emerald-300" />
            <span>This option feels easiest to justify if you want a confident balance of cost, range, and daily practicality.</span>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between border-b border-white/5 pb-6">
          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">Price</div>
            <div className="text-2xl font-bold tracking-tight text-white">GBP{model.price.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">Estimated monthly</div>
            <div className="text-2xl font-bold tracking-tight text-emerald-400">GBP{computeEmi(model.price)}<span className="text-base font-medium text-zinc-500">/mo</span></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-3 text-center">
            <Battery className="mx-auto mb-2 h-5 w-5 text-zinc-400" />
            <div className="text-lg font-bold text-white">{model.rangeKm}</div>
            <div className="text-[10px] font-semibold uppercase text-zinc-500">Range (km)</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-3 text-center">
            <Zap className="mx-auto mb-2 h-5 w-5 text-zinc-400" />
            <div className="text-lg font-bold text-white">{model.batteryKWh}</div>
            <div className="text-[10px] font-semibold uppercase text-zinc-500">Battery (kWh)</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-3 text-center">
            <Gauge className="mx-auto mb-2 h-5 w-5 text-zinc-400" />
            <div className="text-lg font-bold text-white">{model.topSpeedKph}</div>
            <div className="text-[10px] font-semibold uppercase text-zinc-500">Speed (kph)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumCompareSummary({ modelA, modelB }: PremiumCompareSummaryProps) {
  return (
    <section className="relative z-20 -mt-10 bg-[#0B0B0B] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-center">
          <h2 className="text-3xl font-bold text-white">A clearer side-by-side decision</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">Use this comparison to decide which EV feels easier to live with, easier to afford, and easier to justify.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <SummaryCard model={modelA} />
          <SummaryCard model={modelB} />
        </div>
      </div>
    </section>
  );
}
