"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Calculator, ChevronRight, Sparkles } from "lucide-react";

const BANNERS = [
  {
    Icon:      BrainCircuit,
    tag:       "AI Match",
    heading:   "Find your perfect EV in 60 seconds",
    sub:       "5 questions · personalised shortlist · no dealer pressure",
    bullets:   ["Instant personalised shortlist", "No email required", "Compare side-by-side"],
    cta:       "Start AI Match",
    href:      "/ai-match",
    accentRgb: "31,191,159",
    accentCls: "text-brand",
    borderCls: "border-brand/25",
    bgCls:     "bg-brand/[0.08]",
    glowCls:   "from-brand/[0.18] via-brand/[0.06] to-transparent",
    btnCls:    "bg-brand hover:bg-brand-hover shadow-[0_0_20px_rgba(31,191,159,0.3)]",
  },
  {
    Icon:      Calculator,
    tag:       "Finance",
    heading:   "Know your monthly cost before you commit",
    sub:       "Interactive calculator · no credit check · no data shared",
    bullets:   ["Live monthly estimates", "PCP & HP options", "No hard credit check"],
    cta:       "Calculate now",
    href:      "/finance",
    accentRgb: "34,211,238",
    accentCls: "text-cyan-400",
    borderCls: "border-cyan-400/25",
    bgCls:     "bg-cyan-500/[0.08]",
    glowCls:   "from-cyan-500/[0.18] via-cyan-500/[0.06] to-transparent",
    btnCls:    "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  },
] as const;

export default function ActionBanners() {
  return (
    <section className="bg-[#080808] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
            <Sparkles className="h-5 w-5 text-white/60" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white sm:text-2xl">Tools &amp; Calculators</h2>
            <p className="text-sm text-white/40">Free tools to help you decide with confidence</p>
          </div>
        </div>

        {/* Cards — same grid as all other sections */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BANNERS.map((b, i) => {
            const Icon = b.Icon;
            return (
              <motion.article
                key={b.tag}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111111] transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
              >
                {/* Top: tag + heading */}
                <div className="px-5 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${b.accentCls}`}>
                        {b.tag}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold leading-snug text-white">
                        {b.heading}
                      </h3>
                      <p className="mt-1 text-sm text-white/45">{b.sub}</p>
                    </div>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${b.borderCls} ${b.bgCls}`}
                    >
                      <Icon className={`h-5 w-5 ${b.accentCls}`} />
                    </div>
                  </div>
                </div>

                {/* Middle: visual zone — same h-40/h-44 */}
                <div
                  className="relative mx-5 mt-4 h-40 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] sm:h-44"
                >
                  {/* Gradient fill */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${b.glowCls}`} />
                  {/* Bullet points centered */}
                  <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6">
                    {b.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-2.5">
                        <div
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: `rgba(${b.accentRgb},0.9)` }}
                        />
                        <span className="text-sm font-medium text-white/70">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] px-5 py-4">
                  <p className="text-sm text-white/50">{b.cta}</p>
                  <Link
                    href={b.href}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-md transition-all hover:scale-110"
                    style={{}}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `rgba(${b.accentRgb},1)`;
                      (e.currentTarget as HTMLAnchorElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "white";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A";
                    }}
                    aria-label={b.cta}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
