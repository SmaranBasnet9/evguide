import Link from "next/link";
import { EVModel } from "@/types";

function winnerClass(left: number, right: number, lowerBetter = false, side: "left" | "right") {
  if (left === right) return "text-slate-900";
  const leftWins = lowerBetter ? left < right : left > right;
  const rightWins = lowerBetter ? right < left : right > left;
  if (side === "left" && leftWins) return "font-semibold text-emerald-600";
  if (side === "right" && rightWins) return "font-semibold text-emerald-600";
  return "text-slate-900";
}

export default function ComparisonTable({
  modelA,
  modelB,
}: {
  modelA: EVModel;
  modelB: EVModel;
}) {
  const specs = [
    { label: "Price", valueA: `£${modelA.price}`, valueB: `£${modelB.price}`, lowerBetter: true },
    { label: "Range", valueA: `${modelA.rangeKm} km`, valueB: `${modelB.rangeKm} km`, lowerBetter: false },
    { label: "Battery Capacity", valueA: `${modelA.batteryKWh} kWh`, valueB: `${modelB.batteryKWh} kWh`, lowerBetter: false },
    { label: "Torque", valueA: `${modelA.torqueNm} Nm`, valueB: `${modelB.torqueNm} Nm`, lowerBetter: false },
    { label: "Ground Clearance", valueA: `${modelA.groundClearanceMm} mm`, valueB: `${modelB.groundClearanceMm} mm`, lowerBetter: false },
    { label: "ADAS Features", valueA: modelA.adas, valueB: modelB.adas, lowerBetter: false },
    { label: "Description", valueA: modelA.description, valueB: modelB.description, lowerBetter: false },
  ];

  return (
    <section className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Detailed EV Comparison</h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Compare specifications side by side to find your perfect EV</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6">
          {/* Model A Card */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3 sm:rounded-3xl sm:p-6">
            <h3 className="text-sm font-bold text-blue-600 sm:text-xl">{modelA.brand} {modelA.model}</h3>
            <p className="mt-1 text-base font-bold sm:mt-2 sm:text-3xl">£{modelA.price.toLocaleString()}</p>
            <div className="mt-3 flex-1 space-y-1.5 sm:mt-4 sm:space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-start justify-between gap-2 border-b border-slate-100 py-1.5 last:border-b-0 sm:items-center sm:py-2">
                  <span className="text-[11px] font-medium text-slate-700 sm:text-sm">{spec.label}</span>
                  <span className={`max-w-[58%] text-right text-[11px] leading-4 sm:max-w-none sm:text-sm ${winnerClass(modelA[spec.label.toLowerCase().replace(' ', '') as keyof EVModel] as number, modelB[spec.label.toLowerCase().replace(' ', '') as keyof EVModel] as number, spec.lowerBetter, "left")}`}>
                    {spec.valueA}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
              <Link
                href={`/cars/${modelA.id}`}
                className="rounded-xl bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700 sm:rounded-2xl sm:px-4 sm:text-sm"
              >
                Show More
              </Link>
              <Link
                href={`/finance?car=${modelA.id}`}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:rounded-2xl sm:px-4 sm:text-sm"
              >
                Finance
              </Link>
            </div>
          </div>

          {/* Model B Card */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3 sm:rounded-3xl sm:p-6">
            <h3 className="text-sm font-bold text-blue-600 sm:text-xl">{modelB.brand} {modelB.model}</h3>
            <p className="mt-1 text-base font-bold sm:mt-2 sm:text-3xl">£{modelB.price.toLocaleString()}</p>
            <div className="mt-3 flex-1 space-y-1.5 sm:mt-4 sm:space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-start justify-between gap-2 border-b border-slate-100 py-1.5 last:border-b-0 sm:items-center sm:py-2">
                  <span className="text-[11px] font-medium text-slate-700 sm:text-sm">{spec.label}</span>
                  <span className={`max-w-[58%] text-right text-[11px] leading-4 sm:max-w-none sm:text-sm ${winnerClass(modelA[spec.label.toLowerCase().replace(' ', '') as keyof EVModel] as number, modelB[spec.label.toLowerCase().replace(' ', '') as keyof EVModel] as number, spec.lowerBetter, "right")}`}>
                    {spec.valueB}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
              <Link
                href={`/cars/${modelB.id}`}
                className="rounded-xl bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700 sm:rounded-2xl sm:px-4 sm:text-sm"
              >
                Show More
              </Link>
              <Link
                href={`/finance?car=${modelB.id}`}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:rounded-2xl sm:px-4 sm:text-sm"
              >
                Finance
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/finance?car=${modelA.id}`}
            className="inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 mr-4"
          >
            Finance {modelA.brand} {modelA.model}
          </Link>
          <Link
            href={`/finance?car=${modelB.id}`}
            className="inline-flex rounded-2xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Finance {modelB.brand} {modelB.model}
          </Link>
        </div>
      </div>
    </section>
  );
}