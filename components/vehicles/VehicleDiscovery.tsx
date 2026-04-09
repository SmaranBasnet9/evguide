"use client";

import { useDeferredValue, useMemo, useState } from "react";
import PremiumFilterSidebar from "@/components/vehicles/PremiumFilterSidebar";
import PremiumVehicleCard from "@/components/vehicles/PremiumVehicleCard";
import SectionBlock from "@/components/vehicles/SectionBlock";
import { filterVehicles, defaultFilters } from "@/lib/vehicles/filter";
import type {
  AllVehiclesFilters,
  PersonalizedVehicleCard,
  VehicleListingSegment,
  VehicleTier,
} from "@/types";
import { Search, Flame, PiggyBank, Sparkles, Diamond, TrendingUp, ShieldCheck } from "lucide-react";

const TIERS: VehicleTier[] = ["affordable", "mid", "premium"];

type Props = {
  vehicles: PersonalizedVehicleCard[];
  segment: VehicleListingSegment;
};

export default function VehicleDiscovery({ vehicles }: Props) {
  const [filters, setFilters] = useState<AllVehiclesFilters>(defaultFilters);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const activeFilters: AllVehiclesFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch]
  );

  const filtered = useMemo(
    () => filterVehicles(vehicles, activeFilters),
    [vehicles, activeFilters]
  );

  const byTier = useMemo(() => {
    return TIERS.reduce<Record<VehicleTier, PersonalizedVehicleCard[]>>(
      (acc, tier) => {
        acc[tier] = filtered.filter((v) => v.tier === tier);
        return acc;
      },
      { affordable: [], mid: [], premium: [] }
    );
  }, [filtered]);

  const recommendedMatches = useMemo(() => {
    return filtered
      .filter((v) => v.recommendationScore >= 70)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 3);
  }, [filtered]);

  const hasResults = filtered.length > 0;

  function handleFiltersChange(next: AllVehiclesFilters) {
    setFilters(next);
  }

  const filtersForPanel = { ...filters, search };

  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-[#0B0B0B] px-4 pb-24 font-sans text-zinc-100 sm:px-6 lg:px-8">
      <section className="relative mb-12 overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-zinc-900 to-black px-6 py-20 text-white shadow-2xl sm:px-12 lg:py-28">
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Built to reduce EV decision anxiety
            </span>
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight lg:text-7xl">
              Find the best EV for your budget
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
              Explore {vehicles.length} electric models with clearer deal signals, best-for labels, and monthly cost context so the shortlist feels easier to trust.
            </p>

            <div className="mb-8 flex flex-wrap gap-3 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Used by UK EV buyers</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Monthly cost included</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">AI Match-ready shortlist</span>
            </div>

            <div className="relative w-full max-w-xl group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, range, body type, or keyword..."
                className="block w-full rounded-2xl border border-white/10 bg-[#111111] py-5 pl-14 pr-6 text-lg font-medium leading-5 text-white placeholder-zinc-500 shadow-inner transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center gap-4 relative">
            <div className="absolute inset-0 rounded-[2rem] border border-white/5 bg-gradient-to-tr from-emerald-500/5 to-transparent p-8 shadow-2xl backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <div className="mb-1 text-sm font-bold uppercase tracking-wider text-emerald-400">Confidence snapshot</div>
                  <div className="text-4xl font-black text-white">Choose with clarity</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/5 bg-[#0B0B0B]/80 p-4">
                  <div className="mb-1 text-xs font-semibold uppercase text-zinc-500">Top match range</div>
                  <div className="text-2xl font-bold text-emerald-400">420-620 km</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0B0B0B]/80 p-4">
                  <div className="mb-1 text-xs font-semibold uppercase text-zinc-500">Monthly comfort lens</div>
                  <div className="text-2xl font-bold text-white">Included</div>
                </div>
                <div className="col-span-2 rounded-xl border border-white/5 bg-[#0B0B0B]/80 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-300" />
                    <p className="text-sm leading-7 text-zinc-300">
                      We surface only the strongest options first so the page feels lighter, faster,
                      and easier to act on.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative items-start lg:grid lg:grid-cols-[300px_1fr] lg:gap-12">
        <aside className="sticky top-28 z-20">
          <PremiumFilterSidebar
            filters={filtersForPanel}
            onChange={handleFiltersChange}
            vehicles={vehicles}
          />
        </aside>

        <div className="mt-12 min-h-[50vh] lg:mt-0">
          {!hasResults ? (
            <div className="rounded-3xl border border-white/5 bg-[#111111] p-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-zinc-900">
                <Search className="h-10 w-10 text-zinc-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">No close matches yet</h3>
              <p className="mx-auto mb-8 max-w-md text-zinc-400">Try broadening your filters slightly so we can show stronger EV fits instead of forcing a weak shortlist.</p>
              <button
                onClick={() => { setSearch(""); setFilters(defaultFilters); }}
                className="rounded-xl bg-white px-8 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {!activeFilters.search && recommendedMatches.length > 0 && (
                <SectionBlock
                  title="Top EVs based on UK buyer trends"
                  description="These are the strongest first options when you want a shortlist that feels sensible, finance-aware, and easy to compare."
                  icon={<Flame className="w-5 h-5" />}
                >
                  {recommendedMatches.map(v => <PremiumVehicleCard key={v.id} vehicle={v} />)}
                </SectionBlock>
              )}

              {byTier.affordable.length > 0 && (
                <SectionBlock
                  title="Best EVs for your budget"
                  description="Lower monthly pressure, stronger value, and simpler entry points for first-time EV buyers."
                  icon={<PiggyBank className="w-5 h-5" />}
                >
                  {byTier.affordable.map(v => <PremiumVehicleCard key={v.id} vehicle={v} />)}
                </SectionBlock>
              )}

              {byTier.mid.length > 0 && (
                <SectionBlock
                  title="Balanced EV choices"
                  description="A reassuring middle ground where practicality, range, and affordability tend to align best."
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  {byTier.mid.map(v => <PremiumVehicleCard key={v.id} vehicle={v} />)}
                </SectionBlock>
              )}

              {byTier.premium.length > 0 && (
                <SectionBlock
                  title="Premium EVs"
                  description="For buyers who want more range, stronger performance, and a more elevated cabin experience."
                  icon={<Diamond className="w-5 h-5" />}
                >
                  {byTier.premium.map(v => <PremiumVehicleCard key={v.id} vehicle={v} />)}
                </SectionBlock>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
