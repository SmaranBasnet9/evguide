// ─────────────────────────────────────────────────────────────────────────────
// Client-side filter function
// Applied after the API response lands — matches the pattern used in
// lib/vehicles/filter.ts so the frontend can re-filter without extra API calls.
// ─────────────────────────────────────────────────────────────────────────────

import type { ChargerStation, ChargingFilters } from "./types";

export function applyChargingFilters(
  stations: ChargerStation[],
  filters: ChargingFilters
): ChargerStation[] {
  return stations.filter((s) => {
    if (filters.network && !s.network.toLowerCase().includes(filters.network.toLowerCase())) {
      return false;
    }
    if (
      filters.connector &&
      !s.connector_types.includes(filters.connector as ChargerStation["connector_types"][number])
    ) {
      return false;
    }
    if (filters.minPower > 0 && s.power_kw < filters.minPower) {
      return false;
    }
    if (
      filters.maxPrice > 0 &&
      s.price_per_kwh !== undefined &&
      s.price_per_kwh > filters.maxPrice
    ) {
      return false;
    }
    if (filters.availableNow && s.availability !== "available") {
      return false;
    }
    if (filters.open24Hours && !s.open_24_hours) {
      return false;
    }
    return true;
  });
}

/** Derive unique network names from a station list — used to populate filter dropdowns */
export function getUniqueNetworks(stations: ChargerStation[]): string[] {
  return Array.from(new Set(stations.map((s) => s.network))).sort();
}

/** Check whether any non-default filters are active */
export function hasActiveFilters(filters: ChargingFilters): boolean {
  return (
    !!filters.network ||
    !!filters.connector ||
    filters.minPower > 0 ||
    filters.maxPrice > 0 ||
    filters.availableNow ||
    filters.open24Hours
  );
}
