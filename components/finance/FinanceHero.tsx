import { BadgeCheck, LockKeyhole, Sparkles, WalletCards } from "lucide-react";
import { type AffordabilityLevel, formatCurrency } from "./financeUtils";
import type { EVModel } from "@/types";

interface FinanceHeroProps {
  selectedVehicle: EVModel | null;
  carPrice: number;
  deposit: number;
  termYears: number;
  monthlyPayment: number;
  monthlyOwnershipCost: number;
  affordabilityLevel: AffordabilityLevel;
}

const affordabilityStyles: Record<AffordabilityLevel, string> = {
  Comfortable: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Moderate: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  Stretch: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

export default function FinanceHero({
  selectedVehicle,
  carPrice,
  deposit,
  termYears,
  monthlyPayment,
  monthlyOwnershipCost,
  affordabilityLevel,
}: FinanceHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/6 bg-[#07090B] pb-24 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.16),_transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Finance Intelligence
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
            Understand your EV monthly cost before you buy
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Estimate payments, compare affordability, and find the smartest finance
            option for your budget.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Finance outputs on EVGuide are illustrative planning tools only. They are not regulated financial advice,
            credit broking, or binding lender offers.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <LockKeyhole className="h-4 w-4 text-emerald-300" />
              UK-focused EV affordability tools
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Real monthly cost insights
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <WalletCards className="h-4 w-4 text-emerald-300" />
              Free to use
            </div>
          </div>
        </div>

        <div className="lg:pl-6">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  Finance Summary
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {selectedVehicle
                    ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                    : "Custom EV configuration"}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Monthly ownership view for UK EV buyers
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${affordabilityStyles[affordabilityLevel]}`}
              >
                <BadgeCheck className="h-4 w-4" />
                {affordabilityLevel}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Metric label="Vehicle price" value={formatCurrency(carPrice)} />
              <Metric label="Deposit" value={formatCurrency(deposit)} />
              <Metric label="Loan term" value={`${termYears} years`} />
              <Metric label="Estimated monthly payment" value={formatCurrency(monthlyPayment)} />
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-[#081412] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
                Total monthly ownership
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.05em] text-white">
                  {formatCurrency(monthlyOwnershipCost)}
                </span>
                <span className="pb-1 text-sm text-zinc-500">per month</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Finance plus estimated charging, insurance, and routine EV running costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
