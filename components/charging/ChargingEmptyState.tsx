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
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[#E5E7EB] bg-white px-8 py-20 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#E8F8F5]">
        {hasActiveFilters ? (
          <SlidersHorizontal className="h-8 w-8 text-[#1FBF9F]" />
        ) : (
          <MapPin className="h-8 w-8 text-[#1FBF9F]" />
        )}
      </div>

      <h3 className="mb-2 text-xl font-bold text-[#1A1A1A]">
        {hasActiveFilters ? "No chargers match your filters" : "No charging stations found nearby"}
      </h3>

      <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-[#4B5563]">
        {hasActiveFilters
          ? "Try relaxing your filters — for example, increase the radius or remove a connector type restriction."
          : "We couldn't find chargers near this location. Try a nearby city or postcode, or increase the search radius."}
      </p>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-xl bg-[#1FBF9F] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#17A589]"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
