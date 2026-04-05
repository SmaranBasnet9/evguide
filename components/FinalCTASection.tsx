import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-sm font-semibold text-blue-300">Ready to decide?</p>
        <h2 className="mt-3 text-4xl font-extrabold leading-tight">
          Compare cars. Estimate EMI. Drive smarter.
        </h2>
        <p className="mt-4 text-lg text-blue-100/80">
          Join thousands of UK buyers who made their EV decision faster with EV Guide.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/compare"
            className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            Compare Cars →
          </Link>
          <Link
            href="/finance"
            className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Estimate EMI →
          </Link>
        </div>

        <p className="mt-8 text-sm text-blue-200/60">
          Free to use · No registration · Trusted by 10,000+ UK buyers
        </p>
      </div>
    </section>
  );
}
