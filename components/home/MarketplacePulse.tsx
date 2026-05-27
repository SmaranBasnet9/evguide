"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TRENDING_TAGS = [
  { label: "Sub-£30k EVs",      href: "/vehicles?maxPrice=30000" },
  { label: "Long Range",         href: "/vehicles?q=long+range" },
  { label: "Family EV",          href: "/vehicles?q=family" },
  { label: "Tesla Alternative",  href: "/vehicles?q=MG" },
  { label: "Under £400/mo",      href: "/finance" },
  { label: "Best Value 2024",    href: "/vehicles" },
];

function AnimatedCount({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || target === 0) return;
    started.current = true;
    const steps = 28;
    const duration = 700;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round((target * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target]);

  return <>{display > 0 ? display : target}</>;
}

interface MarketplacePulseProps {
  newThisWeek?: number;
  totalLive?: number;
}

export default function MarketplacePulse({ newThisWeek = 0, totalLive = 0 }: MarketplacePulseProps) {
  return (
    <section className="border-y border-white/5 bg-[#0B0B0B] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left: live stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-medium text-white/40">Live marketplace</span>
            </div>

            {/* EVs reviewed */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tabular-nums text-white">2,800+</span>
              <span className="text-xs text-white/40">UK EVs reviewed</span>
            </div>

            {/* Dealer listings this week */}
            {newThisWeek > 0 && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-brand" />
                <span className="text-xl font-bold tabular-nums text-brand">
                  <AnimatedCount target={newThisWeek} />
                </span>
                <span className="text-xs text-white/40">dealer listings this week</span>
              </div>
            )}

            {/* Total live dealer listings */}
            {totalLive > 0 && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-white">
                  <AnimatedCount target={totalLive} />
                </span>
                <span className="text-xs text-white/40">live dealer EVs</span>
              </div>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">4.9</span>
              <span className="text-lg text-brand">★</span>
              <span className="ml-1 text-xs text-white/40">avg rating</span>
            </div>
          </motion.div>

          {/* Right: trending searches */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-brand" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Trending searches
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
