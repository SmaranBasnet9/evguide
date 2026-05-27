import type { ConsultationFormState, RangePriority, PerformancePriority } from "@/types/consultation";

const BODY_TYPES = [
  { value: "any", label: "Any style" },
  { value: "suv", label: "SUV / Crossover" },
  { value: "hatchback", label: "Hatchback" },
  { value: "estate", label: "Estate" },
  { value: "saloon", label: "Saloon" },
  { value: "city", label: "City Car" },
];

const UK_BRANDS = [
  "Tesla", "MG", "Volkswagen", "BMW", "Hyundai", "Kia",
  "Audi", "Nissan", "Polestar", "Volvo", "Mercedes",
  "Ford", "Renault", "MINI", "BYD", "Vauxhall",
];

const PRIORITY_LEVELS: { value: RangePriority; label: string }[] = [
  { value: "low", label: "Not a priority" },
  { value: "medium", label: "Important" },
  { value: "high", label: "Essential" },
];

interface Props {
  state: ConsultationFormState;
  onChange: (partial: Partial<ConsultationFormState>) => void;
}

export default function StepPreferences({ state, onChange }: Props) {
  function toggleBrand(brand: string) {
    const next = state.brand_preference.includes(brand)
      ? state.brand_preference.filter((b) => b !== brand)
      : [...state.brand_preference, brand];
    onChange({ brand_preference: next });
  }

  return (
    <div className="space-y-6">
      {/* Body type */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Preferred body style</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() =>
                onChange({ body_type_preference: bt.value === "any" ? null : bt.value })
              }
              className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all ${
                (bt.value === "any" && !state.body_type_preference) ||
                state.body_type_preference === bt.value
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-brand/40 hover:text-white"
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand preference */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-white">Brand preference</p>
          <p className="mt-1 text-xs leading-5 text-white/40">
            Select any brands you&apos;d particularly like or exclude. Leave empty for no preference.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {UK_BRANDS.map((brand) => {
            const selected = state.brand_preference.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  selected
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:border-brand/40 hover:text-white"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Range priority */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
        <p className="text-sm font-semibold text-white">
          How important is long range to you?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange({ range_priority: level.value })}
              className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all ${
                state.range_priority === level.value
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-brand/40 hover:text-white"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance priority */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
        <p className="text-sm font-semibold text-white">
          How important is performance?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange({ performance_priority: level.value as PerformancePriority })}
              className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all ${
                state.performance_priority === level.value
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-brand/40 hover:text-white"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-white">Anything else?</p>
          <p className="mt-1 text-xs leading-5 text-white/40">
            Any specific needs, concerns, or things you&apos;d like us to keep in mind.
          </p>
        </div>
        <textarea
          value={state.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="e.g. I need a tow bar, or I&apos;m interested in salary sacrifice..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}
