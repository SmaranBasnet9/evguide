"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Landmark, Search } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Discover & Compare",
    description:
      "Explore every EV on the UK market. Compare real-world range, battery specs, and tech features side-by-side.",
    href: "/vehicles",
    cta: "Browse EVs",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Matching",
    description:
      "Tell our AI your daily commute, family size, and priorities. Get a shortlist that actually fits your life.",
    href: "/ai-match",
    cta: "Try AI Match",
  },
  {
    number: "03",
    icon: Landmark,
    title: "Transparent Finance",
    description:
      "See exact monthly costs, running cost savings, and finance options before you speak to anyone.",
    href: "/finance",
    cta: "Check affordability",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            A simple path to{" "}
            <span className="text-gradient-brand">electric.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/50">
            Skip the dealership guesswork. Our tools guide you from discovery to a
            confident decision.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent md:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/6 bg-white/[0.03] p-8 transition-all duration-300 hover:border-brand/25 hover:bg-white/[0.05]"
              >
                {/* Corner accent */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2rem] bg-brand/5 transition-colors group-hover:bg-brand/10" />

                {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand transition-colors group-hover:border-brand/40 group-hover:bg-brand/20">
                  <Icon className="h-6 w-6" />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand/70">
                  Step {step.number}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/50">{step.description}</p>

                <Link
                  href={step.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
                >
                  {step.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
