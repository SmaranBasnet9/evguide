"use client";

import { MapPin, Zap, Clock, CheckCircle, XCircle, HelpCircle, MinusCircle } from "lucide-react";
import type { ChargerStation, ChargerAvailability, ChargingSpeed } from "@/lib/charging/types";

interface ChargerCardProps {
  station: ChargerStation;
  onSelect: (station: ChargerStation) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function availabilityBadge(status: ChargerAvailability) {
  const map: Record<ChargerAvailability, { label: string; icon: React.ReactNode; cls: string }> = {
    available: {
      label: "Available",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      cls: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    occupied: {
      label: "In Use",
      icon: <MinusCircle className="h-3.5 w-3.5" />,
      cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    out_of_service: {
      label: "Out of Service",
      icon: <XCircle className="h-3.5 w-3.5" />,
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    unknown: {
      label: "Unknown",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      cls: "bg-white/[0.04] text-white/40 border-white/10",
    },
  };
  return map[status];
}

function speedLabel(speed: ChargingSpeed) {
  const map: Record<ChargingSpeed, { label: string; cls: string }> = {
    slow: { label: "Slow", cls: "text-white/35" },
    fast: { label: "Fast", cls: "text-blue-400" },
    rapid: { label: "Rapid", cls: "text-amber-400" },
    ultra_rapid: { label: "Ultra-Rapid", cls: "text-brand" },
  };
  return map[speed];
}

export default function ChargerCard({ station, onSelect }: ChargerCardProps) {
  const availability = availabilityBadge(station.availability);
  const speed = speedLabel(station.charging_speed);

  return (
    <div
      className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.3)] p-6 cursor-pointer transition-all hover:border-brand/30 hover:bg-white/[0.09] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_24px_rgba(31,191,159,0.06)]"
      onClick={() => onSelect(station)}
    >
      {/* Top row: name + availability */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-brand truncate">
            {station.network}
          </p>
          <h3 className="mt-0.5 text-base font-bold leading-snug text-white line-clamp-2">
            {station.name}
          </h3>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${availability.cls}`}
        >
          {availability.icon}
          {availability.label}
        </span>
      </div>

      {/* Address + distance */}
      <div className="mb-4 flex items-start gap-2 text-sm text-white/50">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <span className="line-clamp-2">
          {station.address}, {station.postcode}
          {station.distance_miles !== undefined && (
            <span className="ml-2 font-semibold text-white/70">
              · {station.distance_miles} mi
            </span>
          )}
        </span>
      </div>

      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {/* Power */}
        <div className="rounded-xl bg-white/[0.04] border border-white/6 p-3 text-center">
          <Zap className="mx-auto mb-1 h-4 w-4 text-brand" />
          <p className="text-xs font-bold text-white">{station.power_kw} kW</p>
          <p className={`text-[10px] font-semibold uppercase tracking-wide ${speed.cls}`}>
            {speed.label}
          </p>
        </div>
        {/* Connectors */}
        <div className="rounded-xl bg-white/[0.04] border border-white/6 p-3 text-center">
          <div className="mx-auto mb-1 flex h-4 items-center justify-center gap-0.5">
            {station.connector_types.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded bg-brand/10 px-1 py-0.5 text-[8px] font-bold text-brand"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs font-bold text-white">{station.number_of_connectors}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">Points</p>
        </div>
        {/* Price */}
        <div className="rounded-xl bg-white/[0.04] border border-white/6 p-3 text-center">
          <Clock className="mx-auto mb-1 h-4 w-4 text-brand" />
          <p className="text-xs font-bold text-white">
            {station.price_per_kwh !== undefined ? `£${station.price_per_kwh}/kWh` : "N/A"}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">
            {station.open_24_hours ? "24 Hours" : "Limited hrs"}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(station);
        }}
        className="w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
      >
        View Details
      </button>
    </div>
  );
}
