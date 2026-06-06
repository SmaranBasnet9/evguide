"use client";

import { useState } from "react";
import { Home, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface Props {
  vehicleLabel: string;
}

const PARTNERS = [
  { name: "Pod Point Solo 3",  speed: "7.2 kW", price: "From £849", note: "UK's most installed wallbox" },
  { name: "Ohme Home Pro",     speed: "7.4 kW", price: "From £799", note: "Smart scheduling, Octopus ready" },
  { name: "Hypervolt Home 3",  speed: "7.2 kW", price: "From £899", note: "Solar integration ready" },
];

export default function HomeChargerCTA({ vehicleLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
            <Home className="h-4 w-4 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Set up home charging</p>
            <p className="text-sm text-gray-600">
              Charge your {vehicleLabel} from as little as{" "}
              <span className="font-semibold text-brand">7p/kWh</span> overnight
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Charging cost", value: "7p/kWh",        sub: "vs 75p public" },
              { label: "Ready by",      value: "Every morning",  sub: "Overnight charge" },
              { label: "OZEV grant",    value: "Up to £350",     sub: "Off installation" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 bg-gray-100 p-3 text-center">
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Wallbox options */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Recommended wallboxes</p>
            <div className="space-y-2">
              {PARTNERS.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-brand/60" />
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <span className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{p.speed}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{p.note}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-900">{p.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* OZEV grant */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-700">OZEV grant — up to £350 off installation</p>
            <p className="mt-1 text-xs text-gray-600">
              Most homeowners qualify. Reduces total cost from ~£1,100 to ~£750. Your installer applies on your behalf.
            </p>
          </div>

          <p className="text-center text-[10px] text-gray-400">
            EVGuide may receive a referral fee from partner installers. This never affects our recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
