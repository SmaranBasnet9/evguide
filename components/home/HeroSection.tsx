"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Zap, Leaf, Car, Users, Gauge, PoundSterling,
  BatteryCharging, MapPin, Star, CreditCard, Flame,
} from "lucide-react";

const HeroSearchConsole = dynamic(() => import("./HeroSearchConsole"), { ssr: false });

interface HeroSectionProps {
  featuredCard?: ReactNode;
}

const BRANDS = [
  { label: "Tesla",   href: "/vehicles?q=Tesla",   emoji: "⚡" },
  { label: "BMW",     href: "/vehicles?q=BMW",     emoji: "🔵" },
  { label: "Kia",     href: "/vehicles?q=Kia",     emoji: "🌿" },
  { label: "BYD",     href: "/vehicles?q=BYD",     emoji: "🔋" },
  { label: "VW",      href: "/vehicles?q=VW",      emoji: "🚗" },
  { label: "Hyundai", href: "/vehicles?q=Hyundai", emoji: "🌐" },
  { label: "Audi",    href: "/vehicles?q=Audi",    emoji: "💎" },
  { label: "Volvo",   href: "/vehicles?q=Volvo",   emoji: "🛡️" },
  { label: "Polestar",href: "/vehicles?q=Polestar",emoji: "✨" },
  { label: "MG",      href: "/vehicles?q=MG",      emoji: "🎯" },
  { label: "Renault", href: "/vehicles?q=Renault", emoji: "🔷" },
  { label: "Nissan",  href: "/vehicles?q=Nissan",  emoji: "🌊" },
];

const CHIPS = [
  { label: "All EVs",       href: "/vehicles",                    icon: Zap,            accent: "text-brand"   },
  { label: "Hybrid",        href: "/vehicles?q=hybrid",           icon: Leaf,           accent: "text-emerald-400", hot: true },
  { label: "New EVs",       href: "/vehicles?sort=newest",        icon: Zap,            accent: "text-brand"   },
  { label: "Used EVs",      href: "/used-evs",                    icon: Car,            accent: "text-white/50" },
  { label: "SUVs",          href: "/vehicles?bodyType=SUV",       icon: Car,            accent: "text-violet-400" },
  { label: "Family EVs",    href: "/vehicles?q=family",           icon: Users,          accent: "text-violet-400" },
  { label: "Longest Range", href: "/vehicles?sort=range",         icon: Gauge,          accent: "text-cyan-400", hot: true },
  { label: "Fast Charge",   href: "/vehicles?chargingSpeedDcMin=100", icon: BatteryCharging, accent: "text-brand" },
  { label: "City EV",       href: "/vehicles?q=city",             icon: MapPin,         accent: "text-rose-400" },
  { label: "Under £30k",    href: "/vehicles?maxPrice=30000",     icon: PoundSterling,  accent: "text-amber-400", hot: true },
  { label: "Best Value",    href: "/vehicles?sort=best_value",    icon: Star,           accent: "text-amber-400" },
  { label: "Get Finance",   href: "/finance",                     icon: CreditCard,     accent: "text-white/50" },
] as const;

export default function HeroSection({ featuredCard: _featuredCard }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden pt-[72px]">

      {/* ── TOP: Green hero ───────────────────────────────────────────── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
        style={{
          background: "linear-gradient(135deg, #00C853 0%, #00BFA5 55%, #00897B 100%)",
        }}
      >
        {/* Subtle dot pattern — no expensive blurs */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative w-full max-w-2xl text-center">
          {/* Badge */}
          <div className="anim-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-[#0A2A1A]/20 bg-[#0A2A1A]/10 px-3 py-1" style={{ animationDelay: "0ms" }}>
            <Zap className="h-3 w-3 text-[#0A2A1A]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0A2A1A]">2,800+ UK EVs &amp; Hybrids</span>
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up text-4xl font-black uppercase leading-[1.02] tracking-tight text-[#0A2A1A] sm:text-5xl lg:text-[3.5rem]"
            style={{ animationDelay: "80ms" }}
          >
            FIND, BUY &amp; SELL<br />
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
              YOUR EV OR HYBRID
            </span>
          </h1>

          <p className="anim-fade-up mt-3 text-sm font-medium text-[#0A2A1A]/65 sm:text-base" style={{ animationDelay: "160ms" }}>
            AI matched &middot; Free to use &middot; No hidden fees
          </p>

          {/* Search console */}
          <div className="anim-fade-up mt-6 w-full" style={{ animationDelay: "240ms" }}>
            <HeroSearchConsole />
          </div>

          {/* Stats trust strip */}
          <div className="anim-fade-up mt-8 flex items-center justify-center gap-5 sm:gap-10" style={{ animationDelay: "360ms" }}>
            {[
              { value: "2,800+", label: "UK EVs listed" },
              { value: "500+",   label: "Verified dealers" },
              { value: "£0",     label: "No fees ever" },
              { value: "AI",     label: "Smart matched" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-black leading-none text-[#0A2A1A] sm:text-2xl">{s.value}</span>
                <span className="text-[10px] font-medium text-[#0A2A1A]/55 sm:text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Light browse strip ─────────────────────────────────── */}
      <div className="bg-white border-t border-gray-100">

        {/* Browse by Brands */}
        <div className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Browse by Brand
            </p>
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {BRANDS.map((b, i) => (
                <Link
                  key={b.label}
                  href={b.href}
                  className="anim-fade-up group flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 transition-all duration-200 hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                  style={{ animationDelay: `${320 + i * 30}ms` }}
                >
                  <span className="text-sm leading-none">{b.emoji}</span>
                  <span className="whitespace-nowrap">{b.label}</span>
                </Link>
              ))}
              <Link
                href="/vehicles"
                className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white whitespace-nowrap"
              >
                View all →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick filter chips */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div
              className="flex items-center gap-2 overflow-x-auto py-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <span className="mr-1 hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-300 sm:block">
                Filter
              </span>
              {CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="group relative shrink-0 flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-500 transition-all duration-200 hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                  >
                    <Icon className={`h-3 w-3 shrink-0 ${chip.accent}`} />
                    <span className="whitespace-nowrap">{chip.label}</span>
                    {"hot" in chip && chip.hot && (
                      <span className="flex items-center gap-0.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-1.5 py-px text-[9px] font-bold text-orange-500">
                        <Flame className="h-2 w-2" />HOT
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
