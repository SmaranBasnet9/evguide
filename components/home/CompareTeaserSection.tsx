"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitCompare } from "lucide-react";
import type { EVModel } from "@/types";

const POPULAR_PAIRS = [
  { labelA: "Tesla Model 3", labelB: "Hyundai IONIQ 6" },
  { labelA: "Tesla Model Y", labelB: "Kia EV6" },
  { labelA: "MG4",           labelB: "VW ID.3" },
];

interface CompareTeaserSectionProps {
  models?: EVModel[];
}

export default function CompareTeaserSection({ models = [] }: CompareTeaserSectionProps) {
  const topTwo = models.slice(0, 2);
  const compareHref =
    topTwo.length === 2
      ? `/compare?carA=${topTwo[0]!.id}&carB=${topTwo[1]!.id}`
      : "/compare";

  return (
    <section className="bg-[#0D0D0D] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left: copy + popular pairs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Compare</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Pick any two EVs.{" "}
              <span className="text-gradient-brand">Compare everything.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/50">
              Specs, range, charging speed, monthly cost, battery size — side by side. No
              spreadsheets. No dealer guesswork.
            </p>

            <div className="mt-8 space-y-2">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Popular comparisons
              </p>
              {POPULAR_PAIRS.map((pair, i) => (
                <Link
                  key={i}
                  href="/compare"
                  className="group flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-5 py-3.5 transition hover:border-brand/25 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3 text-sm font-medium text-white/65 group-hover:text-white">
                    <span>{pair.labelA}</span>
                    <span className="text-xs text-white/20">vs</span>
                    <span>{pair.labelB}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right: mock compare UI */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[1.75rem] border border-white/8 bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-3 border-b border-white/5 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                <GitCompare className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Side-by-side comparison
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">Any two EVs, instantly</p>
              </div>
            </div>

            {/* Column headers */}
            <div className="mt-5 grid grid-cols-[1fr_100px_1fr] gap-2">
              <div className="rounded-xl border border-brand/20 bg-brand/10 p-3 text-center">
                <p className="text-xs font-semibold text-brand">IONIQ 6</p>
              </div>
              <div />
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
                <p className="text-xs font-semibold text-white/50">Model Y</p>
              </div>
            </div>

            {/* Comparison rows */}
            <div className="mt-3 space-y-2">
              {[
                { label: "Real-world range", a: "491 km",    b: "445 km",    winA: true  },
                { label: "Monthly cost",     a: "£459/mo",   b: "£529/mo",   winA: true  },
                { label: "Charge 10–80%",    a: "18 min",    b: "25 min",    winA: true  },
                { label: "Battery",          a: "77.4 kWh",  b: "75.0 kWh",  winA: true  },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_100px_1fr] items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3"
                >
                  <p className={`text-center text-sm font-semibold ${row.winA ? "text-brand" : "text-white/55"}`}>
                    {row.a}
                  </p>
                  <p className="text-center text-[10px] text-white/30">{row.label}</p>
                  <p className={`text-center text-sm font-semibold ${!row.winA ? "text-brand" : "text-white/55"}`}>
                    {row.b}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={compareHref}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-semibold text-white shadow-[0_0_24px_rgba(31,191,159,0.3)] transition hover:bg-brand-hover"
            >
              Open Full Comparison
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
