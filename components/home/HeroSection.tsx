"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const HeroSearchConsole = dynamic(() => import("./HeroSearchConsole"), { ssr: false });

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
      {/* 3D background scene — full viewport, pointer-events off */}
      <HeroScene />

      {/* Fallback colour glows behind the canvas */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/8 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[200px] w-[200px] rounded-full bg-cyan-500/6 blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Dark vignette so text stays readable over the 3D */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:pb-24 sm:pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left column */}
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                <Sparkles className="h-3 w-3" />
                AI-powered · UK focused
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-4 text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]"
            >
              Find the{" "}
              <span className="text-gradient-brand">perfect EV</span>{" "}
              for your life.
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="mt-3 text-sm text-white/45"
            >
              2,800+ UK EVs · AI matched · Free to use
            </motion.p>

            {/* Search / Sell form */}
            <motion.div {...fadeUp(0.25)} className="mt-6">
              <HeroSearchConsole />
            </motion.div>
          </div>

          {/* Right column — featured card (desktop only) */}
          {featuredCard && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="relative hidden min-h-[480px] lg:block lg:min-h-[560px]"
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
