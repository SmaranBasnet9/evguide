"use client";

import { Battery, Car, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { AllVehiclesFilters, PersonalizedVehicleCard } from "@/types";

interface PremiumFilterSidebarProps {
  filters: AllVehiclesFilters;
  onChange: (f: AllVehiclesFilters) => void;
  vehicles: PersonalizedVehicleCard[];
}

const RANGE_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "300+ km", value: 300 },
  { label: "450+ km", value: 450 },
];

const BODY_TYPES = ["SUV", "Sedan", "Hatchback"];

export default function PremiumFilterSidebar({ filters, onChange, vehicles }: PremiumFilterSidebarProps) {
  const budgetVal = filters.budgetMax === Number.POSITIVE_INFINITY ? 100000 : (filters.budgetMax ?? 100000);
  const hasActiveFilters =
    filters.budgetMax !== Number.POSITIVE_INFINITY || (filters.rangeMin ?? 0) > 0 || !!filters.bodyType;

  return (
    <div className="flex flex-col gap-7 rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/25 bg-brand/10">
            <SlidersHorizontal className="h-4 w-4 text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Filters</p>
            <p className="text-[11px] text-gray-500">{vehicles.length} EVs</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ ...filters, rangeMin: 0, budgetMax: Number.POSITIVE_INFINITY, bodyType: null })}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-medium text-gray-400 transition hover:border-gray-300 hover:text-gray-900"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Budget */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Max Budget</p>
          <span className="text-sm font-semibold text-brand">
            {budgetVal >= 100000 ? "£100k+" : `£${(budgetVal / 1000).toFixed(0)}k`}
          </span>
        </div>
        <input
          type="range"
          min="20000"
          max="100000"
          step="5000"
          value={budgetVal}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange({ ...filters, budgetMax: val >= 100000 ? Number.POSITIVE_INFINITY : val });
          }}
          className="w-full cursor-pointer accent-brand"
          style={{
            background: `linear-gradient(to right, #1FBF9F ${((budgetVal - 20000) / 80000) * 100}%, #e5e7eb ${((budgetVal - 20000) / 80000) * 100}%)`,
            height: "4px",
            borderRadius: "999px",
            appearance: "none",
          }}
        />
        <div className="mt-2 flex justify-between text-[11px] text-gray-400">
          <span>£20k</span>
          <span>£100k+</span>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Range */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Battery className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">Min Range</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RANGE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onChange({ ...filters, rangeMin: value })}
              className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                filters.rangeMin === value
                  ? "border border-brand/30 bg-brand/15 text-brand"
                  : "border border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Body type */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">Body Type</p>
        </div>
        <div className="space-y-1.5">
          {BODY_TYPES.map((type) => {
            const val = type.toLowerCase();
            const active = filters.bodyType === val;
            return (
              <button
                key={type}
                onClick={() => onChange({ ...filters, bodyType: active ? null : val })}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all ${
                  active
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {type}
                {active && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Quick toggles */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Quick filters</p>
        {[
          { label: "Fast Charging", sub: "50+ kW DC" },
          { label: "V2G Capable", sub: "Vehicle-to-grid" },
        ].map(({ label, sub }) => (
          <div key={label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
            </div>
            <button
              type="button"
              className="relative h-6 w-11 rounded-full border border-gray-200 bg-gray-100 transition-colors"
              aria-label={label}
            >
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-gray-400 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
