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
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Step 2</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Select your EV</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Choose the vehicle you want to finance. The price and image come from the same EV data
          source already used across the platform.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by brand or model"
          className="w-full rounded-[1.5rem] border border-white/10 bg-[#0A1013] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-400/35"
        />
      </div>

      <div className="max-h-[540px] overflow-y-auto pr-1">
        {vehicles.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
            <p className="text-lg font-medium text-white">No vehicles match that search.</p>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
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
                      ? "border-emerald-400/35 bg-emerald-400/10 shadow-[0_20px_40px_rgba(16,185,129,0.12)]"
                      : "border-white/8 bg-black/20 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getSafeImageSrc(vehicle.heroImage)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {vehicle.badge ?? "Finance-ready"}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      {vehicle.brand}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{vehicle.model}</h3>
                    <p className="mt-4 text-2xl font-semibold text-emerald-300">
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
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedVehicleId}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to calculator
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
