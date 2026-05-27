"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Battery, Gauge, TrendingUp, X, Zap } from "lucide-react";
import QuoteModal from "@/components/vehicles/QuoteModal";
import EnquiryModal from "@/components/enquiry/EnquiryModal";
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const score = vehicle.recommendationScore;
  const badge =
    score >= 80
      ? { label: "Great deal", color: "border-brand/30 bg-brand/15 text-brand" }
      : score >= 60
      ? { label: "Good match", color: "border-cyan-400/30 bg-cyan-400/10 text-cyan-400" }
      : { label: "Premium", color: "border-gray-300 bg-gray-100 text-gray-500" };

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
        className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-brand/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10),0_0_40px_rgba(31,191,159,0.08)]"
      >
        {/* Corner glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand/20 blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-cyan-500/15 blur-2xl transition-opacity duration-300 opacity-40 group-hover:opacity-80" />

        {/* Image — always visible, click reveals description */}
        <div
          className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden"
          onClick={() => setDescOpen((v) => !v)}
        >
          <Image
            src={
              vehicle.heroImage ||
              "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop"
            }
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${descOpen ? "scale-105" : "scale-100 group-hover:scale-105"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Deal badge — top left */}
          <div className="absolute left-3 top-3 z-10">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${badge.color}`}>
              <TrendingUp className="h-3 w-3" />
              {badge.label}
            </span>
          </div>

          {/* Best for — bottom right (hide when desc open) */}
          {vehicle.bestFor && !descOpen && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                Best for {vehicle.bestFor.toLowerCase()}
              </span>
            </div>
          )}

          {/* Description overlay — slides up on click */}
          <AnimatePresence>
            {descOpen && (
              <motion.div
                key="desc"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/75 to-black/20 p-4"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setDescOpen(false); }}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="text-sm leading-relaxed text-white/85">{vehicle.description}</p>
                <Link
                  href={`/cars/${vehicle.id}`}
                  onClick={(e) => { e.stopPropagation(); onView(); }}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">

          {/* Brand + price row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                {vehicle.brand}
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold text-gray-900">
                {vehicle.model}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-brand">{formatGBP(vehicle.price)}</p>
              <p className="text-xs text-gray-400">
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
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-3"
              >
                <Icon className="mb-1.5 h-3.5 w-3.5 text-brand/70" />
                <p className="text-xs font-semibold text-gray-900 sm:text-sm">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
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
                className="flex h-[42px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 transition hover:border-brand/30 hover:text-brand"
              >
                Compare
              </Link>
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              className="w-full rounded-xl border border-brand/20 bg-brand/8 py-2.5 text-sm font-medium text-brand/80 transition hover:border-brand/40 hover:bg-brand/15 hover:text-brand"
            >
              Make an Enquiry
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
      {enquiryOpen && (
        <EnquiryModal
          context={{ vehicleId: vehicle.id, vehicleLabel: `${vehicle.brand} ${vehicle.model}`, defaultType: "Vehicle Quote" }}
          onClose={() => setEnquiryOpen(false)}
        />
      )}
    </>
  );
}
