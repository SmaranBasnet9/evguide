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
  Comfortable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Moderate: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Stretch: "border-amber-200 bg-amber-50 text-amber-700",
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
    <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 pb-24 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.06),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.05),_transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
            Finance Intelligence
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-gray-900 md:text-6xl">
            Understand your EV monthly cost before you buy
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Estimate payments, compare affordability, and find the smartest finance
            option for your budget.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
            Finance outputs on EVGuide are illustrative planning tools only. They are not regulated financial advice,
            credit broking, or binding lender offers.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <LockKeyhole className="h-4 w-4 text-emerald-600" />
              UK-focused EV affordability tools
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-cyan-600" />
              Real monthly cost insights
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
              <WalletCards className="h-4 w-4 text-emerald-600" />
              Free to use
            </div>
          </div>
        </div>

        <div className="lg:pl-6">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                  Finance Summary
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  {selectedVehicle
                    ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                    : "Custom EV configuration"}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
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

            <div className="mt-6 rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Total monthly ownership
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.05em] text-gray-900">
                  {formatCurrency(monthlyOwnershipCost)}
                </span>
                <span className="pb-1 text-sm text-gray-400">per month</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-500">
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
    <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
