import { SlidersHorizontal, Battery, Car } from "lucide-react";
import type { AllVehiclesFilters, PersonalizedVehicleCard } from "@/types";

interface PremiumFilterSidebarProps {
  filters: AllVehiclesFilters;
  onChange: (f: AllVehiclesFilters) => void;
  vehicles: PersonalizedVehicleCard[];
}

export default function PremiumFilterSidebar({ filters, onChange, vehicles }: PremiumFilterSidebarProps) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-8 hidden lg:flex">
      <div className="flex items-center gap-3 pb-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Filters</h2>
          <p className="text-zinc-500 text-xs">Refine your match across {vehicles.length} EVs</p>
        </div>
      </div>

      {/* Budget Filter */}
      <div>
        <label className="text-white font-semibold text-sm mb-4 block flex justify-between">
          Max Budget 
          <span className="text-emerald-400">£{filters.budgetMax === Number.POSITIVE_INFINITY ? "100k+" : filters.budgetMax?.toLocaleString() ?? "Any"}</span>
        </label>
        <input 
          type="range" 
          min="20000" 
          max="100000" 
          step="5000"
          value={filters.budgetMax === Number.POSITIVE_INFINITY ? 100000 : filters.budgetMax ?? 100000}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange({...filters, budgetMax: val >= 100000 ? Number.POSITIVE_INFINITY : val});
          }}
          className="w-full accent-emerald-500 bg-zinc-800 rounded-lg appearance-none h-2 cursor-pointer"
        />
        <div className="flex justify-between text-zinc-500 text-xs mt-2 font-medium">
          <span>£20k</span>
          <span>£100k+</span>
        </div>
      </div>

      {/* Range Filter */}
      <div>
        <label className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Battery className="w-4 h-4 text-zinc-400" />
          Min Range (km)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 300, 450].map((val) => (
             <button
               key={val}
               onClick={() => onChange({ ...filters, rangeMin: val })}
               className={`py-2 text-xs font-semibold rounded-lg border transition-all ${filters.rangeMin === val ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
             >
               {val === 0 ? "Any" : `${val}+`}
             </button>
          ))}
        </div>
      </div>

      {/* Body Type Filter */}
      <div>
        <label className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Car className="w-4 h-4 text-zinc-400" />
          Body Type
        </label>
        <div className="space-y-2">
          {["suv", "sedan", "hatchback"].map((type) => (
            <label key={type} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
              <input 
                type="radio" 
                name="bodyType"
                checked={filters.bodyType === type}
                onChange={() => onChange({ ...filters, bodyType: type === filters.bodyType ? null : type })}
                className="accent-emerald-500 w-4 h-4 bg-zinc-900 border-white/20"
              />
              <span className="text-sm text-zinc-300 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">Fast Charging Included</span>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">Eligible for Tax Credit</span>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </div>
        </label>
      </div>

      <button 
        onClick={() => onChange({...filters, rangeMin: 0, budgetMax: Number.POSITIVE_INFINITY, bodyType: null})}
        className="w-full py-3 mt-4 text-sm font-bold text-zinc-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-colors border border-white/5"
      >
        Reset Filters
      </button>

    </div>
  );
}
