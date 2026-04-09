import {
  Calculator,
  ChevronDown,
  CreditCard,
  Percent,
  PoundSterling,
  SlidersHorizontal,
} from "lucide-react";
import { formatCurrency, type FinanceMetrics, type RunningCostEstimate } from "./financeUtils";
import type { EVModel } from "@/types";

interface FinanceCalculatorProps {
  allModels: EVModel[];
  selectedVehicleId: string;
  onVehicleSelect: (value: string) => void;
  carPrice: number;
  setCarPrice: (value: number) => void;
  deposit: number;
  setDeposit: (value: number) => void;
  termYears: number;
  setTermYears: (value: number) => void;
  apr: number;
  setApr: (value: number) => void;
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  includeBalloonPayment: boolean;
  setIncludeBalloonPayment: (value: boolean) => void;
  balloonPercent: number;
  setBalloonPercent: (value: number) => void;
  financeMetrics: FinanceMetrics;
  runningCost: RunningCostEstimate;
  monthlyOwnershipCost: number;
}

const termOptions = [2, 3, 4, 5];

export default function FinanceCalculator({
  allModels,
  selectedVehicleId,
  onVehicleSelect,
  carPrice,
  setCarPrice,
  deposit,
  setDeposit,
  termYears,
  setTermYears,
  apr,
  setApr,
  monthlyBudget,
  setMonthlyBudget,
  includeBalloonPayment,
  setIncludeBalloonPayment,
  balloonPercent,
  setBalloonPercent,
  financeMetrics,
  runningCost,
  monthlyOwnershipCost,
}: FinanceCalculatorProps) {
  const depositPercent = carPrice > 0 ? Math.round((deposit / carPrice) * 100) : 0;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
      <div className="flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-300">
            <Calculator className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Finance calculator</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Build the deal structure around your budget, not just the vehicle price.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Monthly payment" value={formatCurrency(financeMetrics.monthlyPayment)} />
          <Stat label="Total repayable" value={formatCurrency(financeMetrics.totalRepayable)} />
          <Stat label="Running cost" value={formatCurrency(runningCost.totalMonthly)} />
          <Stat label="All-in monthly" value={formatCurrency(monthlyOwnershipCost)} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Vehicle model" icon={SlidersHorizontal}>
              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(event) => onVehicleSelect(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#090D10] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
                >
                  {allModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.brand} {model.model}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
            </Field>

            <Field label="Comfortable monthly budget" icon={PoundSterling}>
              <CurrencyInput value={monthlyBudget} onChange={setMonthlyBudget} />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Vehicle price" icon={PoundSterling}>
              <CurrencyInput value={carPrice} onChange={setCarPrice} />
            </Field>

            <Field label="Deposit amount" icon={CreditCard}>
              <CurrencyInput value={deposit} onChange={setDeposit} />
            </Field>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-[#090D10] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Deposit percentage</p>
                <p className="mt-1 text-xs text-zinc-500">Most UK EV buyers land between 10% and 20%.</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                {depositPercent}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(carPrice, 1000)}
              step={500}
              value={deposit}
              onChange={(event) => setDeposit(Number(event.target.value))}
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/8 accent-emerald-400"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(carPrice)}</span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Loan term" icon={SlidersHorizontal}>
              <div className="grid grid-cols-4 gap-2">
                {termOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTermYears(value)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                      termYears === value
                        ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-300"
                        : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    {value} yr
                  </button>
                ))}
              </div>
            </Field>

            <Field label="APR / interest rate" icon={Percent}>
              <div className="rounded-[1.5rem] border border-white/8 bg-[#090D10] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Current APR</span>
                  <span className="font-semibold text-white">{apr.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.1}
                  value={apr}
                  onChange={(event) => setApr(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/8 accent-cyan-400"
                />
                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                  <span>0%</span>
                  <span>12%</span>
                </div>
              </div>
            </Field>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-[#090D10] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Balloon payment</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Useful if you want a PCP-style structure with lower monthly payments and a final amount due.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIncludeBalloonPayment(!includeBalloonPayment)}
                className={`relative inline-flex h-7 w-12 rounded-full border transition ${
                  includeBalloonPayment
                    ? "border-cyan-400/40 bg-cyan-400/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    includeBalloonPayment ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {includeBalloonPayment ? (
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Final balloon amount</span>
                  <span className="font-semibold text-white">
                    {balloonPercent}% of vehicle price
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={balloonPercent}
                  onChange={(event) => setBalloonPercent(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/8 accent-cyan-400"
                />
                <p className="mt-3 text-sm text-zinc-400">
                  Final payment estimate: {formatCurrency(financeMetrics.balloonPayment)}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-24">
          <div className="rounded-[1.75rem] border border-white/8 bg-[#091114] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Ownership summary
            </p>
            <div className="mt-4">
              <p className="text-sm text-zinc-500">Estimated monthly payment</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-white">
                {formatCurrency(financeMetrics.monthlyPayment)}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <BreakdownRow label="Loan amount" value={formatCurrency(financeMetrics.loanAmount)} />
              <BreakdownRow label="Total interest" value={formatCurrency(financeMetrics.totalInterest)} />
              <BreakdownRow label="Charging" value={formatCurrency(runningCost.charging)} />
              <BreakdownRow label="Insurance" value={formatCurrency(runningCost.insurance)} />
              <BreakdownRow label="Maintenance" value={formatCurrency(runningCost.maintenance)} />
              {financeMetrics.balloonPayment > 0 ? (
                <BreakdownRow
                  label="Final balloon payment"
                  value={formatCurrency(financeMetrics.balloonPayment)}
                />
              ) : null}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Total monthly ownership cost
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {formatCurrency(monthlyOwnershipCost)}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                A better budgeting number than finance alone because it includes the core EV
                running costs buyers forget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof CreditCard;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
        <Icon className="h-4 w-4 text-zinc-500" />
        {label}
      </div>
      {children}
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
        GBP
      </span>
      <input
        type="number"
        min={0}
        step={500}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-[#090D10] py-3 pl-14 pr-4 text-sm text-white outline-none transition focus:border-cyan-400/40"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
