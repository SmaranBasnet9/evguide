"use client";

import { COMPARE_METRICS, getWinnerIndex } from "@/lib/comparison";
import { applyEvEnrichment } from "@/data/evEnrichment";
import type { EVModel } from "@/types";

interface EVComparisonTableProps {
  vehicles: EVModel[];
}

export default function EVComparisonTable({ vehicles }: EVComparisonTableProps) {
  // Apply enrichment to every vehicle so metric getters receive complete data
  const enrichedVehicles = vehicles.map((v) => applyEvEnrichment(v));

  return (
    <section className="bg-[#F8FAF9] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            EV Intelligence
          </span>
          <h2 className="text-xl font-bold text-white">EV Intelligence Metrics</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAF9]/60">
                <th className="text-left px-5 py-4 text-[#6B7280] font-semibold w-44 min-w-[10rem]">
                  Metric
                </th>
                {enrichedVehicles.map((v, i) => (
                  <th
                    key={v.id}
                    className={`px-5 py-4 text-center font-bold ${
                      i === 0
                        ? "text-emerald-400"
                        : i === 1
                          ? "text-cyan-400"
                          : "text-violet-400"
                    }`}
                  >
                    {v.brand} {v.model}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {COMPARE_METRICS.map((metric, rowIdx) => {
                const winnerIdx = getWinnerIndex(enrichedVehicles, metric);

                return (
                  <tr
                    key={metric.key}
                    className={`border-b border-[#E5E7EB] transition-colors ${
                      rowIdx % 2 === 0 ? "bg-[#F8FAF9]/20" : "bg-transparent"
                    } hover:bg-white/[0.02]`}
                  >
                    {/* Metric label column */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white text-sm">{metric.label}</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{metric.unit}</div>
                    </td>

                    {/* Value columns — one per vehicle */}
                    {enrichedVehicles.map((v, colIdx) => {
                      const rawValue = metric.getValue(v);
                      const isWinner = winnerIdx === colIdx;

                      return (
                        <td
                          key={v.id}
                          className={`px-5 py-4 text-center relative ${
                            isWinner
                              ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                              : "border-l border-[#E5E7EB]"
                          }`}
                        >
                          {rawValue !== null ? (
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`font-bold text-base ${
                                  isWinner ? "text-white" : "text-[#6B7280]"
                                }`}
                              >
                                {metric.format(rawValue)}
                              </span>
                              {isWinner && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                  Best
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-zinc-600 text-xs">N/A</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-zinc-600">
          TCO calculated at 7,500 mi/yr · 28p/kWh home rate · 20% public charging.
          Real-world range = 82% of WLTP. &quot;Best&quot; highlights the leading vehicle per metric.
        </p>
      </div>
    </section>
  );
}
