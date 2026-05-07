"use client";

import React from "react";
import { BatteryCharging, Car, CheckCircle2, ClipboardList, Gauge, Minus, PoundSterling, Zap } from "lucide-react";
import type { EVModel } from "@/types";
import { applyEvEnrichment } from "@/data/evEnrichment";
import { calcTCO } from "@/lib/ev-intelligence";

interface Props {
  modelA: EVModel;
  modelB: EVModel;
}

function parseAccel(s: string): number | null {
  const m = String(s).match(/([0-9.]+)/);
  return m ? parseFloat(m[1]) : null;
}

function emi(price: number) {
  const principal = price * 0.9;
  const r = 0.099 / 12;
  const n = 48;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function fiveYearTCO(v: EVModel): number {
  const tco = calcTCO({
    vehiclePrice: v.price,
    batteryKWh: v.batteryKWh ?? 60,
    rangeKm: v.rangeKm ?? 400,
    annualMiles: 7500,
    energyRatePence: 28,
    publicChargeMixPct: 20,
  });
  const annualRunning = (tco.total3YrCostGbp - v.price) / 3;
  return Math.round(v.price + annualRunning * 5);
}

type DiffResult = { text: string; side: "A" | "B" | "tie" };

function computeDiff(
  numA: number | null,
  numB: number | null,
  lowerBetter: boolean,
  fmt: (diff: number, winner: "A" | "B") => string,
): DiffResult {
  if (numA === null || numB === null || numA === numB) return { text: "", side: "tie" };
  const aWins = lowerBetter ? numA < numB : numA > numB;
  return { text: fmt(Math.abs(numA - numB), aWins ? "A" : "B"), side: aWins ? "A" : "B" };
}

type RowData = {
  label: string;
  displayA: string;
  displayB: string;
  numA: number | null;
  numB: number | null;
  lowerBetter: boolean;
  diff: DiffResult;
};

function SpecRow({ row }: { row: RowData }) {
  const { displayA, displayB, numA, numB, lowerBetter, diff } = row;
  const aWins = numA !== null && numB !== null ? (lowerBetter ? numA < numB : numA > numB) : false;
  const bWins = numA !== null && numB !== null ? (lowerBetter ? numB < numA : numB > numA) : false;
  const tie = !aWins && !bWins;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]">
      {/* Label */}
      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <span className="text-xs text-white/50 sm:text-sm">{row.label}</span>
      </div>

      {/* Car A */}
      <div className={`border-l border-white/5 px-3 py-3 sm:px-5 sm:py-4 ${aWins ? "bg-brand/[0.06]" : ""}`}>
        <div className="flex items-center gap-2">
          {aWins && <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />}
          {tie && <Minus className="h-4 w-4 shrink-0 text-white/20" />}
          <span className={`text-sm font-semibold ${aWins ? "text-brand" : tie ? "text-white/40" : "text-white/30"}`}>
            {displayA}
          </span>
        </div>
        {diff.side === "A" && diff.text && (
          <span className="mt-1 inline-block rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            {diff.text}
          </span>
        )}
      </div>

      {/* Car B */}
      <div className={`border-l border-white/5 px-3 py-3 sm:px-5 sm:py-4 ${bWins ? "bg-brand/[0.06]" : ""}`}>
        <div className="flex items-center gap-2">
          {bWins && <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />}
          {tie && <Minus className="h-4 w-4 shrink-0 text-white/20" />}
          <span className={`text-sm font-semibold ${bWins ? "text-brand" : tie ? "text-white/40" : "text-white/30"}`}>
            {displayB}
          </span>
        </div>
        {diff.side === "B" && diff.text && (
          <span className="mt-1 inline-block rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
            {diff.text}
          </span>
        )}
      </div>
    </div>
  );
}

function SpecGroup({ title, icon: Icon, rows }: { title: string; icon: React.ElementType; rows: RowData[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-white/8 bg-white/[0.04]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Icon className="h-4 w-4 text-brand" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">{title}</span>
        </div>
        <div className="border-l border-white/5 px-5 py-3" />
        <div className="border-l border-white/5 px-5 py-3" />
      </div>
      {rows.map((row) => <SpecRow key={row.label} row={row} />)}
    </div>
  );
}

export default function PremiumCompareTable({ modelA, modelB }: Props) {
  const eA = applyEvEnrichment(modelA);
  const eB = applyEvEnrichment(modelB);
  const emiA = emi(modelA.price);
  const emiB = emi(modelB.price);
  const tcoA = fiveYearTCO(modelA);
  const tcoB = fiveYearTCO(modelB);
  const accelA = parseAccel(modelA.acceleration);
  const accelB = parseAccel(modelB.acceleration);

  function row(
    label: string,
    numA: number | null,
    numB: number | null,
    lowerBetter: boolean,
    display: (n: number) => string,
    diffFmt: (diff: number, winner: "A" | "B") => string,
  ): RowData {
    return {
      label,
      displayA: numA !== null ? display(numA) : "N/A",
      displayB: numB !== null ? display(numB) : "N/A",
      numA, numB, lowerBetter,
      diff: computeDiff(numA, numB, lowerBetter, diffFmt),
    };
  }

  function stringRow(label: string, a: string, b: string): RowData {
    return { label, displayA: a || "N/A", displayB: b || "N/A", numA: null, numB: null, lowerBetter: false, diff: { text: "", side: "tie" } };
  }

  const nameA = `${modelA.brand} ${modelA.model}`;
  const nameB = `${modelB.brand} ${modelB.model}`;

  return (
    <section className="bg-[#0A0A0A] py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Spec Comparison</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Detailed side-by-side</h2>
          <p className="mt-1.5 text-sm text-white/40">
            Teal rows show the winner — diff badges show exactly how much better.
          </p>
        </div>

        {/* Sticky column headers */}
        <div className="overflow-x-auto">
        <div className="min-w-[420px]">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
          <div className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40 sm:px-5">Spec</div>
          <div className="border-l border-white/8 px-3 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{modelA.brand}</p>
            <p className="text-sm font-semibold text-white">{modelA.model}</p>
          </div>
          <div className="border-l border-white/8 px-3 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{modelB.brand}</p>
            <p className="text-sm font-semibold text-white">{modelB.model}</p>
          </div>
        </div>

        <div className="space-y-3">
          <SpecGroup title="Price & Cost" icon={PoundSterling} rows={[
            row("Purchase Price", modelA.price, modelB.price, true, (n) => `£${n.toLocaleString()}`, (d) => `£${d.toLocaleString()} cheaper`),
            row("Est. Monthly Finance", emiA, emiB, true, (n) => `£${n}/mo`, (d) => `£${d}/mo less`),
            row("5-Year Running Cost", tcoA, tcoB, true, (n) => `£${n.toLocaleString()}`, (d) => `£${d.toLocaleString()} less`),
          ]} />
          <SpecGroup title="Range & Battery" icon={BatteryCharging} rows={[
            row("WLTP Range", modelA.rangeKm, modelB.rangeKm, false, (n) => `${n} km`, (d) => `+${d} km`),
            row("Real-World Range", eA.realWorldRangeMiles ?? Math.round(modelA.rangeKm * 0.51), eB.realWorldRangeMiles ?? Math.round(modelB.rangeKm * 0.51), false, (n) => `~${Math.round(n)} mi`, (d) => `+${Math.round(d)} mi`),
            row("Battery Size", modelA.batteryKWh, modelB.batteryKWh, false, (n) => `${n} kWh`, (d) => `+${d} kWh`),
            row("Annual Energy Cost", eA.annualEnergyCostGbp ?? null, eB.annualEnergyCostGbp ?? null, true, (n) => `£${Math.round(n)}/yr`, (d) => `£${Math.round(d)} less/yr`),
          ]} />
          <SpecGroup title="Charging" icon={Zap} rows={[
            row("DC Rapid Charging", eA.chargingSpeedDcKw ?? null, eB.chargingSpeedDcKw ?? null, false, (n) => `${n} kW`, (d) => `+${d} kW`),
            row("AC Home Charging", eA.chargingSpeedAcKw ?? null, eB.chargingSpeedAcKw ?? null, false, (n) => `${n} kW`, (d) => `+${d} kW`),
            ...(eA.chargeTimeTo80Mins || eB.chargeTimeTo80Mins ? [row("10→80% Charge Time", eA.chargeTimeTo80Mins ?? null, eB.chargeTimeTo80Mins ?? null, true, (n) => `${n} min`, (d) => `${d} min faster`)] : []),
          ]} />
          <SpecGroup title="Performance" icon={Gauge} rows={[
            row("0–100 km/h", accelA, accelB, true, (n) => `${n.toFixed(1)}s`, (d) => `${d.toFixed(1)}s faster`),
            row("Top Speed", modelA.topSpeedKph, modelB.topSpeedKph, false, (n) => `${n} km/h`, (d) => `+${d} km/h`),
            row("Motor Power", modelA.motorCapacityKw, modelB.motorCapacityKw, false, (n) => `${n} kW`, (d) => `+${d} kW`),
            row("Torque", modelA.torqueNm, modelB.torqueNm, false, (n) => `${n} Nm`, (d) => `+${d} Nm`),
          ]} />
          <SpecGroup title="Practicality" icon={Car} rows={[
            row("Seats", modelA.seats, modelB.seats, false, (n) => `${n}`, (d) => `+${d} seats`),
            row("Boot Space", modelA.bootLitres, modelB.bootLitres, false, (n) => `${n} L`, (d) => `+${d} L`),
            row("Ground Clearance", modelA.groundClearanceMm, modelB.groundClearanceMm, false, (n) => `${n} mm`, (d) => `+${d} mm`),
          ]} />
          <SpecGroup title="Ownership" icon={ClipboardList} rows={[
            stringRow("Warranty", modelA.warranty, modelB.warranty),
            stringRow("Body Type", modelA.bodyType ?? "—", modelB.bodyType ?? "—"),
            stringRow("Charging Port", modelA.chargePortType ?? modelA.chargingStandard, modelB.chargePortType ?? modelB.chargingStandard),
          ]} />
        </div>

        </div>
        </div>

        <p className="mt-5 text-xs text-white/20">
          Finance est. at 9.9% APR, 48 months, 10% deposit · Real-world range = 82% of WLTP ·
          5-yr TCO at 7,500 mi/yr, 28p/kWh · {nameA} vs {nameB}.
        </p>
      </div>
    </section>
  );
}
