"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-brand/25 bg-[#0D1A17]"
        >
          {/* Glow blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-[80px]" />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex flex-col items-start gap-8 p-10 md:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">
                Ready to decide
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Find your best EV in{" "}
                <span className="text-gradient-brand">under 60 seconds.</span>
              </h2>
              <p className="mt-4 text-lg leading-8 text-white/50">
                Answer a few quick questions and get matched to the right EV for your
                budget, range, and lifestyle.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-brand px-8 py-6 text-base font-semibold text-white shadow-[0_0_40px_rgba(31,191,159,0.4)] hover:bg-brand-hover"
              >
                <Link href="/ai-match" className="flex items-center gap-2">
                  Start Match
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/15 bg-white/5 px-8 py-6 text-base font-medium text-white hover:bg-white/10"
              >
                <Link href="/vehicles">Browse EVs</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
