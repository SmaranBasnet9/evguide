import { MapPin, SlidersHorizontal } from "lucide-react";

interface ChargingEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ChargingEmptyState({
  hasActiveFilters,
  onClearFilters,
}: ChargingEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-200 bg-gray-50 backdrop-blur-sm px-8 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-brand/10">
        {hasActiveFilters ? (
          <SlidersHorizontal className="h-8 w-8 text-brand" />
        ) : (
          <MapPin className="h-8 w-8 text-brand" />
        )}
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {hasActiveFilters ? "No chargers match your filters" : "No charging stations found nearby"}
      </h3>

      <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-400">
        {hasActiveFilters
          ? "Try relaxing your filters — for example, increase the radius or remove a connector type restriction."
          : "We couldn't find chargers near this location. Try a nearby city or postcode, or increase the search radius."}
      </p>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-xl bg-brand px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-hover"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
