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
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Step 3</p>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">Build your finance structure</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
          Adjust deposit, insurance, and fee assumptions, then we will carry the result into a
          final summary and submission step.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Selected bank" icon={ShieldCheck}>
              <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
                {selectedBank.bank}
              </div>
            </Field>

            <Field label="Interest rate" icon={Percent}>
              <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
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

          <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Deposit percentage</p>
                <p className="mt-1 text-xs text-gray-400">A healthy deposit lowers both EMI and total payable.</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
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
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-emerald-600"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Insurance cost (monthly)" icon={ShieldCheck}>
              <CurrencyInput value={insuranceCost} onChange={onInsuranceCostChange} step={25} />
              <button
                type="button"
                onClick={onResetInsuranceCost}
                className="mt-2 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
              >
                Use estimated insurance
              </button>
            </Field>

            <Field label="Loan processing fee" icon={SlidersHorizontal}>
              <CurrencyInput value={processingFee} onChange={onProcessingFeeChange} step={50} />
              <button
                type="button"
                onClick={onResetProcessingFee}
                className="mt-2 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
              >
                Use recommended fee ({formatCurrency(recommendedProcessingFee)})
              </button>
            </Field>
          </div>

          <Field label="Comfortable monthly budget" icon={PoundSterling}>
            <CurrencyInput value={monthlyBudget} onChange={onMonthlyBudgetChange} step={25} />
          </Field>

          <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Advanced option: balloon payment</p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Keep this if you want a lower monthly figure with a final amount due at the end.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onIncludeBalloonPaymentChange(!includeBalloonPayment)}
                className={`relative inline-flex h-7 w-12 rounded-full border transition ${
                  includeBalloonPayment
                    ? "border-cyan-300 bg-cyan-100"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    includeBalloonPayment ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {includeBalloonPayment ? (
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Balloon amount</span>
                  <span className="font-semibold text-gray-900">{balloonPercent}% of vehicle price</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={balloonPercent}
                  onChange={(event) => onBalloonPercentChange(Number(event.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-cyan-600"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-24">
          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Live finance summary
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-gray-900">
              {selectedVehicle.brand} {selectedVehicle.model}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
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

            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                Total payable amount
              </p>
              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {formatCurrency(summary.totalPayableAmount)}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Includes deposit, monthly repayments, processing fee, and total insurance across the loan term.
              </p>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                All-in monthly ownership
              </p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {formatCurrency(monthlyOwnershipCost)}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
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
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
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
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600">
        <Icon className="h-4 w-4 text-gray-400" />
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
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        GBP
      </span>
      <input
        type="number"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-14 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
