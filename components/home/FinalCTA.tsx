import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(34,211,238,0.08),rgba(255,255,255,0.04))] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.42)] md:p-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Final step</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Find your best EV in under 60 seconds</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-200">
              Answer a few quick questions and get matched to the right EV for your budget and lifestyle.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/ai-match" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.24)] hover:shadow-[0_0_38px_rgba(16,185,129,0.34)]">
              Start AI Match
            </Link>
            <Link href="/vehicles" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/20 px-8 py-4 text-lg font-medium text-white transition hover:bg-white/10">
              Browse EVs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
