import { ArrowLeftRight, Car, Zap } from "lucide-react";
import type { EVModel } from "@/types";

interface PremiumCompareHeroProps {
  models: EVModel[];
  selectedA: string;
  selectedB: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  onSwap: () => void;
}

export default function PremiumCompareHero({
  models,
  selectedA,
  selectedB,
  onSelectA,
  onSelectB,
  onSwap,
}: PremiumCompareHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-50 pt-32 pb-16">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 hidden h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/8 blur-[70px] sm:block" />
        <div className="absolute right-1/4 top-1/3 hidden h-[300px] w-[300px] rounded-full bg-cyan-500/6 blur-[60px] sm:block" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          <Zap className="h-3 w-3" />
          AI Intelligence Compare
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 md:text-6xl">
          Compare &amp; Decide.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Real-world range, charging speeds, and running costs — laid out so the right choice is obvious.
        </p>

        {/* Selector row */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          {/* Vehicle A */}
          <div className="w-full flex-1 text-left">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              Vehicle A
            </label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedA}
                onChange={(e) => onSelectA(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-10 text-sm font-semibold text-gray-900 backdrop-blur-sm transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20 hover:border-gray-300"
              >
                <option value="" className="bg-white">Select a vehicle</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.id === selectedB} className="bg-white">
                    {m.brand} {m.model}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Swap */}
          <button
            type="button"
            onClick={onSwap}
            disabled={!selectedA || !selectedB}
            aria-label="Swap vehicles"
            className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          {/* Vehicle B */}
          <div className="w-full flex-1 text-left">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              Vehicle B
            </label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedB}
                onChange={(e) => onSelectB(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-white py-4 pl-11 pr-10 text-sm font-semibold text-gray-900 backdrop-blur-sm transition focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20 hover:border-gray-300"
              >
                <option value="" className="bg-white">Select a vehicle</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.id === selectedA} className="bg-white">
                    {m.brand} {m.model}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
