"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Flame, PiggyBank, Search, Sparkles, SlidersHorizontal, X } from "lucide-react";
import PremiumFilterSidebar from "@/components/vehicles/PremiumFilterSidebar";
import PremiumVehicleCard from "@/components/vehicles/PremiumVehicleCard";
import VehicleSort from "@/components/vehicles/VehicleSort";
import { filterVehicles, defaultFilters } from "@/lib/vehicles/filter";
import { sortVehicles } from "@/lib/vehicles/sort";
import type {
  AllVehiclesFilters,
  PersonalizedVehicleCard,
  VehicleListingSegment,
  VehicleTier,
} from "@/types";

const TIERS: VehicleTier[] = ["affordable", "mid", "premium"];

const TIER_META = {
  affordable: { title: "Best Value EVs", icon: PiggyBank, accent: "#1FBF9F" },
  mid: { title: "Mid-Range EVs", icon: Sparkles, accent: "#22D3EE" },
  premium: { title: "Premium EVs", icon: Diamond, accent: "#C8FF00" },
} as const;

type Props = {
  vehicles: PersonalizedVehicleCard[];
  segment: VehicleListingSegment;
};

export default function VehicleDiscovery({ vehicles }: Props) {
  const [filters, setFilters] = useState<AllVehiclesFilters>(defaultFilters);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const activeFilters: AllVehiclesFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch],
  );

  const filtered = useMemo(
    () => sortVehicles(filterVehicles(vehicles, activeFilters), activeFilters.sort),
    [vehicles, activeFilters],
  );

  const byTier = useMemo(() => {
    return TIERS.reduce<Record<VehicleTier, PersonalizedVehicleCard[]>>(
      (acc, tier) => {
        acc[tier] = filtered.filter((v) => v.tier === tier);
        return acc;
      },
      { affordable: [], mid: [], premium: [] },
    );
  }, [filtered]);

  const topPicks = useMemo(
    () =>
      filtered
        .filter((v) => v.recommendationScore >= 70)
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 3),
    [filtered],
  );

  const hasResults = filtered.length > 0;
  const filtersForPanel = { ...filters, search };

  function handleFiltersChange(next: AllVehiclesFilters) {
    setFilters(next);
  }

  const activeFilterCount = [
    filters.budgetMax !== Number.POSITIVE_INFINITY,
    (filters.rangeMin ?? 0) > 0,
    !!filters.bodyType,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-24 sm:px-6 md:pb-0 lg:px-8">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              EV Marketplace
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Browse{" "}
              <span className="text-gradient-brand">{vehicles.length} electric cars</span>
            </h1>
            <p className="mt-1.5 text-sm text-white/40">
              Real-world range · monthly cost · AI match signal — for UK buyers
            </p>
          </div>

          {/* Mobile filter trigger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:border-brand/30 hover:bg-brand/10 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Search + sort bar */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-brand" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand, model, body type..."
              className="w-full rounded-full border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="shrink-0">
            <VehicleSort
              value={filters.sort}
              onChange={(nextSort) => handleFiltersChange({ ...filters, sort: nextSort })}
              totalCount={vehicles.length}
              filteredCount={filtered.length}
            />
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + grid ──────────────────────────────────────────── */}
      <div className="relative items-start lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">

        {/* Desktop sidebar */}
        <aside className="sticky top-28 z-20 hidden lg:block">
          <PremiumFilterSidebar
            filters={filtersForPanel}
            onChange={handleFiltersChange}
            vehicles={vehicles}
          />
        </aside>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-[min(320px,calc(100vw-48px))] overflow-y-auto bg-[#111] p-5 lg:hidden"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-base font-semibold text-white">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <PremiumFilterSidebar
                  filters={filtersForPanel}
                  onChange={(f) => { handleFiltersChange(f); setSidebarOpen(false); }}
                  vehicles={vehicles}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="min-h-[60vh]">
          {!hasResults ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-[2rem] border border-white/8 bg-white/[0.03] p-16 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Search className="h-7 w-7 text-white/30" />
              </div>
              <h3 className="text-2xl font-semibold text-white">No matches found</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-white/40">
                Try broadening your filters to see more EVs.
              </p>
              <button
                onClick={() => { setSearch(""); setFilters(defaultFilters); }}
                className="mt-8 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-14">

              {/* Top picks */}
              {!activeFilters.search && topPicks.length > 0 && (
                <TierSection
                  title="Top picks"
                  icon={<Flame className="h-4 w-4" />}
                  accentColor="#1FBF9F"
                  vehicles={topPicks}
                />
              )}

              {TIERS.map((tier) => {
                const meta = TIER_META[tier];
                const Icon = meta.icon;
                return byTier[tier].length > 0 ? (
                  <TierSection
                    key={tier}
                    title={meta.title}
                    icon={<Icon className="h-4 w-4" />}
                    accentColor={meta.accent}
                    vehicles={byTier[tier]}
                  />
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tier section ─────────────────────────────────────────────────────────────

function TierSection({
  title,
  icon,
  accentColor,
  vehicles,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  vehicles: PersonalizedVehicleCard[];
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl border"
          style={{
            borderColor: `${accentColor}30`,
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="text-sm text-white/30">({vehicles.length})</span>
        <div className="ml-2 h-px flex-1 bg-white/6" />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <PremiumVehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </section>
  );
}
