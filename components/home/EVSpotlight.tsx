"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BatteryCharging, Gauge, PoundSterling, Zap, Star } from "lucide-react";

const SPOTLIGHTS = [
  {
    brand: "Hyundai",
    model: "IONIQ 6",
    tagline: "Long-range efficiency for UK motorways.",
    badge: "Editor's Pick",
    monthly: "£459/mo",
    accentColor: "rgba(31,191,159,0.18)",
    accentText: "text-brand",
    accentBorder: "border-brand/25",
    accentBg: "bg-brand/10",
    accentBtn: "bg-brand hover:bg-brand-hover",
    href: "/vehicles",
    stats: [
      { icon: Gauge,           label: "Real-world range", value: "491 km" },
      { icon: Zap,             label: "Rapid charge",     value: "18 min" },
      { icon: PoundSterling,   label: "Monthly est.",     value: "£459/mo" },
      { icon: BatteryCharging, label: "Battery",          value: "77.4 kWh" },
    ],
  },
  {
    brand: "Tesla",
    model: "Model Y",
    tagline: "The UK's best-selling EV two years running.",
    badge: "Best Seller",
    monthly: "£529/mo",
    accentColor: "rgba(34,211,238,0.18)",
    accentText: "text-cyan-400",
    accentBorder: "border-cyan-400/25",
    accentBg: "bg-cyan-400/10",
    accentBtn: "bg-cyan-500 hover:bg-cyan-400",
    href: "/vehicles",
    stats: [
      { icon: Gauge,           label: "Real-world range", value: "445 km" },
      { icon: Zap,             label: "Supercharge",      value: "25 min" },
      { icon: PoundSterling,   label: "Monthly est.",     value: "£529/mo" },
      { icon: BatteryCharging, label: "Battery",          value: "75 kWh" },
    ],
  },
  {
    brand: "BYD",
    model: "Seal",
    tagline: "Premium saloon at a fraction of the cost.",
    badge: "Best Value",
    monthly: "£389/mo",
    accentColor: "rgba(200,255,0,0.12)",
    accentText: "text-lime-400",
    accentBorder: "border-lime-400/25",
    accentBg: "bg-lime-400/10",
    accentBtn: "bg-lime-500 hover:bg-lime-400",
    href: "/vehicles",
    stats: [
      { icon: Gauge,           label: "Real-world range", value: "406 km" },
      { icon: Zap,             label: "Fast charge",      value: "26 min" },
      { icon: PoundSterling,   label: "Monthly est.",     value: "£389/mo" },
      { icon: BatteryCharging, label: "Battery",          value: "82.5 kWh" },
    ],
  },
] as const;

function SpotlightCard({ ev, index }: { ev: typeof SPOTLIGHTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 40% 20%, ${ev.accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Default state */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-end p-3"
          >
            <span className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${ev.accentText} ${ev.accentBorder} ${ev.accentBg}`}>
              <Star className="h-2.5 w-2.5" /> {ev.badge}
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              {ev.brand}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-white">
              {ev.model}
            </p>
            <p className={`mt-1 text-xs font-semibold ${ev.accentText}`}>{ev.monthly}</p>
            <p className="mt-0.5 text-[10px] text-white/30">{ev.tagline}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover reveal */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="hover"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-black/75 p-3 backdrop-blur-md"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {ev.brand}
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-white">{ev.model}</p>
              <p className={`mt-1 text-xs font-bold ${ev.accentText}`}>{ev.monthly}</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {ev.stats.map((s, si) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: si * 0.05 }}
                  className="flex flex-col items-start gap-1 rounded-xl border border-white/[0.08] bg-white/[0.05] p-2"
                >
                  <s.icon className={`h-3 w-3 ${ev.accentText}`} />
                  <span className="text-[9px] uppercase tracking-[0.12em] text-white/35">{s.label}</span>
                  <span className="text-[10px] font-bold leading-tight text-white">{s.value}</span>
                </motion.div>
              ))}
            </div>

            <Link
              href={ev.href}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-white transition ${ev.accentBtn}`}
            >
              View EV <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EVSpotlight() {
  return (
    <section className="bg-[#080808] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl">Editor&apos;s Pick</h2>
              <p className="text-sm text-white/40">This month&apos;s standout EVs, curated by our research team</p>
            </div>
          </div>
          <Link
            href="/vehicles"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-hover sm:inline-flex"
          >
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3-card portrait grid with hover-reveal */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SPOTLIGHTS.map((ev, i) => (
            <SpotlightCard key={`${ev.brand}-${ev.model}`} ev={ev} index={i} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
          >
            Explore all EVs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
