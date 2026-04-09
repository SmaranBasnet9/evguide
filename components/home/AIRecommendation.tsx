import Link from "next/link";
import { BrainCircuit, CheckCircle2, PoundSterling, Sparkles } from "lucide-react";

const benefits = [
  "Personalized EV matches",
  "Real monthly cost insights",
  "Faster and smarter decisions",
];

export default function AIRecommendation() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111111] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)]">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Core product
              </div>
              <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Find your perfect EV in under 60 seconds</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                We analyse your budget, mileage, charging access, and priorities to recommend the EVs that fit you best.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span className="text-base font-medium text-zinc-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/ai-match" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.22)] hover:shadow-[0_0_40px_rgba(16,185,129,0.32)]">
                  Start AI Match
                </Link>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <BrainCircuit className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">AI Match preview</p>
                    <p className="mt-1 text-lg font-semibold text-white">Decision snapshot</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Budget</span>
                      <span className="font-medium text-white">Under £40k</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-zinc-900">
                      <div className="h-2 w-[68%] rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Charging access</span>
                      <span className="font-medium text-white">Home charger</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-zinc-900">
                      <div className="h-2 w-[82%] rounded-full bg-cyan-400" />
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Best match</span>
                      <span className="font-medium text-emerald-300">MG4 · 91%</span>
                    </div>
                    <div className="mt-4 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">Affordable, efficient, easy to live with</p>
                          <p className="mt-2 text-sm leading-6 text-zinc-300">Great fit for mixed commuting with finance pressure kept sensible.</p>
                        </div>
                        <div className="text-right">
                          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200"><PoundSterling className="h-3.5 w-3.5" />£318/mo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
