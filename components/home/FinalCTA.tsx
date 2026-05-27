import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/20 bg-white shadow-[0_8px_40px_rgba(31,191,159,0.12)]">
          {/* Subtle glow blobs — smaller radii, hidden on mobile */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[50px]" />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-[50px]" />
          </div>

          <div className="relative flex flex-col items-center gap-8 px-8 py-16 text-center md:py-20 lg:py-24">
            <h2 className="text-4xl font-semibold text-gray-900 sm:text-5xl lg:text-6xl">
              Your next EV is{" "}
              <span className="text-gradient-brand">in here somewhere.</span>
            </h2>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/vehicles"
                className="flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(31,191,159,0.35)] transition hover:bg-brand-hover"
              >
                Find My EV
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/consultation"
                className="text-sm font-medium text-gray-400 transition hover:text-gray-900"
              >
                Talk to an expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
