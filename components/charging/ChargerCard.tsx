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
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    occupied: {
      label: "In Use",
      icon: <MinusCircle className="h-3.5 w-3.5" />,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    out_of_service: {
      label: "Out of Service",
      icon: <XCircle className="h-3.5 w-3.5" />,
      cls: "bg-red-50 text-red-600 border-red-200",
    },
    unknown: {
      label: "Unknown",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      cls: "bg-[#F8FAF9] text-[#6B7280] border-[#E5E7EB]",
    },
  };
  return map[status];
}

function speedLabel(speed: ChargingSpeed) {
  const map: Record<ChargingSpeed, { label: string; cls: string }> = {
    slow: { label: "Slow", cls: "text-[#6B7280]" },
    fast: { label: "Fast", cls: "text-blue-600" },
    rapid: { label: "Rapid", cls: "text-amber-600" },
    ultra_rapid: { label: "Ultra-Rapid", cls: "text-[#1FBF9F]" },
  };
  return map[speed];
}

export default function ChargerCard({ station, onSelect }: ChargerCardProps) {
  const availability = availabilityBadge(station.availability);
  const speed = speedLabel(station.charging_speed);

  return (
    <div
      className="group relative flex flex-col justify-between rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all hover:border-[#1FBF9F]/40 hover:shadow-md cursor-pointer"
      onClick={() => onSelect(station)}
    >
      {/* Top row: name + availability */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1FBF9F] truncate">
            {station.network}
          </p>
          <h3 className="mt-0.5 text-base font-bold leading-snug text-[#1A1A1A] line-clamp-2">
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
      <div className="mb-4 flex items-start gap-2 text-sm text-[#4B5563]">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1FBF9F]" />
        <span className="line-clamp-2">
          {station.address}, {station.postcode}
          {station.distance_miles !== undefined && (
            <span className="ml-2 font-semibold text-[#1A1A1A]">
              · {station.distance_miles} mi
            </span>
          )}
        </span>
      </div>

      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {/* Power */}
        <div className="rounded-xl bg-[#F8FAF9] p-3 text-center">
          <Zap className="mx-auto mb-1 h-4 w-4 text-[#1FBF9F]" />
          <p className="text-xs font-bold text-[#1A1A1A]">{station.power_kw} kW</p>
          <p className={`text-[10px] font-semibold uppercase tracking-wide ${speed.cls}`}>
            {speed.label}
          </p>
        </div>
        {/* Connectors */}
        <div className="rounded-xl bg-[#F8FAF9] p-3 text-center">
          <div className="mx-auto mb-1 flex h-4 items-center justify-center gap-0.5">
            {station.connector_types.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded bg-[#D1F2EB] px-1 py-0.5 text-[8px] font-bold text-[#1FBF9F]"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs font-bold text-[#1A1A1A]">{station.number_of_connectors}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#374151]">Points</p>
        </div>
        {/* Price */}
        <div className="rounded-xl bg-[#F8FAF9] p-3 text-center">
          <Clock className="mx-auto mb-1 h-4 w-4 text-[#1FBF9F]" />
          <p className="text-xs font-bold text-[#1A1A1A]">
            {station.price_per_kwh !== undefined ? `£${station.price_per_kwh}/kWh` : "N/A"}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#374151]">
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
        className="w-full rounded-xl bg-[#1FBF9F] py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#17A589]"
      >
        View Details
      </button>
    </div>
  );
}
