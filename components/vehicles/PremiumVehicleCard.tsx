import Image from "next/image";
import Link from "next/link";
import { Battery, Gauge, Zap, TrendingUp, Info } from "lucide-react";
import type { PersonalizedVehicleCard } from "@/types";

interface PremiumVehicleCardProps {
  vehicle: PersonalizedVehicleCard;
}

export default function PremiumVehicleCard({ vehicle }: PremiumVehicleCardProps) {
  const isHighMatch = vehicle.recommendationScore >= 80;
  const isGreatMatch = vehicle.recommendationScore >= 60 && vehicle.recommendationScore < 80;

  const scoreBadge = isHighMatch ? { text: "Great", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
    : isGreatMatch ? { text: "Fair", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" }
    : { text: "Premium", color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30" };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-[#111111] p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-[#161616] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="pointer-events-none absolute top-0 left-1/2 h-32 w-32 -translate-x-1/2 bg-emerald-500/10 blur-[50px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/5 bg-zinc-900">
        <Image
          src={vehicle.heroImage || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 z-10">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${scoreBadge.color}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {scoreBadge.text} deal score
          </div>
        </div>

        {vehicle.bestFor ? (
          <div className="absolute right-3 bottom-3 z-10 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            Best for {vehicle.bestFor.toLowerCase()}
          </div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex flex-grow flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">{vehicle.brand}</div>
            <h3 className="line-clamp-1 text-xl font-bold text-white">{vehicle.model}</h3>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-400">GBP{vehicle.price.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">Est. GBP{vehicle.estimatedEmi}/mo</div>
          </div>
        </div>

        {vehicle.whyRecommended ? (
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-zinc-300">
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            {vehicle.whyRecommended}
          </div>
        ) : null}

        <div className="rounded-[1.25rem] border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm leading-6 text-zinc-200">
          This EV is a great fit if you want clearer monthly cost confidence with less compromise day to day.
        </div>

        <div className="mt-auto mb-6 grid grid-cols-3 gap-2 border-y border-white/5 py-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.02] p-2">
            <Battery className="mb-1 h-4 w-4 text-zinc-500" />
            <div className="text-sm font-semibold text-white">{vehicle.rangeKm}km</div>
            <div className="text-[10px] uppercase text-zinc-500">Range</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.02] p-2">
            <Zap className="mb-1 h-4 w-4 text-zinc-500" />
            <div className="text-sm font-semibold text-white">{vehicle.batteryKWh}kWh</div>
            <div className="text-[10px] uppercase text-zinc-500">Battery</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.02] p-2">
            <Gauge className="mb-1 h-4 w-4 text-zinc-500" />
            <div className="text-sm font-semibold text-white">{vehicle.topSpeedKph}km/h</div>
            <div className="text-[10px] uppercase text-zinc-500">Top Speed</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ai-match" className="flex flex-1 items-center justify-center rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-black transition-colors hover:bg-emerald-400 shadow-lg">
            AI Match
          </Link>
          <Link href={`/compare?carA=${vehicle.id}`} className="flex h-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10">
            Compare EVs
          </Link>
        </div>
      </div>
    </div>
  );
}
