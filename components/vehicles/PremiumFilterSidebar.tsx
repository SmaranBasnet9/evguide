import { SlidersHorizontal, Battery, Car } from "lucide-react";
import type { AllVehiclesFilters, PersonalizedVehicleCard } from "@/types";

interface PremiumFilterSidebarProps {
  filters: AllVehiclesFilters;
  onChange: (f: AllVehiclesFilters) => void;
  vehicles: PersonalizedVehicleCard[];
}

export default function PremiumFilterSidebar({ filters, onChange, vehicles }: PremiumFilterSidebarProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[2rem] p-6 shadow-sm flex flex-col gap-8 hidden lg:flex">
      <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB]">
        <div className="w-10 h-10 rounded-xl bg-[#E8F8F5] border border-[#D1F2EB] flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-[#1FBF9F]" />
        </div>
        <div>
          <h2 className="text-[#1A1A1A] font-bold text-lg">Filters</h2>
          <p className="text-[#4B5563] text-xs">Refine your match across {vehicles.length} EVs</p>
        </div>
      </div>

      {/* Budget Filter */}
      <div>
        <label className="text-[#1A1A1A] font-semibold text-sm mb-4 block flex justify-between">
          Max Budget
          <span className="text-[#1FBF9F]">£{filters.budgetMax === Number.POSITIVE_INFINITY ? "100k+" : filters.budgetMax?.toLocaleString() ?? "Any"}</span>
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
          className="w-full accent-[#1FBF9F] bg-[#E5E7EB] rounded-lg appearance-none h-2 cursor-pointer"
        />
        <div className="flex justify-between text-[#374151] text-xs mt-2 font-medium">
          <span>£20k</span>
          <span>£100k+</span>
        </div>
      </div>

      {/* Range Filter */}
      <div>
        <label className="text-[#1A1A1A] font-semibold text-sm mb-4 flex items-center gap-2">
          <Battery className="w-4 h-4 text-[#6B7280]" />
          Min Range (km)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 300, 450].map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...filters, rangeMin: val })}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                filters.rangeMin === val
                  ? "bg-[#1FBF9F] text-white border-[#1FBF9F]"
                  : "bg-[#E8F8F5] text-[#1FBF9F] border-[#D1F2EB] hover:bg-[#D1F2EB]"
              }`}
            >
              {val === 0 ? "Any" : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type Filter */}
      <div>
        <label className="text-[#1A1A1A] font-semibold text-sm mb-4 flex items-center gap-2">
          <Car className="w-4 h-4 text-[#6B7280]" />
          Body Type
        </label>
        <div className="space-y-2">
          {["suv", "sedan", "hatchback"].map((type) => (
            <label key={type} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAF9] cursor-pointer transition-colors border border-transparent hover:border-[#E5E7EB]">
              <input
                type="radio"
                name="bodyType"
                checked={filters.bodyType === type}
                onChange={() => onChange({ ...filters, bodyType: type === filters.bodyType ? null : type })}
                className="accent-[#1FBF9F] w-4 h-4"
              />
              <span className="text-sm text-[#1A1A1A] capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-6 border-t border-[#E5E7EB] space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-[#1A1A1A] font-medium group-hover:text-[#1FBF9F] transition-colors">Fast Charging Included</span>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1FBF9F]"></div>
          </div>
        </label>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-[#1A1A1A] font-medium group-hover:text-[#1FBF9F] transition-colors">Eligible for Tax Credit</span>
          <div className="relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1FBF9F]"></div>
          </div>
        </label>
      </div>

      <button
        onClick={() => onChange({...filters, rangeMin: 0, budgetMax: Number.POSITIVE_INFINITY, bodyType: null})}
        className="w-full py-3 mt-4 text-sm font-bold text-[#6B7280] bg-[#F8FAF9] hover:bg-[#E8F8F5] hover:text-[#1FBF9F] rounded-xl transition-colors border border-[#E5E7EB]"
      >
        Reset Filters
      </button>
    </div>
  );
}
