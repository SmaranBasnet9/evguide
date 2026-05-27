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
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Step 4</p>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">Finalize and submit your enquiry</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
          Choose the loan duration, review the final finance summary, and send your details to the team.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-900">Loan duration</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">
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
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {value} yr
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-cyan-600">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Contact details</p>
                <p className="mt-1 text-sm text-gray-500">We will use these details for your finance follow-up.</p>
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
              <div className="mt-4 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:sticky xl:top-24">
          <div className="overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={getSafeImageSrc(selectedVehicle.heroImage)}
                alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-5 bottom-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-200">
                  Finance enquiry
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h3>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-[1.4rem] border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Selected bank</span>
                  <span className="font-semibold text-gray-900">{selectedBank.bank}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Interest rate</span>
                  <span className="font-semibold text-gray-900">{selectedBank.interestRate.toFixed(1)}%</span>
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
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-[1.25rem] border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition ${
            error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          }`}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
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
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-emerald-600" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}
