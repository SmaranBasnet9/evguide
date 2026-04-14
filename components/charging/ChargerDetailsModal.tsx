"use client";

import { useEffect } from "react";
import {
  X,
  MapPin,
  Zap,
  Clock,
  Navigation,
  CheckCircle,
  XCircle,
  MinusCircle,
  HelpCircle,
  Wifi,
  Coffee,
  ShoppingBag,
} from "lucide-react";
import type { ChargerStation, ChargerAvailability } from "@/lib/charging/types";
import { trackEvent } from "@/lib/tracking/client";
import { logChargerClick } from "@/lib/charging/logging";

interface ChargerDetailsModalProps {
  station: ChargerStation;
  searchLocation?: string;
  onClose: () => void;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function AvailabilityIcon({ status }: { status: ChargerAvailability }) {
  const map: Record<ChargerAvailability, { icon: React.ReactNode; label: string; cls: string }> = {
    available: { icon: <CheckCircle className="h-5 w-5" />, label: "Available", cls: "text-green-600" },
    occupied: { icon: <MinusCircle className="h-5 w-5" />, label: "In Use", cls: "text-amber-600" },
    out_of_service: { icon: <XCircle className="h-5 w-5" />, label: "Out of Service", cls: "text-red-500" },
    unknown: { icon: <HelpCircle className="h-5 w-5" />, label: "Unknown", cls: "text-[#6B7280]" },
  };
  const { icon, label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${cls}`}>
      {icon} {label}
    </span>
  );
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3.5 w-3.5" />,
  "Food & Drink": <Coffee className="h-3.5 w-3.5" />,
  Shopping: <ShoppingBag className="h-3.5 w-3.5" />,
};

function AmenityPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAF9] px-3 py-1.5 text-xs font-medium text-[#374151]">
      {AMENITY_ICONS[label] ?? <span className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────

export default function ChargerDetailsModal({
  station,
  searchLocation,
  onClose,
}: ChargerDetailsModalProps) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    void trackEvent({ eventType: "charger_details_viewed", eventValue: { charger_id: station.id, network: station.network } });
    void logChargerClick({
      charger_id: station.id,
      charger_name: station.name,
      network: station.network,
      searched_location: searchLocation,
    });
    return () => { document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDirections() {
    void trackEvent({ eventType: "charger_directions_clicked", eventValue: { charger_id: station.id } });
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E5E7EB] bg-white px-6 py-5 rounded-t-[2rem] sm:rounded-t-[2rem]">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1FBF9F]">
              {station.network}
            </p>
            <h2 className="mt-0.5 text-lg font-extrabold leading-tight text-[#1A1A1A]">
              {station.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-[#E5E7EB] p-2 text-[#6B7280] transition hover:bg-[#E8F8F5] hover:text-[#1FBF9F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Address + status */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-[#4B5563]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1FBF9F]" />
              <div>
                <p>{station.address}</p>
                <p>{station.city}, {station.postcode}</p>
                {station.distance_miles !== undefined && (
                  <p className="mt-0.5 font-semibold text-[#1A1A1A]">{station.distance_miles} miles away</p>
                )}
              </div>
            </div>
            <AvailabilityIcon status={station.availability} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-4 text-center">
              <Zap className="mx-auto mb-2 h-5 w-5 text-[#1FBF9F]" />
              <p className="text-lg font-bold text-[#1A1A1A]">{station.power_kw} kW</p>
              <p className="text-xs font-medium uppercase text-[#374151]">Max Power</p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-4 text-center">
              <p className="text-lg font-bold text-[#1A1A1A]">{station.number_of_connectors}</p>
              <p className="text-xs font-medium uppercase text-[#374151]">Points</p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-4 text-center">
              <p className="text-lg font-bold text-[#1A1A1A]">
                {station.price_per_kwh !== undefined ? `£${station.price_per_kwh}` : "—"}
              </p>
              <p className="text-xs font-medium uppercase text-[#374151]">per kWh</p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-4 text-center">
              <Clock className="mx-auto mb-2 h-5 w-5 text-[#1FBF9F]" />
              <p className="text-sm font-bold text-[#1A1A1A]">
                {station.open_24_hours ? "24 / 7" : "Limited"}
              </p>
              <p className="text-xs font-medium uppercase text-[#374151]">Hours</p>
            </div>
          </div>

          {/* Connector types */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#374151]">
              Connector Types
            </p>
            <div className="flex flex-wrap gap-2">
              {station.connector_types.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#D1F2EB] bg-[#E8F8F5] px-3 py-1 text-xs font-bold text-[#1FBF9F]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {station.amenities && station.amenities.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#374151]">
                Nearby Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {station.amenities.map((a) => (
                  <AmenityPill key={a} label={a} />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {station.notes && (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF9] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#374151]">Notes</p>
              <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{station.notes}</p>
            </div>
          )}

          {/* Last updated */}
          {station.last_updated && (
            <p className="text-xs text-[#6B7280]">
              Last updated:{" "}
              {new Date(station.last_updated).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-white px-6 py-4">
          <button
            onClick={openDirections}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1FBF9F] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#17A589]"
          >
            <Navigation className="h-4 w-4" />
            Get Directions (Google Maps)
          </button>
        </div>
      </div>
    </div>
  );
}
