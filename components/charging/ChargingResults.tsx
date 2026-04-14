import ChargerCard from "./ChargerCard";
import type { ChargerStation } from "@/lib/charging/types";

interface ChargingResultsProps {
  stations: ChargerStation[];
  totalBeforeFilter: number;
  onSelectStation: (station: ChargerStation) => void;
}

export default function ChargingResults({
  stations,
  totalBeforeFilter,
  onSelectStation,
}: ChargingResultsProps) {
  return (
    <div>
      {/* Results count bar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-[#374151]">
          <span className="font-bold text-[#1A1A1A]">{stations.length}</span> charging station
          {stations.length !== 1 ? "s" : ""} found
          {stations.length < totalBeforeFilter && (
            <span className="text-[#6B7280]"> (filtered from {totalBeforeFilter})</span>
          )}
        </p>
        <span className="text-xs text-[#6B7280]">Sorted by distance</span>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stations.map((station) => (
          <ChargerCard key={station.id} station={station} onSelect={onSelectStation} />
        ))}
      </div>
    </div>
  );
}
