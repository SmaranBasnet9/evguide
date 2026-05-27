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
        <p className="text-sm font-medium text-gray-500">
          <span className="font-bold text-gray-900">{stations.length}</span> charging station
          {stations.length !== 1 ? "s" : ""} found
          {stations.length < totalBeforeFilter && (
            <span className="text-gray-400"> (filtered from {totalBeforeFilter})</span>
          )}
        </p>
        <span className="text-xs text-gray-400">Sorted by distance</span>
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
