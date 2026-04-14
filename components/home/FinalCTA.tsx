import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-[#F8FAF9] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-[#D1F2EB]" style={{ background: "linear-gradient(135deg, #1FBF9F, #00D1B2)" }}>
          <div className="p-10 md:p-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Final step</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Find your best EV in under 60 seconds</h2>
              <p className="mt-5 text-lg leading-8 text-white/85">
                Answer a few quick questions and get matched to the right EV for your budget and lifestyle.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/ai-match" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#1FBF9F] shadow-md transition hover:bg-[#F8FAF9]">
                Start Match
              </Link>
              <Link href="/vehicles" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-4 text-lg font-medium text-white transition hover:bg-white/25">
                Browse EVs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
