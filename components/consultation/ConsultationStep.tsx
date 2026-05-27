import type { ReactNode } from "react";
import { CONSULTATION_STEPS } from "@/types/consultation";

interface Props {
  currentStep: number; // 1-based
  title: string;
  subtitle: string;
  error?: string | null;
  children: ReactNode;
}

export default function ConsultationStep({
  currentStep,
  title,
  subtitle,
  error,
  children,
}: Props) {
  const total = CONSULTATION_STEPS.length;
  const progress = (currentStep / total) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-white/50">
          <span>
            Step {currentStep} of {total}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {CONSULTATION_STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step.id <= currentStep ? "bg-brand" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
          Step {currentStep}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 text-base leading-7 text-white/50">{subtitle}</p>
      </div>

      {/* Step content */}
      <div>{children}</div>

      {/* Validation error */}
      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Reusable option card ──────────────────────────────────────────────────────

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
  description?: string;
}

export function OptionCard({ selected, onClick, icon, label, description }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-150 ${
        selected
          ? "border-brand bg-brand/15 shadow-sm shadow-brand/10"
          : "border-white/10 bg-white/[0.04] hover:border-brand/40 hover:bg-white/[0.08]"
      }`}
    >
      {icon && (
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            selected
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-white/10 bg-white/[0.06] text-white/50 group-hover:border-brand/30 group-hover:text-brand"
          }`}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold leading-snug transition-colors ${
            selected ? "text-brand" : "text-white"
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
        )}
      </div>
      {/* Selection indicator */}
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          selected ? "border-brand bg-brand" : "border-white/20 bg-white/[0.06]"
        }`}
      >
        {selected && (
          <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 8 8">
            <path d="M6.5 1.5L3 5 1.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ── Number input ──────────────────────────────────────────────────────────────

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = "0",
  min,
  max,
}: NumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/70">{label}</label>
      <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {prefix && (
          <span className="select-none border-r border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium text-white/50">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? null : Number(raw));
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
        />
        {suffix && (
          <span className="select-none border-l border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium text-white/50">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
