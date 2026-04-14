import type { ReactNode } from "react";
import { BatteryCharging, ShieldCheck, Sparkles } from "lucide-react";
import HeroSearchConsole from "./HeroSearchConsole";

interface HeroSectionProps {
  featuredCard?: ReactNode;
}

export default function HeroSection({ featuredCard }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28" style={{ background: "linear-gradient(135deg, #E8F8F5, #FFFFFF)" }}>
      {/* Soft green glow accents */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#1FBF9F]/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#D1F2EB]/60 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top: centered badge + headline */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1FBF9F]/30 bg-[#E8F8F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1FBF9F]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered EV decisions for UK buyers
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] text-[#1A1A1A] sm:text-6xl lg:text-7xl">
            Find the smartest electric car for your budget
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#4B5563] sm:text-xl">
            Compare EVs, understand real monthly costs, and get matched to the right car in minutes.
          </p>
        </div>

        {/* Middle: search console + featured EV card side-by-side */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start">

          {/* Left: search console + trust strip */}
          <div className="space-y-6">
            <HeroSearchConsole />

            {/* Trust stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pl-1 text-sm font-medium text-[#4B5563]">
              <span>No signup required</span>
              <span>·</span>
              <span>Takes 30 seconds</span>
              <span>·</span>
              <span>UK-focused EV insights</span>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#1FBF9F]" />
                <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">Decision-first guidance</p>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  Built to answer fit, affordability, and next step — not just show listings.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <BatteryCharging className="h-5 w-5 text-[#1FBF9F]" />
                <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">Real monthly cost lens</p>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                  Finance and running-cost context that feels useful before you speak to a dealer.
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px]">{featuredCard}</div>
        </div>
      </div>
    </section>
  );
}
