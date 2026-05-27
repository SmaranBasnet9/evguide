"use client";

import { useState } from "react";
import { MapPin, Search, Loader2, Zap } from "lucide-react";
import { trackEvent } from "@/lib/tracking/client";

interface ChargingHeroProps {
  onSearch: (location: string, coords?: { lat: number; lng: number }) => void;
  loading: boolean;
}

export default function ChargingHero({ onSearch, loading }: ChargingHeroProps) {
  const [query, setQuery] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  function handleManualSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    void trackEvent({ eventType: "charger_search", eventValue: { method: "manual", query } });
    onSearch(query.trim());
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    void trackEvent({ eventType: "charger_location_used" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setQuery("My location");
        onSearch("My location", coords);
      },
      () => {
        setGeoLoading(false);
        setGeoError("Location access denied. Enter a postcode or city below.");
      },
      { timeout: 10000 }
    );
  }

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 hidden h-[300px] w-[500px] rounded-full bg-brand/10 blur-[60px] sm:block" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand">
          <Zap className="h-3.5 w-3.5" />
          EV Charging Map
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Find EV Charging Stations{" "}
          <span className="text-brand">Near You</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
          Discover nearby chargers by location or postcode. Filter by network, speed, and
          availability — then get directions in one tap.
        </p>

        {/* Geo button */}
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={geoLoading || loading}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand/30 hover:text-brand disabled:opacity-60"
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          {geoLoading ? "Getting location…" : "Use My Location"}
        </button>

        {geoError && (
          <p className="mt-3 text-sm text-red-400">{geoError}</p>
        )}

        {/* Manual search */}
        <form onSubmit={handleManualSearch} className="mt-5 flex w-full max-w-xl mx-auto gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Postcode, city or area (e.g. SW1A, Camden)"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </form>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
          {["25+ stations", "Live availability", "Filter by speed & network", "Free to use"].map(
            (t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {t}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
