"use client";

import { useState } from "react";
import { Zap, ChevronDown, ChevronUp, ExternalLink, MapPin } from "lucide-react";

// Regional grid multipliers — UK regions pay slightly different effective rates
const REGION_ADJUSTMENTS: Record<string, number> = {
  "London": 0,
  "South East": 0,
  "South West": 0,
  "East of England": 0,
  "East Midlands": -0.3,
  "West Midlands": -0.3,
  "Yorkshire": -0.5,
  "North West": -0.5,
  "North East": -0.8,
  "Scotland": -1.0,
  "Wales": -0.7,
  "Northern Ireland": +1.2,
};

interface Props {
  batteryKWh: number;
  rangeKm: number;
}

const TARIFFS = [
  { name: "Intelligent Octopus Go",  provider: "Octopus Energy", ratePence: 7,  note: "Overnight smart charging", best: true },
  { name: "OVO Charge Anytime",      provider: "OVO Energy",     ratePence: 9,  note: "EV-specific rate",         best: false },
  { name: "British Gas EV Tariff",   provider: "British Gas",    ratePence: 10, note: "Off-peak overnight",        best: false },
  { name: "E.ON Drive",              provider: "E.ON",           ratePence: 12, note: "Overnight window",          best: false },
  { name: "Standard variable",       provider: "Any supplier",   ratePence: 28, note: "No EV tariff",              best: false },
];

function costPerMile(batteryKWh: number, rangeKm: number, ratePence: number) {
  const rangeMiles = rangeKm * 0.621371 * 0.82;
  return (batteryKWh / rangeMiles) * ratePence / 100;
}

function annualCost(batteryKWh: number, rangeKm: number, ratePence: number, miles: number) {
  return costPerMile(batteryKWh, rangeKm, ratePence) * miles;
}

export default function EnergyTariffWidget({ batteryKWh, rangeKm }: Props) {
  const [open, setOpen] = useState(false);
  const [miles, setMiles] = useState(7500);
  const [postcode, setPostcode] = useState("");
  const [region, setRegion] = useState<string | null>(null);

  function detectRegion(pc: string) {
    const upper = pc.toUpperCase().trim();
    if (/^(SW|SE|EC|WC|E|N|NW|W)/.test(upper)) return "London";
    if (/^(TN|CT|ME|BR|CR|SM|KT|TW|HA|UB|SL|RH|BN|PO|SO|GU|RG|OX|MK)/.test(upper)) return "South East";
    if (/^(BS|BA|TA|DT|BH|SP|SN|GL|HR|WR|CV|B|WS|WV|DY|ST|TF)/.test(upper)) return upper.startsWith("B") ? "West Midlands" : "South West";
    if (/^(LS|BD|HX|WF|HD|HG|YO|DN|S|NG|DE|LE|NN|PE|CB|CO|IP|NR|NP)/.test(upper)) return upper.startsWith("Y") || upper.startsWith("LS") || upper.startsWith("BD") ? "Yorkshire" : "East Midlands";
    if (/^(M|SK|WA|WN|BL|OL|PR|BB|LA|FY|CH|L|LI)/.test(upper)) return "North West";
    if (/^(NE|SR|TS|DH|DL)/.test(upper)) return "North East";
    if (/^(EH|KY|KA|G|PA|FK|PH|DD|AB|IV|HS|ZE|KW|ML|TD)/.test(upper)) return "Scotland";
    if (/^(CF|SA|LD|SY|LL|NP|HR)/.test(upper)) return "Wales";
    if (/^BT/.test(upper)) return "Northern Ireland";
    return null;
  }

  const regionAdj = region ? (REGION_ADJUSTMENTS[region] ?? 0) : 0;
  const adjustedTariffs = TARIFFS.map((t) => ({
    ...t,
    ratePence: Math.max(1, +(t.ratePence + regionAdj * (t.ratePence > 10 ? 1 : 0.5)).toFixed(1)),
  }));

  const standardAnnual = annualCost(batteryKWh, rangeKm, adjustedTariffs.find((t) => !t.best && t.ratePence >= 25)?.ratePence ?? 28, miles);
  const bestAnnual     = annualCost(batteryKWh, rangeKm, adjustedTariffs[0].ratePence, miles);
  const saving         = Math.round(standardAnnual - bestAnnual);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10">
            <Zap className="h-4 w-4 text-teal-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Energy tariff comparison</p>
            <p className="text-sm text-white/50">
              Right tariff saves up to{" "}
              <span className="font-semibold text-teal-400">£{saving}/yr</span>
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-white/30" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-white/30" />}
      </button>

      {open && (
        <div className="border-t border-white/[0.06] px-5 pb-5 pt-4 space-y-5">

          {/* Postcode */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-3.5 w-3.5 text-white/40" />
              <p className="text-sm font-medium text-white/70">Your postcode (optional)</p>
              {region && <span className="text-xs text-teal-400">{region}</span>}
            </div>
            <input
              type="text"
              placeholder="e.g. SW1A 2AA"
              value={postcode}
              maxLength={8}
              onChange={(e) => {
                setPostcode(e.target.value);
                const detected = detectRegion(e.target.value);
                setRegion(detected);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-teal-400/40 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
            />
            <p className="mt-1 text-[11px] text-white/25">Rates adjusted for your region&apos;s grid pricing</p>
          </div>

          {/* Mileage slider */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white/70">Annual mileage</p>
              <p className="text-sm font-bold text-white">{miles.toLocaleString()} mi</p>
            </div>
            <input
              type="range" min={3000} max={20000} step={500} value={miles}
              onChange={(e) => setMiles(Number(e.target.value))}
              className="h-2 w-full rounded-full accent-teal-400"
            />
            <div className="mt-1 flex justify-between text-xs text-white/30">
              <span>3,000</span><span>20,000</span>
            </div>
          </div>

          {/* Tariff rows */}
          <div className="space-y-2">
            {adjustedTariffs.map((t) => {
              const annual  = annualCost(batteryKWh, rangeKm, t.ratePence, miles);
              const cpm     = costPerMile(batteryKWh, rangeKm, t.ratePence);
              const tariffSaving = annual < standardAnnual ? Math.round(standardAnnual - annual) : 0;

              return (
                <div
                  key={t.name}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    t.best
                      ? "border-teal-500/25 bg-teal-500/8"
                      : "border-white/[0.06] bg-white/[0.02]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      {t.best && (
                        <span className="rounded-full border border-teal-500/20 bg-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-teal-400">
                          Best deal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40">{t.ratePence}p/kWh · {t.note}</p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-bold text-white">£{Math.round(annual)}/yr</p>
                    <p className="text-xs text-white/40">{(cpm * 100).toFixed(1)}p/mi</p>
                    {tariffSaving > 0 && (
                      <p className="text-xs font-semibold text-teal-400">Save £{tariffSaving}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-4">
            <p className="text-sm font-semibold text-white">
              Switch to Intelligent Octopus Go — save £{saving}/yr
            </p>
            <p className="mt-1 text-xs text-white/50">
              Smart overnight charging finds cheapest rates automatically. Works with any home wallbox.
            </p>
            <a
              href="https://octopus.energy/smart/intelligent-octopus-go/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-400 transition hover:bg-teal-500/20"
            >
              View tariff <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-[10px] text-white/25">
            Estimates based on {Math.round(batteryKWh)} kWh battery, {Math.round(rangeKm * 0.621371 * 0.82)} mi real-world range,{" "}
            {miles.toLocaleString()} mi/yr. Rates vary. Check with your supplier.
          </p>
        </div>
      )}
    </div>
  );
}
