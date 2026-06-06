/**
 * EVIntelligenceBadges
 *
 * Compact EV-native data badges for vehicle cards and detail pages.
 * Replaces generic "Fuel: Electric" with real EV intelligence:
 *   - Real-world range in miles
 *   - DC fast charge speed (kW)
 *   - AC home charge speed
 *   - Charge port type
 *   - V2G capability
 *   - Battery warranty
 *
 * Usage: import and place on vehicle cards or detail pages.
 */

import { Zap, Home, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import type { EVModel } from "@/types";
import { dcChargingLabel } from "@/lib/ev-intelligence";

interface Props {
  vehicle: Pick<
    EVModel,
    | "rangeKm"
    | "batteryKWh"
    | "realWorldRangeMiles"
    | "chargingSpeedAcKw"
    | "chargingSpeedDcKw"
    | "chargePortType"
    | "chargeTimeTo80Mins"
    | "batteryWarrantyYears"
    | "v2gCapable"
    | "annualEnergyCostGbp"
  >;
  variant?: "card" | "detail";
}

export default function EVIntelligenceBadges({ vehicle, variant = "card" }: Props) {
  const realWorldMiles =
    vehicle.realWorldRangeMiles ?? Math.round(vehicle.rangeKm * 0.621371 * 0.82);

  const isDetail = variant === "detail";

  if (isDetail) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Real-world range */}
        <IntelBadge
          icon={<span className="text-base">🔋</span>}
          label="Real-world range"
          value={`${realWorldMiles} mi`}
          sub="Typical UK conditions"
          color="blue"
        />

        {/* DC fast charge */}
        {vehicle.chargingSpeedDcKw && (
          <IntelBadge
            icon={<Zap className="h-4 w-4 text-yellow-600" />}
            label="Rapid charging"
            value={`${vehicle.chargingSpeedDcKw} kW`}
            sub={dcChargingLabel(vehicle.chargingSpeedDcKw)}
            color="yellow"
          />
        )}

        {/* AC home charge */}
        {vehicle.chargingSpeedAcKw && (
          <IntelBadge
            icon={<Home className="h-4 w-4 text-emerald-600" />}
            label="Home charging"
            value={`${vehicle.chargingSpeedAcKw} kW`}
            sub="Wallbox compatible"
            color="emerald"
          />
        )}

        {/* Charge time */}
        {vehicle.chargeTimeTo80Mins && (
          <IntelBadge
            icon={<Clock className="h-4 w-4 text-violet-600" />}
            label="10→80% time"
            value={`${vehicle.chargeTimeTo80Mins} min`}
            sub="DC rapid charger"
            color="violet"
          />
        )}

        {/* Battery warranty */}
        {vehicle.batteryWarrantyYears && (
          <IntelBadge
            icon={<ShieldCheck className="h-4 w-4 text-blue-600" />}
            label="Battery warranty"
            value={`${vehicle.batteryWarrantyYears} years`}
            sub="Manufacturer guarantee"
            color="blue"
          />
        )}

        {/* V2G */}
        {vehicle.v2gCapable && (
          <IntelBadge
            icon={<RefreshCw className="h-4 w-4 text-teal-600" />}
            label="Vehicle-to-Grid"
            value="V2G Ready"
            sub="Export power to home"
            color="teal"
          />
        )}

        {/* Annual energy cost */}
        {vehicle.annualEnergyCostGbp && (
          <IntelBadge
            icon={<Zap className="h-4 w-4" />}
            label="Annual energy cost"
            value={`£${Math.round(vehicle.annualEnergyCostGbp)}`}
            sub="At 7,500 mi, 28p/kWh"
            color="emerald"
          />
        )}
      </div>
    );
  }

  // Card variant — compact inline row
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        🔋 {realWorldMiles} mi real range
      </span>
      {vehicle.chargingSpeedDcKw && (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
          <Zap className="h-3 w-3" />
          {vehicle.chargingSpeedDcKw} kW DC
        </span>
      )}
      {vehicle.chargePortType && (
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
          {vehicle.chargePortType}
        </span>
      )}
      {vehicle.v2gCapable && (
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
          V2G
        </span>
      )}
    </div>
  );
}

// ── Inner sub-component ───────────────────────────────────────

type BadgeColor = "blue" | "yellow" | "emerald" | "violet" | "teal";

const colorMap: Record<BadgeColor, { bg: string; icon: string; value: string }> = {
  blue:    { bg: "bg-blue-50 border-blue-200",     icon: "text-blue-600",    value: "text-blue-700" },
  yellow:  { bg: "bg-yellow-50 border-yellow-200", icon: "text-yellow-600",  value: "text-yellow-700" },
  emerald: { bg: "bg-emerald-50 border-emerald-200", icon: "text-emerald-600", value: "text-emerald-700" },
  violet:  { bg: "bg-violet-50 border-violet-200", icon: "text-violet-600",  value: "text-violet-700" },
  teal:    { bg: "bg-teal-50 border-teal-200",     icon: "text-teal-600",    value: "text-teal-700" },
};

function IntelBadge({
  icon,
  label,
  value,
  sub,
  color = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color?: BadgeColor;
}) {
  const c = colorMap[color];
  return (
    <div className={`rounded-xl border p-3 ${c.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={c.icon}>{icon}</span>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className={`text-lg font-bold ${c.value}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  );
}
