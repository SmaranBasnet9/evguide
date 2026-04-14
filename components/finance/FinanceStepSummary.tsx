import Image from "next/image";
import { ArrowLeft, ArrowRight, Mail, Phone, UserRound } from "lucide-react";
import {
  formatCurrency,
  getSafeImageSrc,
  type FinanceEnquirySummary,
} from "./financeUtils";
import type { BankOffer, EVModel } from "@/types";

interface FinanceStepSummaryProps {
  selectedBank: BankOffer;
  selectedVehicle: EVModel;
  termYears: number;
  availableTermYears: number[];
  onTermYearsChange: (value: number) => void;
  summary: FinanceEnquirySummary;
  insuranceCost: number;
  processingFee: number;
  form: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Partial<Record<"name" | "email" | "phone", string>>;
  serverError: string | null;
  submitting: boolean;
  onFormChange: (field: "name" | "email" | "phone", value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function FinanceStepSummary({
  selectedBank,
  selectedVehicle,
  termYears,
  availableTermYears,
  onTermYearsChange,
  summary,
  insuranceCost,
  processingFee,
  form,
  errors,
  serverError,
  submitting,
  onFormChange,
  onBack,
  onSubmit,
}: FinanceStepSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Step 4</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Finalize and submit your enquiry</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Choose the loan duration, review the final finance summary, and send your details to the team.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
            <p className="text-sm font-medium text-white">Loan duration</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Changing the term updates the EMI and total payable instantly.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableTermYears.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onTermYearsChange(value)}
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
          </div>

          <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Contact details</p>
                <p className="mt-1 text-sm text-zinc-400">We will use these details for your finance follow-up.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InputField
                label="Full name"
                value={form.name}
                onChange={(value) => onFormChange("name", value)}
                placeholder="Jane Smith"
                icon={UserRound}
                error={errors.name}
              />
              <InputField
                label="Email"
                value={form.email}
                onChange={(value) => onFormChange("email", value)}
                placeholder="jane@example.com"
                icon={Mail}
                type="email"
                error={errors.email}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Phone"
                value={form.phone}
                onChange={(value) => onFormChange("phone", value)}
                placeholder="+44 7700 000000"
                icon={Phone}
                type="tel"
                error={errors.phone}
              />
            </div>

            {serverError ? (
              <div className="mt-4 rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {serverError}
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-24">
          <div className="overflow-hidden rounded-[1.9rem] border border-white/8 bg-[#091114]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={getSafeImageSrc(selectedVehicle.heroImage)}
                alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute left-5 bottom-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">
                  Finance enquiry
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h3>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Selected bank</span>
                  <span className="font-semibold text-white">{selectedBank.bank}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Interest rate</span>
                  <span className="font-semibold text-white">{selectedBank.interestRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <BreakdownRow label="Financed amount" value={formatCurrency(summary.loanAmount)} />
                <BreakdownRow label="Monthly EMI" value={formatCurrency(summary.monthlyPayment)} />
                <BreakdownRow label="Insurance cost (monthly)" value={formatCurrency(insuranceCost)} />
                <BreakdownRow label="Total insurance cost" value={formatCurrency(summary.totalInsuranceCost)} />
                <BreakdownRow label="Processing fee" value={formatCurrency(processingFee)} />
                <BreakdownRow label="Total payable amount" value={formatCurrency(summary.totalPayableAmount)} highlight />
              </div>
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
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit finance enquiry"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: typeof UserRound;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-[1.25rem] border bg-[#0F1518] py-3 pl-11 pr-4 text-sm text-white outline-none transition ${
            error ? "border-rose-400/40" : "border-white/10 focus:border-cyan-400/35"
          }`}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/20 px-4 py-3 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={`font-medium ${highlight ? "text-emerald-300" : "text-white"}`}>{value}</span>
    </div>
  );
}
