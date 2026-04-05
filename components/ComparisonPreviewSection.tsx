"use client";

import { useState } from "react";
import Link from "next/link";
import type { EVModel } from "@/types";

type Props = { models: EVModel[] };

type SpecRow = {
  label: string;
  a: string;
  b: string;
  higherIsBetter: boolean;
};

function highlight(a: string, b: string, higherIsBetter: boolean): [string, string] {
  const aNum = parseFloat(a.replace(/[^0-9.]/g, ""));
  const bNum = parseFloat(b.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(aNum) || Number.isNaN(bNum) || aNum === bNum) return ["", ""];
  const aWins = higherIsBetter ? aNum > bNum : aNum < bNum;
  return aWins ? ["text-emerald-600 font-bold", ""] : ["", "text-emerald-600 font-bold"];
}

export default function ComparisonPreviewSection({ models }: Props) {
  const [carAId, setCarAId] = useState(models[0]?.id ?? "");
  const [carBId, setCarBId] = useState(models[1]?.id ?? models[0]?.id ?? "");

  const carA = models.find((m) => m.id === carAId);
  const carB = models.find((m) => m.id === carBId);

  const specs: SpecRow[] = [
    {
      label: "Price",
      a: carA ? `£${carA.price.toLocaleString()}` : "—",
      b: carB ? `£${carB.price.toLocaleString()}` : "—",
      higherIsBetter: false,
    },
    {
      label: "Range",
      a: carA ? `${carA.rangeKm} km` : "—",
      b: carB ? `${carB.rangeKm} km` : "—",
      higherIsBetter: true,
    },
    {
      label: "Battery",
      a: carA ? `${carA.batteryKWh} kWh` : "—",
      b: carB ? `${carB.batteryKWh} kWh` : "—",
      higherIsBetter: true,
    },
    {
      label: "0–100 km/h",
      a: carA?.acceleration ?? "—",
      b: carB?.acceleration ?? "—",
      higherIsBetter: false,
    },
    {
      label: "Seats",
      a: carA ? String(carA.seats) : "—",
      b: carB ? String(carB.seats) : "—",
      higherIsBetter: true,
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">EV Comparison Tool</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Compare any two EVs side by side
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Select two models below for an instant spec preview.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Car selectors */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4">
            <select
              value={carAId}
              onChange={(e) => setCarAId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.model}
                </option>
              ))}
            </select>

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-600">
              vs
            </span>

            <select
              value={carBId}
              onChange={(e) => setCarBId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand} {m.model}
                </option>
              ))}
            </select>
          </div>

          {/* Spec rows */}
          <div className="divide-y divide-slate-100">
            {specs.map((spec) => {
              const [clsA, clsB] = highlight(spec.a, spec.b, spec.higherIsBetter);
              return (
                <div
                  key={spec.label}
                  className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5 text-sm"
                >
                  <p className={`text-slate-800 ${clsA}`}>{spec.a}</p>
                  <p className="px-4 text-center text-xs font-medium text-slate-400">{spec.label}</p>
                  <p className={`text-right text-slate-800 ${clsB}`}>{spec.b}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-6 py-4">
            <Link
              href={
                carAId && carBId
                  ? `/compare?carA=${carAId}&carB=${carBId}`
                  : "/compare"
              }
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Start Full Comparison →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
