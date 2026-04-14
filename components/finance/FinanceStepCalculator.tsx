import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Percent,
  PoundSterling,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  formatCurrency,
  type FinanceEnquirySummary,
  type RunningCostEstimate,
} from "./financeUtils";
import type { BankOffer, EVModel } from "@/types";

interface FinanceStepCalculatorProps {
  selectedBank: BankOffer;
  selectedVehicle: EVModel;
  carPrice: number;
  onCarPriceChange: (value: number) => void;
  deposit: number;
  onDepositChange: (value: number) => void;
  insuranceCost: number;
  onInsuranceCostChange: (value: number) => void;
  onResetInsuranceCost: () => void;
  processingFee: number;
  recommendedProcessingFee: number;
  onProcessingFeeChange: (value: number) => void;
  onResetProcessingFee: () => void;
  monthlyBudget: number;
  onMonthlyBudgetChange: (value: number) => void;
  includeBalloonPayment: boolean;
  onIncludeBalloonPaymentChange: (value: boolean) => void;
  balloonPercent: number;
  onBalloonPercentChange: (value: number) => void;
  summary: FinanceEnquirySummary;
  runningCost: RunningCostEstimate;
  monthlyOwnershipCost: number;
  termYearsPreview: number;
  onBack: () => void;
  onContinue: () => void;
}

export default function FinanceStepCalculator({
  selectedBank,
  selectedVehicle,
  carPrice,
  onCarPriceChange,
  deposit,
  onDepositChange,
  insuranceCost,
  onInsuranceCostChange,
  onResetInsuranceCost,
  processingFee,
  recommendedProcessingFee,
  onProcessingFeeChange,
  onResetProcessingFee,
  monthlyBudget,
  onMonthlyBudgetChange,
  includeBalloonPayment,
  onIncludeBalloonPaymentChange,
  balloonPercent,
  onBalloonPercentChange,
  summary,
  runningCost,
  monthlyOwnershipCost,
  termYearsPreview,
  onBack,
  onContinue,
}: FinanceStepCalculatorProps) {
  const depositPercent = carPrice > 0 ? Math.round((deposit / carPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Step 3</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Build your finance structure</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Adjust deposit, insurance, and fee assumptions, then we will carry the result into a
          final summary and submission step.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Selected bank" icon={ShieldCheck}>
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0A1013] px-4 py-3 text-sm text-white">
                {selectedBank.bank}
              </div>
            </Field>

            <Field label="Interest rate" icon={Percent}>
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0A1013] px-4 py-3 text-sm text-white">
                {selectedBank.interestRate.toFixed(1)}% APR
              </div>
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Vehicle price" icon={PoundSterling}>
              <CurrencyInput value={carPrice} onChange={onCarPriceChange} step={500} />
            </Field>

            <Field label="Down payment" icon={CreditCard}>
              <CurrencyInput value={deposit} onChange={onDepositChange} step={500} />
            </Field>
          </div>

          <div className="rounded-[1.5rem] border border-white/8 bg-[#090D10] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Deposit percentage</p>
                <p className="mt-1 text-xs text-zinc-500">A healthy deposit lowers both EMI and total payable.</p>
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
              onChange={(event) => onDepositChange(Number(event.target.value))}
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/8 accent-emerald-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Insurance cost (monthly)" icon={ShieldCheck}>
              <CurrencyInput value={insuranceCost} onChange={onInsuranceCostChange} step={25} />
              <button
                type="button"
                onClick={onResetInsuranceCost}
                className="mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Use estimated insurance
              </button>
            </Field>

            <Field label="Loan processing fee" icon={SlidersHorizontal}>
              <CurrencyInput value={processingFee} onChange={onProcessingFeeChange} step={50} />
              <button
                type="button"
                onClick={onResetProcessingFee}
                className="mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Use recommended fee ({formatCurrency(recommendedProcessingFee)})
              </button>
            </Field>
          </div>

          <Field label="Comfortable monthly budget" icon={PoundSterling}>
            <CurrencyInput value={monthlyBudget} onChange={onMonthlyBudgetChange} step={25} />
          </Field>

          <div className="rounded-[1.5rem] border border-white/8 bg-[#090D10] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Advanced option: balloon payment</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Keep this if you want a lower monthly figure with a final amount due at the end.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onIncludeBalloonPaymentChange(!includeBalloonPayment)}
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
                  <span className="text-zinc-400">Balloon amount</span>
                  <span className="font-semibold text-white">{balloonPercent}% of vehicle price</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={balloonPercent}
                  onChange={(event) => onBalloonPercentChange(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/8 accent-cyan-400"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-24">
          <div className="rounded-[1.75rem] border border-white/8 bg-[#091114] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Live finance summary
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {selectedVehicle.brand} {selectedVehicle.model}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Preview based on a {termYearsPreview}-year term. You will confirm the final duration in the next step.
            </p>

            <div className="mt-6 space-y-3">
              <BreakdownRow label="Financed amount" value={formatCurrency(summary.loanAmount)} />
              <BreakdownRow label="Monthly EMI" value={formatCurrency(summary.monthlyPayment)} />
              <BreakdownRow label="Total insurance cost" value={formatCurrency(summary.totalInsuranceCost)} />
              <BreakdownRow label="Processing fee" value={formatCurrency(summary.processingFeeAmount)} />
              <BreakdownRow
                label="Charging + maintenance"
                value={formatCurrency(runningCost.charging + runningCost.maintenance)}
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-400/15 bg-emerald-400/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Total payable amount
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {formatCurrency(summary.totalPayableAmount)}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Includes deposit, monthly repayments, processing fee, and total insurance across the loan term.
              </p>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                All-in monthly ownership
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {formatCurrency(monthlyOwnershipCost)}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Finance plus charging, insurance, and maintenance using the current assumptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          Continue to summary
          <ArrowRight className="h-4 w-4" />
        </button>
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
  step,
}: {
  value: number;
  onChange: (value: number) => void;
  step: number;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
        GBP
      </span>
      <input
        type="number"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-white/10 bg-[#090D10] py-3 pl-14 pr-4 text-sm text-white outline-none transition focus:border-cyan-400/40"
      />
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
