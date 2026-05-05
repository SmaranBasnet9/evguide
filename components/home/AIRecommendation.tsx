"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, PoundSterling, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Personalised EV matches based on your real priorities",
  "Monthly cost insights before you speak to a dealer",
  "Faster, more confident decisions with less research",
];

export default function AIRecommendation() {
  return (
    <section className="bg-[#0D0D0D] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02]"
        >
          <div className="grid lg:grid-cols-[1fr_400px]">
            {/* Left */}
            <div className="p-8 md:p-12 lg:p-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                <Sparkles className="h-3 w-3" />
                Core product
              </span>

              <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
                Find your perfect EV{" "}
                <span className="text-gradient-brand">in under 60 seconds.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/50">
                We analyse your budget, mileage, charging access, and priorities to
                recommend the EVs that fit you best — not just the ones with the
                biggest ad spend.
              </p>

              <div className="mt-8 space-y-3">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
                    <span className="text-sm font-medium text-white/80">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/ai-match"
                className={cn(
                  buttonVariants(),
                  "mt-10 flex w-fit items-center gap-2 rounded-full bg-brand px-8 py-6 text-base font-semibold text-white shadow-[0_0_30px_rgba(31,191,159,0.3)] hover:bg-brand-hover",
                )}
              >
                Start Match
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — mock UI */}
            <div className="border-t border-white/5 bg-white/[0.015] p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="rounded-[1.5rem] border border-white/8 bg-[#111] p-5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                    <BrainCircuit className="h-4.5 w-4.5 text-brand" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                      AI Match preview
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">Decision snapshot</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Budget bar */}
                  <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Budget</span>
                      <span className="font-medium text-white">Under £40k</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 w-[68%] rounded-full bg-brand" />
                    </div>
                  </div>

                  {/* Charging bar */}
                  <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Charging access</span>
                      <span className="font-medium text-white">Home charger</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 w-[82%] rounded-full bg-cyan-400" />
                    </div>
                  </div>

                  {/* Match result */}
                  <div className="rounded-xl border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Best match</span>
                      <span className="font-semibold text-brand">MG4 · 91%</span>
                    </div>
                    <div className="mt-3 rounded-xl border border-brand/15 bg-brand/8 p-3.5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Affordable, efficient, easy to live with
                          </p>
                          <p className="mt-1.5 text-[11px] leading-5 text-white/40">
                            Great fit for mixed commuting with finance pressure kept sensible.
                          </p>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-flex items-center gap-1 rounded-lg border border-brand/20 bg-brand/10 px-2 py-1.5 text-[11px] font-semibold text-brand">
                            <PoundSterling className="h-3 w-3" />
                            318/mo
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
