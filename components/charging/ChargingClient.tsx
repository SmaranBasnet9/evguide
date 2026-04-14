"use client";

import { useState, useMemo, useCallback } from "react";
import ChargingHero from "./ChargingHero";
import ChargingFilters from "./ChargingFilters";
import ChargingResults from "./ChargingResults";
import ChargerDetailsModal from "./ChargerDetailsModal";
import ChargingEmptyState from "./ChargingEmptyState";
import ChargingLoadingState from "./ChargingLoadingState";
import { applyChargingFilters, getUniqueNetworks, hasActiveFilters } from "@/lib/charging/filters";
import { DEFAULT_CHARGING_FILTERS } from "@/lib/charging/types";
import type { ChargerStation, ChargingFilters as FiltersType } from "@/lib/charging/types";
import { trackEvent } from "@/lib/tracking/client";
import { AlertCircle } from "lucide-react";

export default function ChargingClient() {
  const [allStations, setAllStations] = useState<ChargerStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedStation, setSelectedStation] = useState<ChargerStation | null>(null);
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_CHARGING_FILTERS);

  const filteredStations = useMemo(
    () => applyChargingFilters(allStations, filters),
    [allStations, filters]
  );

  const networks = useMemo(() => getUniqueNetworks(allStations), [allStations]);
  const activeFilters = hasActiveFilters(filters);

  const handleSearch = useCallback(
    async (location: string, coords?: { lat: number; lng: number }) => {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setSearchLocation(location);
      setAllStations([]);

      try {
        const qs = new URLSearchParams();
        if (coords) {
          qs.set("lat", coords.lat.toString());
          qs.set("lng", coords.lng.toString());
        } else {
          qs.set("location", location);
        }
        qs.set("radius", filters.radius.toString());

        const res = await fetch(`/api/chargers/nearby?${qs.toString()}`);
        const data = await res.json() as { stations?: ChargerStation[]; error?: string };

        if (!res.ok) throw new Error(data.error ?? "Search failed. Please try again.");

        setAllStations(data.stations ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setAllStations([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.radius]
  );

  function handleFiltersChange(next: FiltersType) {
    // Re-search if radius changed (requires new API call)
    if (next.radius !== filters.radius && hasSearched && searchLocation) {
      setFilters(next);
      void handleSearch(searchLocation);
    } else {
      setFilters(next);
    }
    void trackEvent({ eventType: "charger_filters_applied", eventValue: next as unknown as Record<string, unknown> });
  }

  return (
    <>
      <ChargingHero onSearch={handleSearch} loading={loading} />

      {hasSearched && (
        <div className="mx-auto max-w-screen-xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:items-start">
            {/* Sticky filter sidebar */}
            <aside className="mb-6 lg:mb-0 lg:sticky lg:top-28">
              <ChargingFilters
                filters={filters}
                onChange={handleFiltersChange}
                networks={networks}
              />
            </aside>

            {/* Results area */}
            <div className="min-h-[50vh]">
              {loading ? (
                <ChargingLoadingState />
              ) : error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">Search failed</p>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              ) : filteredStations.length === 0 ? (
                <ChargingEmptyState
                  hasActiveFilters={activeFilters}
                  onClearFilters={() => setFilters(DEFAULT_CHARGING_FILTERS)}
                />
              ) : (
                <ChargingResults
                  stations={filteredStations}
                  totalBeforeFilter={allStations.length}
                  onSelectStation={setSelectedStation}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {selectedStation && (
        <ChargerDetailsModal
          station={selectedStation}
          searchLocation={searchLocation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}
