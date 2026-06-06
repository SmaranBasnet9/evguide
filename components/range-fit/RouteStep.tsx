"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, ArrowRight, Loader2, Info } from "lucide-react";
import type { UserRoute, Season } from "@/lib/range-fit/types";

interface RouteInputState {
  label: string;
  fromPostcode: string;
  toPostcode: string;
  distanceMiles: string;
  roundTrip: boolean;
  frequency: UserRoute["frequency"];
  lookingUp: boolean;
  lookupError: string;
}

const BLANK_ROUTE = (): RouteInputState => ({
  label: "",
  fromPostcode: "",
  toPostcode: "",
  distanceMiles: "",
  roundTrip: true,
  frequency: "daily",
  lookingUp: false,
  lookupError: "",
});

const ROUTE_PRESETS = [
  { label: "Daily commute", frequency: "daily" as const },
  { label: "Weekly shop", frequency: "weekly" as const },
  { label: "Weekend trip", frequency: "occasional" as const },
];

interface Props {
  onSubmit: (routes: UserRoute[], season: Season) => void;
  loading: boolean;
  getDistance: (from: string, to: string) => Promise<number | null>;
}

export default function RouteStep({ onSubmit, loading, getDistance }: Props) {
  const [routes, setRoutes] = useState<RouteInputState[]>([
    { ...BLANK_ROUTE(), label: "Daily commute", frequency: "daily" },
  ]);
  const [season, setSeason] = useState<Season>("average");
  const [error, setError] = useState("");

  function updateRoute(i: number, patch: Partial<RouteInputState>) {
    setRoutes((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function lookupDistance(i: number) {
    const r = routes[i];
    if (!r.fromPostcode || !r.toPostcode) return;
    updateRoute(i, { lookingUp: true, lookupError: "" });
    const miles = await getDistance(r.fromPostcode, r.toPostcode);
    if (miles) {
      updateRoute(i, { distanceMiles: String(miles), lookingUp: false });
    } else {
      updateRoute(i, {
        lookingUp: false,
        lookupError: "Couldn't look up those postcodes — enter distance manually.",
      });
    }
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

    const valid = routes.filter(
      (r) => r.distanceMiles && Number(r.distanceMiles) > 0,
    );
    if (!valid.length) {
      setError("Add at least one route with a distance.");
      return;
    }

    const userRoutes: UserRoute[] = valid.map((r) => ({
      label: r.label || "Route",
      fromPostcode: r.fromPostcode,
      toPostcode: r.toPostcode,
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
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          Does this EV fit your life?
        </h1>
        <p className="mt-3 text-base text-white/50">
          Enter your real routes. We&apos;ll show you which EVs handle them — and which don&apos;t.
        </p>
      </div>

      {/* Routes */}
      <div className="space-y-5">
        {routes.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4"
          >
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
                  className="bg-transparent text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
              {routes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoute(i)}
                  className="text-white/30 transition hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Postcode row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  From postcode
                </label>
                <input
                  type="text"
                  value={r.fromPostcode}
                  onChange={(e) => updateRoute(i, { fromPostcode: e.target.value.toUpperCase() })}
                  onBlur={() => lookupDistance(i)}
                  placeholder="e.g. M1 1AE"
                  className="w-full rounded-xl border border-white/10 bg-[#1f2937] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  To postcode
                </label>
                <input
                  type="text"
                  value={r.toPostcode}
                  onChange={(e) => updateRoute(i, { toPostcode: e.target.value.toUpperCase() })}
                  onBlur={() => lookupDistance(i)}
                  placeholder="e.g. S1 2HH"
                  className="w-full rounded-xl border border-white/10 bg-[#1f2937] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Distance + options row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Distance (miles)
                  {r.lookingUp && <Loader2 className="h-3 w-3 animate-spin text-brand" />}
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={r.distanceMiles}
                  onChange={(e) => updateRoute(i, { distanceMiles: e.target.value })}
                  placeholder="e.g. 35"
                  className="w-full rounded-xl border border-white/10 bg-[#1f2937] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none [color-scheme:dark]"
                />
                {r.lookupError && (
                  <p className="mt-1 text-[10px] text-amber-400">{r.lookupError}</p>
                )}
                {r.distanceMiles && !r.lookupError && r.fromPostcode && (
                  <p className="mt-1 text-[10px] text-brand">✓ ~{r.distanceMiles} miles</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  How often?
                </label>
                <select
                  value={r.frequency}
                  onChange={(e) => updateRoute(i, { frequency: e.target.value as UserRoute["frequency"] })}
                  className="w-full rounded-xl border border-white/10 bg-[#1f2937] px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none [color-scheme:dark] [&>option]:bg-[#1f2937]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="occasional">Occasional</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Journey type
                </label>
                <select
                  value={r.roundTrip ? "round" : "one"}
                  onChange={(e) => updateRoute(i, { roundTrip: e.target.value === "round" })}
                  className="w-full rounded-xl border border-white/10 bg-[#1f2937] px-3 py-2.5 text-sm text-white focus:border-brand focus:outline-none [color-scheme:dark] [&>option]:bg-[#1f2937]"
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-3 text-sm font-semibold text-white/40 transition hover:border-brand/40 hover:text-brand"
          >
            <Plus className="h-4 w-4" />
            Add another route (up to 3)
          </button>
        )}
      </div>

      {/* Season selector */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-white/70">
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
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <span className="text-xl">
                {s === "summer" ? "☀️" : s === "average" ? "🌤️" : "❄️"}
              </span>
              <span className="text-xs font-bold capitalize">{s}</span>
              <span className="text-[9px] text-center opacity-60 leading-tight">
                {s === "summer" ? "Best case" : s === "average" ? "Realistic" : "Worst case"}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/35">
          <Info className="h-3 w-3" />
          Winter range can be 25–35% less than summer due to UK cold and heating
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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

      <p className="text-center text-xs text-white/25">
        We compare every EV in our catalogue against your exact routes. No account needed.
      </p>
    </form>
  );
}
