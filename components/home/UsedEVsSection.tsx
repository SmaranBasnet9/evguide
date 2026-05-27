"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Gauge, BatteryCharging, MapPin, Route, ShieldCheck, Car } from "lucide-react";
import { usedEvListings } from "@/data/usedEvListings";

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

const PREVIEW = usedEvListings.filter((l) => l.status === "active").slice(0, 6);

function UsedEVCard({ listing, index }: { listing: typeof PREVIEW[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const specs = [
    { icon: Gauge,           label: `${listing.mileage.toLocaleString()} mi` },
    { icon: BatteryCharging, label: `${listing.batteryHealthPct}% health` },
    { icon: Route,           label: `${listing.realWorldRangeMiles} mi range` },
    { icon: MapPin,          label: listing.location },
  ];

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
    >
      {/* Image — always visible */}
      <Image
        src={listing.image}
        alt={`${listing.brand} ${listing.model}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
        className={`object-cover transition-transform duration-500 ${expanded ? "scale-105" : "scale-100"}`}
      />

      {/* Permanent bottom gradient so text is always readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Default info — brand / model / price at bottom */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 bottom-0 p-3"
          >
            {listing.sellerType === "dealer" && (
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cyan-400">
                <ShieldCheck className="h-2.5 w-2.5" /> Verified dealer
              </span>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              {listing.brand}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-white">{listing.model}</p>
            <p className="mt-1 text-xs font-bold text-cyan-300">{formatGBP(listing.price)}</p>
            <p className="mt-0.5 text-[10px] text-white/40">{listing.year} · {listing.colour}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded — description overlay slides up on click */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/95 via-black/75 to-black/30 p-3"
          >
            {/* Header */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{listing.brand}</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{listing.model}</p>
              <p className="mt-1 text-xs font-bold text-cyan-300">{formatGBP(listing.price)}</p>
            </div>

            {/* Spec chips */}
            <div className="grid grid-cols-2 gap-1.5">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 rounded-xl border border-white/[0.10] bg-black/40 px-2 py-1.5"
                >
                  <s.icon className="h-3 w-3 shrink-0 text-cyan-400" />
                  <span className="text-[10px] leading-tight text-white/80">{s.label}</span>
                </div>
              ))}
            </div>

            {/* View listing button — navigates, stops card toggle */}
            <Link
              href={`/used-evs/${listing.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 py-2 text-xs font-semibold text-white transition hover:bg-cyan-400"
            >
              View listing <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UsedEVsSection() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-500">Pre-owned</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Used EVs</h2>
            <p className="mt-1 text-sm text-gray-400">Certified pre-owned electrics · tap a card to explore</p>
          </div>
          <Link
            href="/used-evs"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6-card portrait grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PREVIEW.map((listing, i) => (
            <UsedEVCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/used-evs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400"
          >
            View all used EVs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
