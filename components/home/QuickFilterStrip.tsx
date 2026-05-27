import Link from "next/link";
import {
  Zap,
  PoundSterling,
  Gauge,
  Users,
  MapPin,
  Star,
  BatteryCharging,
  Car,
  CreditCard,
  Flame,
  Leaf,
} from "lucide-react";

// ── Filter definitions ───────────────────────────────────────────────────────

const CHIPS = [
  {
    label: "All EVs",
    href: "/vehicles",
    icon: Zap,
    accent: "text-brand",
    hoverBorder: "hover:border-brand/40",
    hoverBg: "hover:bg-brand/10",
    hoverText: "hover:text-brand",
  },
  {
    label: "Hybrid",
    href: "/vehicles?q=hybrid",
    icon: Leaf,
    accent: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/40",
    hoverBg: "hover:bg-emerald-400/10",
    hoverText: "hover:text-emerald-400",
    hot: true,
  },
  {
    label: "New EVs",
    href: "/vehicles?sort=newest",
    icon: Zap,
    accent: "text-brand",
    hoverBorder: "hover:border-brand/40",
    hoverBg: "hover:bg-brand/10",
    hoverText: "hover:text-brand",
  },
  {
    label: "Used EVs",
    href: "/used-evs",
    icon: Car,
    accent: "text-white/50",
    hoverBorder: "hover:border-white/25",
    hoverBg: "hover:bg-white/[0.06]",
    hoverText: "hover:text-white",
  },
  {
    label: "SUVs",
    href: "/vehicles?bodyType=SUV",
    icon: Car,
    accent: "text-violet-400",
    hoverBorder: "hover:border-violet-400/40",
    hoverBg: "hover:bg-violet-400/10",
    hoverText: "hover:text-violet-400",
  },
  {
    label: "Family EVs",
    href: "/vehicles?q=family",
    icon: Users,
    accent: "text-violet-400",
    hoverBorder: "hover:border-violet-400/40",
    hoverBg: "hover:bg-violet-400/10",
    hoverText: "hover:text-violet-400",
  },
  {
    label: "Longest Range",
    href: "/vehicles?sort=range",
    icon: Gauge,
    accent: "text-cyan-400",
    hoverBorder: "hover:border-cyan-400/40",
    hoverBg: "hover:bg-cyan-400/10",
    hoverText: "hover:text-cyan-400",
    hot: true,
  },
  {
    label: "Fast Charge",
    href: "/vehicles?chargingSpeedDcMin=100",
    icon: BatteryCharging,
    accent: "text-brand",
    hoverBorder: "hover:border-brand/40",
    hoverBg: "hover:bg-brand/10",
    hoverText: "hover:text-brand",
  },
  {
    label: "City EV",
    href: "/vehicles?q=city",
    icon: MapPin,
    accent: "text-rose-400",
    hoverBorder: "hover:border-rose-400/40",
    hoverBg: "hover:bg-rose-400/10",
    hoverText: "hover:text-rose-400",
  },
  {
    label: "Under £30k",
    href: "/vehicles?maxPrice=30000",
    icon: PoundSterling,
    accent: "text-amber-400",
    hoverBorder: "hover:border-amber-400/40",
    hoverBg: "hover:bg-amber-400/10",
    hoverText: "hover:text-amber-400",
    hot: true,
  },
  {
    label: "Best Value",
    href: "/vehicles?sort=best_value",
    icon: Star,
    accent: "text-amber-400",
    hoverBorder: "hover:border-amber-400/40",
    hoverBg: "hover:bg-amber-400/10",
    hoverText: "hover:text-amber-400",
  },
  {
    label: "Get Finance",
    href: "/finance",
    icon: CreditCard,
    accent: "text-white/50",
    hoverBorder: "hover:border-white/25",
    hoverBg: "hover:bg-white/[0.06]",
    hoverText: "hover:text-white",
  },
] as const;

// ── Component ────────────────────────────────────────────────────────────────

export default function QuickFilterStrip() {
  return (
    <div className="border-y border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Scroll wrapper — hides scrollbar, enables touch scroll */}
        <div
          className="flex items-center gap-2 overflow-x-auto py-3.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Left label */}
          <span className="mr-2 shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20 hidden sm:block">
            Browse
          </span>

          {CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <Link
                key={chip.label}
                href={chip.href}
                className={`
                  group relative shrink-0 flex items-center gap-2 rounded-full border border-white/[0.08]
                  bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/55
                  transition-all duration-200
                  ${chip.hoverBorder} ${chip.hoverBg} ${chip.hoverText}
                `}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${chip.accent} transition-colors ${chip.hoverText}`} />
                <span className="whitespace-nowrap">{chip.label}</span>

                {/* Trending badge */}
                {"hot" in chip && chip.hot && (
                  <span className="flex items-center gap-0.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-1.5 py-0.5 text-[9px] font-bold text-orange-400">
                    <Flame className="h-2.5 w-2.5" />
                    HOT
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
