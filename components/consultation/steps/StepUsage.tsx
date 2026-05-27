import { NumberField } from "@/components/consultation/ConsultationStep";
import type { ConsultationFormState } from "@/types/consultation";

const FAMILY_SIZES = [1, 2, 3, 4, 5, 6];

interface Props {
  state: ConsultationFormState;
  onChange: (partial: Partial<ConsultationFormState>) => void;
}

export default function StepUsage({ state, onChange }: Props) {
  function handleDailyMiles(v: number | null) {
    onChange({
      daily_miles: v,
      weekly_miles: v != null ? Math.round(v * 7) : null,
      yearly_miles: v != null ? Math.round(v * 365) : null,
    });
  }

  return (
    <div className="space-y-6">
      {/* Mileage */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Daily mileage</p>
          <p className="mt-1 text-xs leading-5 text-white/40">
            Enter your typical daily driving distance — weekly and yearly will auto-fill.
          </p>
        </div>

        <NumberField
          label="Daily miles"
          value={state.daily_miles}
          onChange={handleDailyMiles}
          suffix="mi/day"
          placeholder="e.g. 30"
          min={0}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label="Weekly miles"
            value={state.weekly_miles}
            onChange={(v) => onChange({ weekly_miles: v })}
            suffix="mi/wk"
            placeholder="auto"
            min={0}
          />
          <NumberField
            label="Yearly miles"
            value={state.yearly_miles}
            onChange={(v) => onChange({ yearly_miles: v })}
            suffix="mi/yr"
            placeholder="auto"
            min={0}
          />
        </div>
      </div>

      {/* Family size */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Family / household size</p>
          <p className="mt-1 text-xs leading-5 text-white/40">
            Helps us match seat count and boot space requirements.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAMILY_SIZES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ family_size: n })}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition-all ${
                state.family_size === n
                  ? "border-brand bg-brand/15 text-brand"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-brand/40 hover:text-white"
              }`}
            >
              {n === 6 ? "6+" : n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
