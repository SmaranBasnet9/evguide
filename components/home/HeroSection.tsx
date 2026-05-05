"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  featuredCard?: ReactNode;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function HeroSection({ featuredCard }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0A0A] pt-20">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left column */}
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                <Sparkles className="h-3 w-3" />
                AI-powered · UK focused
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-6 text-5xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-[4.5rem]"
            >
              Find the{" "}
              <span className="text-gradient-brand">perfect EV</span>
              <br />
              for your life.
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 text-lg leading-8 text-white/60 sm:text-xl"
            >
              Compare real range, monthly costs, and charging fit — then get
              matched in under 60 seconds.
            </motion.p>

            <motion.div
              {...fadeUp(0.3)}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/ai-match"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-brand px-8 py-6 text-base font-semibold text-white shadow-[0_0_30px_rgba(31,191,159,0.4)] transition-all hover:bg-brand-hover hover:shadow-[0_0_40px_rgba(31,191,159,0.5)]",
                )}
              >
                Start AI Match
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/vehicles"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full border-white/15 bg-white/5 px-8 py-6 text-base font-medium text-white hover:border-white/25 hover:bg-white/10",
                )}
              >
                Browse EVs
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp(0.4)}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {[
                ["2,800+", "EVs available"],
                ["£0", "to get started"],
                ["60 sec", "AI match"],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-semibold text-white">{value}</span>
                  <span className="text-xs text-white/40">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — featured card */}
          {featuredCard && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="relative min-h-[480px] lg:min-h-[560px]"
            >
              {featuredCard}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </section>
  );
}
