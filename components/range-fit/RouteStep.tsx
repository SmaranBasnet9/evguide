"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, ArrowRight, Loader2, Info, MapPin, CheckCircle2, LocateFixed } from "lucide-react";
import type { UserRoute, Season } from "@/lib/range-fit/types";
import type { LocationSuggestion } from "@/lib/range-fit/engine";

interface LocationState {
  input: string;
  resolvedLabel: string;
  lookingUp: boolean;
  error: string;
  suggestions: LocationSuggestion[];
  showSuggestions: boolean;
}

interface RouteInputState {
  label: string;
  from: LocationState;
  to: LocationState;
  distanceMiles: string;
  roundTrip: boolean;
  frequency: UserRoute["frequency"];
  lookupError: string;
}

const blankLoc = (): LocationState => ({
  input: "",
  resolvedLabel: "",
  lookingUp: false,
  error: "",
  suggestions: [],
  showSuggestions: false,
});

const BLANK_ROUTE = (): RouteInputState => ({
  label: "",
  from: blankLoc(),
  to: blankLoc(),
  distanceMiles: "",
  roundTrip: true,
  frequency: "daily",
  lookupError: "",
});

const ROUTE_PRESETS = [
  { label: "Daily commute", frequency: "daily" as const },
  { label: "Weekly shop",   frequency: "weekly" as const },
  { label: "Weekend trip",  frequency: "occasional" as const },
];

const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

const selectCls =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

type GetDistance = (from: string, to: string) => Promise<{ miles: number; fromLabel: string; toLabel: string } | null>;
type ResolveCoords = (lat: number, lng: number) => Promise<{ postcode: string; label: string } | null>;
type SearchSuggestions = (query: string) => Promise<LocationSuggestion[]>;

interface Props {
  onSubmit: (routes: UserRoute[], season: Season) => void;
  loading: boolean;
  getDistance: GetDistance;
  resolveCoords: ResolveCoords;
  searchSuggestions: SearchSuggestions;
}

export default function RouteStep({ onSubmit, loading, getDistance, resolveCoords, searchSuggestions }: Props) {
  const [routes, setRoutes] = useState<RouteInputState[]>([
    { ...BLANK_ROUTE(), label: "Daily commute", frequency: "daily" },
  ]);
  const [season, setSeason] = useState<Season>("average");
  const [error, setError] = useState("");
  const [geoLoadingIdx, setGeoLoadingIdx] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<{ index: number; message: string } | null>(null);
  const suggestTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function updateRoute(i: number, patch: Partial<RouteInputState>) {
    setRoutes((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function updateLoc(i: number, side: "from" | "to", patch: Partial<LocationState>) {
    setRoutes((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, [side]: { ...r[side], ...patch } } : r,
      ),
    );
  }

  function handleLocationInput(i: number, side: "from" | "to", value: string) {
    updateLoc(i, side, { input: value, resolvedLabel: "", error: "", showSuggestions: true });

    const key = `${i}-${side}`;
    if (suggestTimers.current[key]) clearTimeout(suggestTimers.current[key]);

    if (value.trim().length < 2) {
      updateLoc(i, side, { suggestions: [] });
      return;
    }

    suggestTimers.current[key] = setTimeout(async () => {
      const suggestions = await searchSuggestions(value);
      updateLoc(i, side, { suggestions, showSuggestions: true });
    }, 280);
  }

  function selectSuggestion(i: number, side: "from" | "to", suggestion: LocationSuggestion) {
    updateLoc(i, side, {
      input: suggestion.value,
      resolvedLabel: suggestion.label,
      suggestions: [],
      showSuggestions: false,
      error: "",
    });

    const r = routes[i];
    const fromVal = side === "from" ? suggestion.value : r.from.input.trim();
    const toVal = side === "to" ? suggestion.value : r.to.input.trim();
    if (fromVal && toVal) void runLookup(i, fromVal, toVal);
  }

  async function runLookup(i: number, fromInput: string, toInput: string) {
    if (!fromInput || !toInput) return;

    // Mark both as looking up
    setRoutes((prev) =>
      prev.map((route, idx) =>
        idx !== i ? route : {
          ...route,
          from: { ...route.from, lookingUp: true, error: "" },
          to:   { ...route.to,   lookingUp: true, error: "" },
          lookupError: "",
        },
      ),
    );

    const result = await getDistance(fromInput, toInput);

    if (result) {
      setRoutes((prev) =>
        prev.map((route, idx) =>
          idx !== i ? route : {
            ...route,
            from: { ...route.from, resolvedLabel: result.fromLabel, lookingUp: false, error: "" },
            to:   { ...route.to,   resolvedLabel: result.toLabel,   lookingUp: false, error: "" },
            distanceMiles: String(result.miles),
            lookupError: "",
          },
        ),
      );
    } else {
      setRoutes((prev) =>
        prev.map((route, idx) =>
          idx !== i ? route : {
            ...route,
            from: { ...route.from, lookingUp: false },
            to:   { ...route.to,   lookingUp: false },
            lookupError: "Couldn't find one of those locations — check spelling or enter distance manually.",
          },
        ),
      );
    }
  }

  function lookupDistance(i: number) {
    const r = routes[i];
    return runLookup(i, r.from.input.trim(), r.to.input.trim());
  }

  function fillMyLocation(i: number) {
    if (!navigator.geolocation) {
      setGeoError({ index: i, message: "Geolocation isn't supported by your browser — enter your postcode or town instead." });
      return;
    }
    setGeoLoadingIdx(i);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await resolveCoords(latitude, longitude);
        setGeoLoadingIdx(null);
        if (!resolved) {
          setGeoError({ index: i, message: "Couldn't pin down your location — enter your postcode or town instead." });
          return;
        }
        updateLoc(i, "from", { input: resolved.postcode, resolvedLabel: resolved.label, error: "" });
        const toInput = routes[i].to.input.trim();
        if (toInput) void runLookup(i, resolved.postcode, toInput);
      },
      () => {
        setGeoLoadingIdx(null);
        setGeoError({ index: i, message: "Location access denied — enter your postcode or town instead." });
      },
      { timeout: 10000 },
    );
  }

  function addRoute() {
    if (routes.length >= 3) return;
    setRoutes((prev) => [...prev, { ...BLANK_ROUTE(), label: ROUTE_PRESETS[prev.length]?.label ?? "Route" }]);
  }

  function removeRoute(i: number) {
    setRoutes((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const valid = routes.filter((r) => r.distanceMiles && Number(r.distanceMiles) > 0);
    if (!valid.length) {
      setError("Add at least one route with a distance.");
      return;
    }

    const userRoutes: UserRoute[] = valid.map((r) => ({
      label: r.label || "Route",
      fromPostcode: r.from.resolvedLabel || r.from.input,
      toPostcode:   r.to.resolvedLabel   || r.to.input,
      distanceMiles: Number(r.distanceMiles),
      roundTrip: r.roundTrip,
      frequency: r.frequency,
    }));

    onSubmit(userRoutes, season);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Range Confidence Score™</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
          Does this EV fit your life?
        </h1>
        <p className="mt-3 text-base text-gray-500">
          Enter your real routes. We&apos;ll show you which EVs handle them — and which don&apos;t.
        </p>
      </div>

      {/* Routes */}
      <div className="space-y-5">
        {routes.map((r, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4 shadow-sm">
            {/* Route header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-black text-brand">
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={r.label}
                  onChange={(e) => updateRoute(i, { label: e.target.value })}
                  placeholder="Route name (e.g. Daily commute)"
                  className="bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              {routes.length > 1 && (
                <button type="button" onClick={() => removeRoute(i)} className="text-gray-400 transition hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* From / To inputs */}
            <div className="grid grid-cols-2 gap-3">
              {(["from", "to"] as const).map((side) => {
                const loc = r[side];
                return (
                  <div key={side} className="relative">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        <MapPin className="h-2.5 w-2.5" />
                        {side === "from" ? "From" : "To"}
                        {loc.lookingUp && <Loader2 className="h-3 w-3 animate-spin text-brand ml-1" />}
                      </label>
                      {side === "from" && (
                        <button
                          type="button"
                          onClick={() => fillMyLocation(i)}
                          disabled={geoLoadingIdx === i}
                          className="flex items-center gap-1 text-[10px] font-semibold text-brand transition hover:text-brand-hover disabled:opacity-50"
                        >
                          {geoLoadingIdx === i ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <LocateFixed className="h-3 w-3" />
                          )}
                          Use my location
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={loc.input}
                      onChange={(e) => handleLocationInput(i, side, e.target.value)}
                      onFocus={() => {
                        if (loc.suggestions.length > 0) updateLoc(i, side, { showSuggestions: true });
                      }}
                      onBlur={() => {
                        updateLoc(i, side, { showSuggestions: false });
                        if (r.from.input.trim() && r.to.input.trim()) lookupDistance(i);
                      }}
                      placeholder={side === "from" ? "e.g. Manchester or M1 1AE" : "e.g. Sheffield or S1 2HH"}
                      className={inputCls}
                      autoComplete="off"
                    />

                    {/* Autocomplete dropdown — Uber/Google-style suggestions as you type */}
                    {loc.showSuggestions && loc.suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                        {loc.suggestions.map((s, si) => (
                          <button
                            key={`${s.value}-${si}`}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectSuggestion(i, side, s)}
                            className="flex w-full items-center gap-2 border-b border-gray-100 px-3.5 py-2.5 text-left text-sm transition last:border-b-0 hover:bg-brand/5"
                          >
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <span className="flex-1 truncate">
                              <span className="font-medium text-gray-900">{s.label}</span>
                              {s.sub && <span className="ml-1.5 text-[11px] text-gray-400">{s.sub}</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {loc.resolvedLabel && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> {loc.resolvedLabel}
                      </p>
                    )}
                    {loc.error && (
                      <p className="mt-1 text-[10px] text-red-500">{loc.error}</p>
                    )}
                    {side === "from" && geoError?.index === i && (
                      <p className="mt-1 text-[10px] text-amber-600">{geoError.message}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hint */}
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Info className="h-3 w-3 shrink-0" />
              Tap &quot;Use my location&quot; to fill in your starting point automatically, or type a city, town, village or UK postcode — distance is calculated for you
            </p>

            {r.lookupError && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {r.lookupError}
              </p>
            )}

            {/* Distance + options row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={r.distanceMiles}
                  onChange={(e) => updateRoute(i, { distanceMiles: e.target.value })}
                  placeholder="Auto or enter"
                  className={inputCls}
                />
                {r.distanceMiles && !r.lookupError && (
                  <p className="mt-1 text-[10px] text-brand font-semibold">✓ ~{r.distanceMiles} miles</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  How often?
                </label>
                <select
                  value={r.frequency}
                  onChange={(e) => updateRoute(i, { frequency: e.target.value as UserRoute["frequency"] })}
                  className={selectCls}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="occasional">Occasional</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Journey type
                </label>
                <select
                  value={r.roundTrip ? "round" : "one"}
                  onChange={(e) => updateRoute(i, { roundTrip: e.target.value === "round" })}
                  className={selectCls}
                >
                  <option value="round">Round trip</option>
                  <option value="one">One way</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {routes.length < 3 && (
          <button
            type="button"
            onClick={addRoute}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-400 transition hover:border-brand/50 hover:text-brand"
          >
            <Plus className="h-4 w-4" />
            Add another route (up to 3)
          </button>
        )}
      </div>

      {/* Season selector */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Which season matters most to you?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["summer", "average", "winter"] as Season[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeason(s)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 transition ${
                season === s
                  ? "border-brand bg-brand/8 text-brand"
                  : "border-gray-200 bg-white text-gray-500 hover:border-brand/30 hover:text-brand"
              }`}
            >
              <span className="text-xl">{s === "summer" ? "☀️" : s === "average" ? "🌤️" : "❄️"}</span>
              <span className="text-xs font-bold capitalize">{s}</span>
              <span className="text-[9px] text-center opacity-60 leading-tight">
                {s === "summer" ? "Best case" : s === "average" ? "Realistic" : "Worst case"}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="h-3 w-3" />
          Winter range can be 25–35% less than summer due to UK cold and heating
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Analysing your routes…</>
        ) : (
          <>Find my perfect EV <ArrowRight className="h-5 w-5" /></>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        We compare every EV in our catalogue against your exact routes. No account needed.
      </p>
    </form>
  );
}
