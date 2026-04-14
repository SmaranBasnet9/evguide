import Link from "next/link";
import { BrainCircuit, CheckCircle2, PoundSterling, Sparkles } from "lucide-react";

const benefits = [
  "Personalized EV matches",
  "Real monthly cost insights",
  "Faster and smarter decisions",
];

export default function AIRecommendation() {
  return (
    <section className="bg-[#F8FAF9] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-[#E5E7EB] bg-white shadow-md">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)]">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D1F2EB] bg-[#E8F8F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1FBF9F]">
                <Sparkles className="h-3.5 w-3.5" />
                Core product
              </div>
              <h2 className="mt-6 text-4xl font-semibold text-[#1A1A1A] sm:text-5xl">Find your perfect EV in under 60 seconds</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6B7280]">
                We analyse your budget, mileage, charging access, and priorities to recommend the EVs that fit you best.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] px-4 py-4">
                    <CheckCircle2 className="h-5 w-5 text-[#1FBF9F]" />
                    <span className="text-base font-medium text-[#1A1A1A]">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/ai-match" className="inline-flex items-center justify-center rounded-full bg-[#1FBF9F] px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-[#17A589]">
                  Start Match
                </Link>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] bg-[#F8FAF9] p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D1F2EB] bg-[#E8F8F5]">
                    <BrainCircuit className="h-5 w-5 text-[#1FBF9F]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">AI Match preview</p>
                    <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">Decision snapshot</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                      <span>Budget</span>
                      <span className="font-medium text-[#1A1A1A]">Under £40k</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
                      <div className="h-2 w-[68%] rounded-full bg-[#1FBF9F]" />
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                      <span>Charging access</span>
                      <span className="font-medium text-[#1A1A1A]">Home charger</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[#E5E7EB]">
                      <div className="h-2 w-[82%] rounded-full bg-[#00D1B2]" />
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#F8FAF9] p-4">
                    <div className="flex items-center justify-between text-sm text-[#6B7280]">
                      <span>Best match</span>
                      <span className="font-medium text-[#1FBF9F]">MG4 · 91%</span>
                    </div>
                    <div className="mt-4 rounded-[1.25rem] border border-[#D1F2EB] bg-[#E8F8F5] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#1A1A1A]">Affordable, efficient, easy to live with</p>
                          <p className="mt-2 text-sm leading-6 text-[#6B7280]">Great fit for mixed commuting with finance pressure kept sensible.</p>
                        </div>
                        <div className="text-right">
                          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1FBF9F]"><PoundSterling className="h-3.5 w-3.5" />£318/mo</p>
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
