"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Battery, Gauge, TrendingUp, Zap } from "lucide-react";
import QuoteModal from "@/components/vehicles/QuoteModal";
import { trackEvent } from "@/lib/tracking/client";
import type { PersonalizedVehicleCard } from "@/types";

interface PremiumVehicleCardProps {
  vehicle: PersonalizedVehicleCard;
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PremiumVehicleCard({ vehicle }: PremiumVehicleCardProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const score = vehicle.recommendationScore;
  const badge =
    score >= 80
      ? { label: "Great deal", color: "border-brand/30 bg-brand/15 text-brand" }
      : score >= 60
      ? { label: "Good match", color: "border-cyan-400/30 bg-cyan-400/10 text-cyan-400" }
      : { label: "Premium", color: "border-white/15 bg-white/8 text-white/60" };

  function onView() {
    void trackEvent({
      eventType: "vehicle_view",
      carId: vehicle.id,
      eventValue: { brand: vehicle.brand, model: vehicle.model, vehicle_tier: vehicle.tier },
    });
  }

  const realRange = vehicle.realWorldRangeMiles ?? Math.round(vehicle.rangeKm * 0.621371);

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.04] transition-all duration-300 hover:border-brand/25 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        {/* Image */}
        <Link href={`/cars/${vehicle.id}`} onClick={onView} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={
                vehicle.heroImage ||
                "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop"
              }
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Deal badge — top left */}
            <div className="absolute left-3 top-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${badge.color}`}>
                <TrendingUp className="h-3 w-3" />
                {badge.label}
              </span>
            </div>

            {/* Best for — bottom right */}
            {vehicle.bestFor && (
              <div className="absolute bottom-3 right-3">
                <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                  Best for {vehicle.bestFor.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">

          {/* Brand + price row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                {vehicle.brand}
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold text-white">
                {vehicle.model}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-brand">{formatGBP(vehicle.price)}</p>
              <p className="text-xs text-white/35">
                Est. {formatGBP(vehicle.estimatedEmi)}/mo
              </p>
            </div>
          </div>

          {/* Why recommended chip */}
          {vehicle.whyRecommended && (
            <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/20 bg-brand/8 px-2.5 py-1.5 text-xs font-medium text-brand">
              {vehicle.whyRecommended}
            </div>
          )}

          {/* Specs row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Battery, label: "Range", value: `${realRange} mi` },
              { icon: Zap, label: "Battery", value: `${vehicle.batteryKWh} kWh` },
              { icon: Gauge, label: "Top speed", value: `${vehicle.topSpeedKph} km/h` },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-white/6 bg-white/[0.03] px-2 py-3"
              >
                <Icon className="mb-1.5 h-3.5 w-3.5 text-brand/70" />
                <p className="text-xs font-semibold text-white sm:text-sm">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <Link
                href={`/cars/${vehicle.id}`}
                onClick={onView}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                View Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/compare?carA=${vehicle.id}`}
                className="flex h-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/70 transition hover:border-brand/30 hover:text-brand"
              >
                Compare
              </Link>
            </div>
            <button
              onClick={() => setQuoteOpen(true)}
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] py-2.5 text-sm font-medium text-white/50 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </motion.div>

      {quoteOpen && (
        <QuoteModal
          vehicle={{ id: vehicle.id, brand: vehicle.brand, model: vehicle.model, price: vehicle.price }}
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </>
  );
}
