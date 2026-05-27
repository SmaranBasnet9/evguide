"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { ChargingFilters as FiltersType, ConnectorType } from "@/lib/charging/types";
import { DEFAULT_CHARGING_FILTERS } from "@/lib/charging/types";
import { hasActiveFilters } from "@/lib/charging/filters";

interface ChargingFiltersProps {
  filters: FiltersType;
  onChange: (next: FiltersType) => void;
  networks: string[];
}

const CONNECTOR_OPTIONS: ConnectorType[] = ["CCS", "CHAdeMO", "Type2", "Type1", "NACS", "3-Pin"];

const SPEED_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "7kW+ (slow)", value: 7 },
  { label: "22kW+ (fast)", value: 22 },
  { label: "50kW+ (rapid)", value: 50 },
  { label: "150kW+ (ultra-rapid)", value: 150 },
];

const RADIUS_OPTIONS = [2, 5, 10, 20, 50];

export default function ChargingFilters({ filters, onChange, networks }: ChargingFiltersProps) {
  const active = hasActiveFilters(filters);

  function set<K extends keyof FiltersType>(key: K, value: FiltersType[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="w-full rounded-[2rem] border border-gray-200 bg-gray-100 backdrop-blur-sm p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
          <SlidersHorizontal className="h-4 w-4 text-brand" />
          Filters
        </div>
        {active && (
          <button
            onClick={() => onChange(DEFAULT_CHARGING_FILTERS)}
            className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-400 transition hover:bg-brand/10 hover:text-brand"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Radius */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Distance
          </label>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => set("radius", r)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  filters.radius === r
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-brand/30"
                }`}
              >
                {r} mi
              </button>
            ))}
          </div>
        </div>

        {/* Network */}
        {networks.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Network
            </label>
            <select
              value={filters.network}
              onChange={(e) => set("network", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="">All networks</option>
              {networks.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Connector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Connector
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => set("connector", "")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                !filters.connector
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-brand/30"
              }`}
            >
              Any
            </button>
            {CONNECTOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => set("connector", c)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  filters.connector === c
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-brand/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum speed */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Min. Charging Speed
          </label>
          <div className="flex flex-wrap gap-2">
            {SPEED_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => set("minPower", value)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  filters.minPower === value
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-brand/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {(
            [
              { key: "availableNow", label: "Available now" },
              { key: "open24Hours", label: "Open 24 hours" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <span className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={filters[key]}
                  onChange={(e) => set(key, e.target.checked)}
                />
                <span className="block h-5 w-9 rounded-full bg-gray-200 transition peer-checked:bg-brand" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
