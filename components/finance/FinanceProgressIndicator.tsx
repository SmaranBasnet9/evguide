interface FinanceProgressIndicatorProps {
  currentStep: number;
}

const steps = ["Bank", "Vehicle", "Calculator", "Summary"] as const;

export default function FinanceProgressIndicator({
  currentStep,
}: FinanceProgressIndicatorProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const complete = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  complete
                    ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-300"
                    : active
                      ? "border-cyan-400/30 bg-cyan-400/12 text-cyan-300"
                      : "border-white/10 bg-white/[0.03] text-zinc-500"
                }`}
              >
                {stepNumber}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Step {stepNumber}
                </p>
                <p className="truncate text-sm font-medium text-white">{step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
