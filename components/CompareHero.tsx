import { EVModel } from "@/types";

interface Props {
  models: EVModel[];
  selectedA: string;
  selectedB: string;
  onSelectA: (value: string) => void;
  onSelectB: (value: string) => void;
}

export default function CompareHero({ models, selectedA, selectedB, onSelectA, onSelectB }: Props) {
  const modelA = models.find((m) => m.id === selectedA);
  const modelB = models.find((m) => m.id === selectedB);

  const handleSwap = () => {
    const temp = selectedA;
    onSelectA(selectedB);
    onSelectB(temp);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[300px] w-[400px] translate-x-1/2 rounded-full bg-blue-600/20 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
            Side-by-Side Comparison
          </p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight text-white lg:text-6xl">
            Compare Your Favorite EVs{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
              side-by-side
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-200">
            Start a guided comparison and see clear differences in range,
            battery, performance, and price.
          </p>
        </div>

        {/* Selector */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-3xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur-md">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
              {/* Selector A */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  1st EV
                </label>
                <select
                  value={selectedA}
                  onChange={(e) => onSelectA(e.target.value)}
                  className="w-full rounded-2xl border border-cyan-300/70 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">Select 1st EV</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model} — £{m.price.toLocaleString()}
                    </option>
                  ))}
                </select>
                {modelA && (
                  <p className="mt-1.5 text-xs text-cyan-200">
                    {modelA.rangeKm} km range · {modelA.batteryKWh} kWh
                  </p>
                )}
              </div>

              {/* Swap button */}
              <div className="flex items-center justify-center pt-6">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white transition hover:scale-105 hover:border-white/60 hover:bg-white/30"
                  title="Swap selections"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Selector B */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                  2nd EV
                </label>
                <select
                  value={selectedB}
                  onChange={(e) => onSelectB(e.target.value)}
                  className="w-full rounded-2xl border border-white/50 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select 2nd EV</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.model} — £{m.price.toLocaleString()}
                    </option>
                  ))}
                </select>
                {modelB && (
                  <p className="mt-1.5 text-xs text-slate-300">
                    {modelB.rangeKm} km range · {modelB.batteryKWh} kWh
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
