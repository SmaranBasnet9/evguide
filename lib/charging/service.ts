// ─────────────────────────────────────────────────────────────────────────────
// Charging Service — Provider Abstraction
//
// This is the single integration point between the API route and data sources.
// To swap providers (e.g. Open Charge Map, Zapmap, PlugShare):
//   1. Create a new file in lib/charging/providers/
//   2. Implement the ChargingProvider interface
//   3. Change the import on line ~14 below — nothing else changes
// ─────────────────────────────────────────────────────────────────────────────

import { mockProvider } from "./providers/mockProvider";
import type { ChargingProvider, ChargingSearchParams, ChargingSearchResult } from "./types";

// ─── Active provider ─────────────────────────────────────────────────────────
// Swap this import when plugging in a real data source.
const activeProvider: ChargingProvider = mockProvider;

export async function searchChargers(
  params: ChargingSearchParams
): Promise<ChargingSearchResult> {
  return activeProvider.search(params);
}

/** Expose provider metadata for debug/logging */
export function getActiveProviderName(): string {
  return activeProvider.name;
}
