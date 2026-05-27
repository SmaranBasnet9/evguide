"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, MapPin, Gauge, MessageSquare, Shield, Zap, ArrowRight, Search, X, SlidersHorizontal } from "lucide-react";
import EnquiryModal from "@/components/enquiry/EnquiryModal";
import type { UsedEVListing } from "@/data/usedEvListings";

type DealerListing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  images?: string[];
  range_km?: number | null;
  battery_kwh?: number | null;
  location?: string | null;
  body_type?: string | null;
  dealer_id: string;
};

type SortOption = "price_asc" | "price_desc" | "mileage_asc" | "battery_desc" | "newest";

type Props = {
  listings: UsedEVListing[];
  dealerListings: DealerListing[];
  dealerNameMap: Record<string, string>;
};

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function BatteryBar({ pct }: { pct: number }) {
  const color = pct >= 95 ? "bg-emerald-500" : pct >= 88 ? "bg-brand" : pct >= 80 ? "bg-amber-500" : "bg-red-500";
  const label = pct >= 95 ? "Excellent" : pct >= 88 ? "Good" : pct >= 80 ? "Fair" : "Below avg";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-900">{pct}%</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

function ListingCard({ listing }: { listing: UsedEVListing }) {
  const [expanded, setExpanded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white backdrop-blur-sm transition hover:border-brand/25"
    >
      {/* Image — always visible */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={listing.image}
          alt={`${listing.brand} ${listing.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${expanded ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Badges */}
        {listing.sellerType === "dealer" && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-[10px] font-semibold text-brand backdrop-blur-md">Dealer</span>
          </div>
        )}
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          {listing.ulezCompliant && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-md">ULEZ ✓</span>
          )}
          {listing.wallboxIncluded && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">Wallbox incl.</span>
          )}
        </div>

        {/* Click-to-expand description overlay */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="desc-overlay"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-black/20 p-4"
            >
              <p className="text-xs leading-relaxed text-white/80">{listing.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setEnquiryOpen(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand/30 bg-brand/10 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20"
                >
                  <MessageSquare className="h-3 w-3" /> Enquire
                </button>
                <Link
                  href={`/used-evs/${listing.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  View listing <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {enquiryOpen && (
        <EnquiryModal
          context={{ vehicleLabel: `${listing.brand} ${listing.model} (${listing.year})`, defaultType: "Vehicle Quote" }}
          onClose={() => setEnquiryOpen(false)}
        />
      )}

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs text-gray-400">{listing.brand}</p>
          <h3 className="text-base font-bold leading-tight text-gray-900">
            {listing.model}{listing.variant && <span className="font-normal text-gray-500"> {listing.variant}</span>}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">{listing.year} · {listing.colour} · {listing.previousOwners} owner{listing.previousOwners > 1 ? "s" : ""}</p>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-gray-400">Battery health</p>
          <BatteryBar pct={listing.batteryHealthPct} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Gauge className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{listing.mileage.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">miles</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Battery className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{listing.realWorldRangeMiles} mi</p>
            <p className="text-[10px] text-gray-400">real range</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Zap className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{listing.chargingSpeedDcKw} kW</p>
            <p className="text-[10px] text-gray-400">DC rapid</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-2">
          <div>
            <p className="text-xl font-bold text-brand">{formatGBP(listing.price)}</p>
            <div className="mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-400">{listing.location}</p>
            </div>
          </div>
          <Link
            href={`/used-evs/${listing.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-brand/40 hover:text-brand"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DealerCard({ listing, dealerName }: { listing: DealerListing; dealerName?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white backdrop-blur-sm transition hover:border-brand/25"
    >
      {/* Image — always visible */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={`${listing.year} ${listing.brand} ${listing.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${expanded ? "scale-105" : "scale-100"}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gauge className="h-10 w-10 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 z-10">
          <span className="rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-[10px] font-semibold text-brand backdrop-blur-md">Dealer</span>
        </div>
        {listing.images && listing.images.length > 1 && (
          <span className="absolute bottom-2 right-2 z-10 rounded-lg bg-black/60 px-2 py-0.5 text-xs text-white/70">
            +{listing.images.length - 1} photos
          </span>
        )}

        {/* Click-to-expand: key specs + navigate button */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="dealer-desc"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-black/20 p-4"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/80">
                  <Gauge className="h-3 w-3" /> {Number(listing.mileage).toLocaleString()} mi
                </span>
                {listing.battery_kwh && (
                  <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/80">
                    <Battery className="h-3 w-3 text-cyan-400" /> {listing.battery_kwh} kWh
                  </span>
                )}
                {listing.range_km && (
                  <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/80">
                    <Zap className="h-3 w-3 text-brand" /> {listing.range_km} km range
                  </span>
                )}
                {listing.location && (
                  <span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/80">
                    <MapPin className="h-3 w-3" /> {listing.location}
                  </span>
                )}
              </div>
              <Link
                href={`/used-evs/${listing.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2 text-xs font-semibold text-white transition hover:bg-brand-hover"
              >
                View full listing <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs text-gray-400">{listing.brand} · {listing.year}{listing.body_type ? ` · ${listing.body_type}` : ""}</p>
          <h3 className="text-base font-bold leading-tight text-gray-900">{listing.model}</h3>
          {listing.colour && <p className="mt-0.5 text-xs text-gray-400">{listing.colour}</p>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Gauge className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{Number(listing.mileage).toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">miles</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Battery className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{listing.battery_kwh ? `${listing.battery_kwh} kWh` : "—"}</p>
            <p className="text-[10px] text-gray-400">battery</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-center">
            <Zap className="mx-auto mb-1 h-3 w-3 text-gray-400" />
            <p className="text-xs font-semibold text-gray-900">{listing.range_km ? `${listing.range_km} km` : "—"}</p>
            <p className="text-[10px] text-gray-400">range</p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
          <div>
            <p className="text-xl font-bold text-brand">£{Number(listing.price).toLocaleString()}</p>
            {listing.location && (
              <div className="mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <p className="text-xs text-gray-400">{listing.location}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {dealerName && <p className="max-w-[100px] truncate text-right text-[10px] text-gray-400">{dealerName}</p>}
            <Link
              href={`/used-evs/${listing.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-brand/40 hover:text-brand"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price_asc",    label: "Price: low to high" },
  { value: "price_desc",   label: "Price: high to low" },
  { value: "mileage_asc",  label: "Lowest mileage" },
  { value: "battery_desc", label: "Best battery health" },
  { value: "newest",       label: "Newest listings" },
];

const BATTERY_FILTERS: { value: number; label: string }[] = [
  { value: 0,  label: "Any" },
  { value: 80, label: "80%+" },
  { value: 88, label: "88%+" },
  { value: 95, label: "95%+" },
];

export default function UsedEVsClientWrapper({ listings, dealerListings, dealerNameMap }: Props) {
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState<SortOption>("newest");
  const [batteryMin, setBatteryMin]   = useState(0);
  const [ulezOnly, setUlezOnly]       = useState(false);
  const [maxPrice, setMaxPrice]       = useState<number | null>(null);

  // Derive unique brands across both pools
  const brands = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => set.add(l.brand));
    dealerListings.forEach((l) => set.add(l.brand));
    return Array.from(set).sort();
  }, [listings, dealerListings]);

  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  const PRICE_CAPS = [15000, 20000, 25000, 30000, 40000];

  // ── Filter + sort private/static listings ─────────────────────────────────
  const filteredListings = useMemo(() => {
    let out = listings;
    const q = search.trim().toLowerCase();
    if (q) out = out.filter((l) => `${l.brand} ${l.model} ${l.variant ?? ""} ${l.location}`.toLowerCase().includes(q));
    if (brandFilter) out = out.filter((l) => l.brand === brandFilter);
    if (batteryMin > 0) out = out.filter((l) => l.batteryHealthPct >= batteryMin);
    if (ulezOnly) out = out.filter((l) => l.ulezCompliant);
    if (maxPrice) out = out.filter((l) => l.price <= maxPrice);

    return [...out].sort((a, b) => {
      switch (sort) {
        case "price_asc":    return a.price - b.price;
        case "price_desc":   return b.price - a.price;
        case "mileage_asc":  return a.mileage - b.mileage;
        case "battery_desc": return b.batteryHealthPct - a.batteryHealthPct;
        case "newest":       return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      }
    });
  }, [listings, search, brandFilter, batteryMin, ulezOnly, maxPrice, sort]);

  // ── Filter + sort dealer listings ──────────────────────────────────────────
  const filteredDealerListings = useMemo(() => {
    let out = dealerListings;
    const q = search.trim().toLowerCase();
    if (q) out = out.filter((l) => `${l.brand} ${l.model} ${l.location ?? ""}`.toLowerCase().includes(q));
    if (brandFilter) out = out.filter((l) => l.brand === brandFilter);
    if (maxPrice) out = out.filter((l) => l.price <= maxPrice);

    return [...out].sort((a, b) => {
      switch (sort) {
        case "price_asc":   return a.price - b.price;
        case "price_desc":  return b.price - a.price;
        case "mileage_asc": return a.mileage - b.mileage;
        default:            return 0;
      }
    });
  }, [dealerListings, search, brandFilter, maxPrice, sort]);

  const activeFilterCount = [
    !!brandFilter,
    batteryMin > 0,
    ulezOnly,
    !!maxPrice,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setBrandFilter(null);
    setBatteryMin(0);
    setUlezOnly(false);
    setMaxPrice(null);
    setSort("newest");
  }

  const totalResults = filteredListings.length + filteredDealerListings.length;

  return (
    <div>
      {/* ── Search + Sort bar ───────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-brand" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, model, location..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand/40"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Filter pills ────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 sm:inline">
          <SlidersHorizontal className="inline h-3 w-3 mr-1" />Filter
        </span>

        {/* Brand */}
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setBrandFilter(brandFilter === brand ? null : brand)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              brandFilter === brand
                ? "border-brand/50 bg-brand/15 text-brand"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {brand}
          </button>
        ))}

        {/* Battery health */}
        {BATTERY_FILTERS.slice(1).map((f) => (
          <button
            key={f.value}
            onClick={() => setBatteryMin(batteryMin === f.value ? 0 : f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              batteryMin === f.value
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            Battery {f.label}
          </button>
        ))}

        {/* ULEZ */}
        <button
          onClick={() => setUlezOnly(!ulezOnly)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            ulezOnly
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          <Shield className="inline h-3 w-3 mr-1" />ULEZ only
        </button>

        {/* Price caps */}
        {PRICE_CAPS.map((cap) => (
          <button
            key={cap}
            onClick={() => setMaxPrice(maxPrice === cap ? null : cap)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              maxPrice === cap
                ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            Under £{(cap / 1000).toFixed(0)}k
          </button>
        ))}

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="ml-1 flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-400 transition hover:text-gray-900"
          >
            <X className="h-3 w-3" /> Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* ── Results count ──────────────────────────────────────────────────── */}
      {(search || activeFilterCount > 0) && (
        <p className="mb-5 text-sm text-gray-400">
          {totalResults === 0 ? "No listings match your filters" : `${totalResults} listing${totalResults !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* ── Dealer listings ─────────────────────────────────────────────────── */}
      {filteredDealerListings.length > 0 && (
        <div className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">Dealer Marketplace</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">Available from verified dealers</h2>
            </div>
            <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              {filteredDealerListings.length} live listing{filteredDealerListings.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDealerListings.map((l) => (
              <DealerCard key={l.id} listing={l} dealerName={dealerNameMap[l.dealer_id]} />
            ))}
          </div>
        </div>
      )}

      {/* ── Private / static listings ────────────────────────────────────────── */}
      {filteredListings.length === 0 && filteredDealerListings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">No listings match your filters</p>
          <p className="text-sm text-gray-500">Try adjusting your search or removing some filters</p>
          <button
            onClick={clearFilters}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Clear all filters
          </button>
        </div>
      ) : filteredListings.length === 0 ? null : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
