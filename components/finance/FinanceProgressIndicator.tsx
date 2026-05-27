interface FinanceProgressIndicatorProps {
  currentStep: number;
}

const steps = ["Bank", "Vehicle", "Calculator", "Summary"] as const;

export default function FinanceProgressIndicator({
  currentStep,
}: FinanceProgressIndicatorProps) {
  return (
    <div className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4">
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
                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                    : active
                      ? "border-cyan-300 bg-cyan-100 text-cyan-700"
                      : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {stepNumber}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Step {stepNumber}
                </p>
                <p className="truncate text-sm font-medium text-gray-900">{step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
