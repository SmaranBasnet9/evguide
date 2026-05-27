"use client";

import { useCallback } from "react";
import { trackEvent } from "@/lib/tracking/client";
import { SORT_OPTIONS } from "@/lib/vehicles/sort";
import type { AllVehiclesSortOption } from "@/types";

type Props = {
  value: AllVehiclesSortOption;
  onChange: (v: AllVehiclesSortOption) => void;
  totalCount: number;
  filteredCount: number;
};

export default function VehicleSort({ value, onChange, totalCount, filteredCount }: Props) {
  const handleChange = useCallback(
    (next: AllVehiclesSortOption) => {
      onChange(next);
      void trackEvent({ eventType: "sort_changed", eventValue: { sort: next } });
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{filteredCount}</span>
        {filteredCount !== totalCount && (
          <span className="text-gray-400"> of {totalCount}</span>
        )}{" "}
        vehicles
      </p>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value as AllVehiclesSortOption)}
        className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
