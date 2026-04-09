import { Sparkles, Building2, MapPin, Wallet } from "lucide-react";
import type { EVModel } from "@/types";

interface PremiumCompareInsightsProps {
  modelA: EVModel;
  modelB: EVModel;
}

export default function PremiumCompareInsights({ modelA, modelB }: PremiumCompareInsightsProps) {
  const highwayWinner = modelA.rangeKm > modelB.rangeKm ? modelA : modelB.rangeKm > modelA.rangeKm ? modelB : null;
  const budgetWinner = modelA.price < modelB.price ? modelA : modelB.price < modelA.price ? modelB : null;
  const cityWinner = modelA.batteryKWh < modelB.batteryKWh ? modelA : modelB.batteryKWh < modelA.batteryKWh ? modelB : null;

  const overallWinner = budgetWinner ?? highwayWinner ?? cityWinner ?? modelA;

  return (
    <section className="relative bg-[#0B0B0B] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <Sparkles className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Decision insights</h2>
              <p className="mt-1 text-sm text-zinc-400">A simple explanation of which EV wins where, and why.</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-zinc-300">
            {overallWinner.brand} {overallWinner.model} is better for your needs if you want the easiest option to justify overall based on cost, practicality, and everyday usability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-6 transition-colors hover:border-white/10">
            <MapPin className="mb-4 h-6 w-6 text-zinc-400" />
            <h4 className="mb-2 font-bold text-white">Better for long drives</h4>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {highwayWinner ? `The ${highwayWinner.brand} ${highwayWinner.model} gives you more range confidence, which means fewer charging interruptions on longer journeys.` : "Both vehicles are closely matched for longer-distance use."}
            </p>
            {highwayWinner ? <div className="inline-flex rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">Winner: {highwayWinner.brand}</div> : null}
          </div>

          <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-6 transition-colors hover:border-white/10">
            <Building2 className="mb-4 h-6 w-6 text-zinc-400" />
            <h4 className="mb-2 font-bold text-white">Better for city driving</h4>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {cityWinner ? `The ${cityWinner.brand} ${cityWinner.model} feels like the easier city choice thanks to its lighter battery footprint and simpler urban efficiency story.` : "Both vehicles should feel equally capable around town."}
            </p>
            {cityWinner ? <div className="inline-flex rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">Winner: {cityWinner.brand}</div> : null}
          </div>

          <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-6 transition-colors hover:border-white/10">
            <Wallet className="mb-4 h-6 w-6 text-zinc-400" />
            <h4 className="mb-2 font-bold text-white">Better value</h4>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {budgetWinner ? `The ${budgetWinner.brand} ${budgetWinner.model} creates less financial pressure up front, making it the easier option to say yes to with confidence.` : "Both vehicles sit at a similar price point."}
            </p>
            {budgetWinner ? <div className="inline-flex rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">Winner: {budgetWinner.brand}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
