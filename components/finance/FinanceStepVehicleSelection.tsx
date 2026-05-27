import Image from "next/image";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { getSafeImageSrc } from "./financeUtils";
import type { EVModel } from "@/types";

interface FinanceStepVehicleSelectionProps {
  vehicles: EVModel[];
  query: string;
  onQueryChange: (value: string) => void;
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function FinanceStepVehicleSelection({
  vehicles,
  query,
  onQueryChange,
  selectedVehicleId,
  onSelectVehicle,
  onBack,
  onContinue,
}: FinanceStepVehicleSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Step 2</p>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">Select your EV</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
          Choose the vehicle you want to finance. The price and image come from the same EV data
          source already used across the platform.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by brand or model"
          className="w-full rounded-[1.5rem] border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="max-h-[540px] overflow-y-auto pr-1">
        {vehicles.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <p className="text-lg font-medium text-gray-900">No vehicles match that search.</p>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Try a broader brand or model query and the full EV catalog will reappear.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => {
              const active = vehicle.id === selectedVehicleId;

              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => onSelectVehicle(vehicle.id)}
                  className={`group overflow-hidden rounded-[1.75rem] border text-left transition duration-300 ${
                    active
                      ? "border-emerald-300 bg-emerald-50 shadow-md"
                      : "border-gray-200 bg-white hover:-translate-y-1 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getSafeImageSrc(vehicle.heroImage)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {vehicle.badge ?? "Finance-ready"}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                      {vehicle.brand}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">{vehicle.model}</h3>
                    <p className="mt-4 text-2xl font-semibold text-emerald-600">
                      £{vehicle.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedVehicleId}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to calculator
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
