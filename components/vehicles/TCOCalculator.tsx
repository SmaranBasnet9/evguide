"use client";

/**
 * TCOCalculator — Total Cost of Ownership Calculator
 *
 * Shows users what this EV actually costs to run vs their current
 * petrol/diesel car. Creates financial conviction before the lead.
 *
 * Inspired by competitor gap analysis: neither Carwow nor Auto Trader
 * models real EV economics. This is EVGuide's key differentiator.
 */

import { useState } from "react";
import { PoundSterling, TrendingDown, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { calcTCO, DEFAULT_ENERGY_RATE_PENCE, DEFAULT_FUEL_PRICE_GBP } from "@/lib/ev-intelligence";
import type { TCOResult } from "@/types";

interface Props {
  vehiclePrice: number;
  batteryKWh: number;
  rangeKm: number;
}

export default function TCOCalculator({ vehiclePrice, batteryKWh, rangeKm }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [annualMiles, setAnnualMiles] = useState(7500);
  const [currentMpg, setCurrentMpg] = useState(40);
  const [energyRate, setEnergyRate] = useState(DEFAULT_ENERGY_RATE_PENCE);
  const [result, setResult] = useState<TCOResult | null>(null);

  function handleCalculate() {
    const tco = calcTCO({
      vehiclePrice,
      batteryKWh,
      rangeKm,
      annualMiles,
      energyRatePence: energyRate,
      currentCarMpg: currentMpg,
      fuelPriceGbp: DEFAULT_FUEL_PRICE_GBP,
    });
    setResult(tco);
  }

  const hasSaving = result && result.annualSavingVsIceGbp && result.annualSavingVsIceGbp > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
            <PoundSterling className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">What does this EV really cost?</p>
            {result ? (
              <p className="text-sm font-medium text-emerald-700">
                ~£{result.totalMonthlyCostGbp.toLocaleString()}/mo total running cost
              </p>
            ) : (
              <p className="text-sm text-slate-500">Calculate vs your current car</p>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-5">
          {/* Inputs */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Annual mileage
              </label>
              <select
                value={annualMiles}
                onChange={(e) => { setAnnualMiles(Number(e.target.value)); setResult(null); }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5000, 7500, 10000, 12000, 15000, 20000].map((m) => (
                  <option key={m} value={m}>{m.toLocaleString()} miles/yr</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Current car MPG
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={5}
                  value={currentMpg}
                  onChange={(e) => { setCurrentMpg(Number(e.target.value)); setResult(null); }}
                  className="flex-1 h-2 bg-slate-200 rounded-full accent-emerald-600"
                />
                <span className="w-16 text-right text-sm font-semibold text-slate-900">
                  {currentMpg} mpg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Home energy rate
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min={15}
                  max={40}
                  step={1}
                  value={energyRate}
                  onChange={(e) => { setEnergyRate(Number(e.target.value)); setResult(null); }}
                  className="flex-1 h-2 bg-slate-200 rounded-full accent-emerald-600"
                />
                <span className="w-16 text-right text-sm font-semibold text-slate-900">
                  {energyRate}p/kWh
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Calculate my costs
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Saving highlight */}
              {hasSaving && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <TrendingDown className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-800 text-lg">
                      Save ~£{result.annualSavingVsIceGbp!.toLocaleString()}/year
                    </p>
                    <p className="text-sm text-emerald-700">
                      vs running a {currentMpg} mpg petrol car at {annualMiles.toLocaleString()} miles/year
                    </p>
                  </div>
                </div>
              )}

              {/* Cost breakdown */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Monthly running costs
                </div>
                <div className="divide-y divide-slate-100">
                  <CostRow label="Energy (electricity)" value={result.monthlyEnergyCostGbp} icon="⚡" />
                  <CostRow label="Insurance (estimated)" value={result.annualInsuranceEstGbp / 12} icon="🛡" />
                  <CostRow label="Servicing (estimated)" value={result.annualServicingEstGbp / 12} icon="🔧" />
                  <CostRow
                    label="Vehicle Excise Duty"
                    value={result.annualVedGbp / 12}
                    icon="📋"
                    note={result.annualVedGbp === 0 ? "£0 for EVs under £40k" : undefined}
                  />
                  {result.monthlyFinanceGbp > 0 && (
                    <CostRow label="Finance repayment" value={result.monthlyFinanceGbp} icon="💳" />
                  )}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                    <span className="text-sm font-bold text-slate-900">Total per month</span>
                    <span className="text-base font-bold text-slate-900">
                      £{result.totalMonthlyCostGbp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              {result.annualFuelCostIceGbp && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                    <p className="text-xs text-slate-500">Petrol car annual fuel</p>
                    <p className="text-xl font-bold text-red-600 mt-1">
                      £{result.annualFuelCostIceGbp.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-3 w-3 text-emerald-600" />
                      <p className="text-xs text-emerald-700">EV annual energy</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-700 mt-1">
                      £{result.annualEnergyCostGbp.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Estimates based on UK averages 2026. Insurance and servicing are indicative.
                Finance shown if entered above. Energy at {energyRate}p/kWh home rate + 65p/kWh public (20% mix).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CostRow({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: number;
  icon: string;
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-sm text-slate-700">{label}</span>
        {note && <span className="text-xs text-emerald-600 font-medium">({note})</span>}
      </div>
      <span className="text-sm font-semibold text-slate-900">
        £{Math.round(value).toLocaleString()}
      </span>
    </div>
  );
}
