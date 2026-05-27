import type { Metadata } from "next";
import Link from "next/link";
import {
  Users, Zap, Battery, MapPin, Star, MessageSquare, RefreshCw,
  ArrowRight, TrendingUp, Shield, Lightbulb, ChevronRight,
} from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

export const metadata: Metadata = {
  title: "EV Owner Community — Tips, Range Optimisation & Resale | EVGuide",
  description: "Join thousands of UK EV owners. Charging tips, real-world range guides, peer reviews, and a private resale channel.",
};

const TIPS = [
  {
    category: "Charging",
    icon: Zap,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/8",
    items: [
      { tip: "Charge to 80% for daily use", detail: "Lithium cells degrade fastest above 80%. Reserve 100% for long trips." },
      { tip: "Avoid rapid charging daily", detail: "DC rapid charging generates heat. Use AC home charging for routine top-ups." },
      { tip: "Precondition before rapid charging", detail: "Cold batteries accept charge slower. Set a departure time to warm the pack first." },
      { tip: "Overnight smart charging", detail: "Intelligent Octopus Go finds 7p/kWh windows automatically between 11pm–6am." },
    ],
  },
  {
    category: "Range",
    icon: Battery,
    color: "text-brand",
    border: "border-brand/20",
    bg: "bg-brand/8",
    items: [
      { tip: "Eco mode below 50mph is worth it", detail: "Regenerative braking returns 10–18% of energy in urban driving." },
      { tip: "Cold weather costs 15–25% range", detail: "Battery conditioning and cabin heating are the main culprits. Pre-heat plugged in." },
      { tip: "Motorway = biggest range hit", detail: "70mph uses ~40% more energy than 55mph. Plan rapid charge stops on long trips." },
      { tip: "Tyre pressure matters more in EVs", detail: "Every 5psi under-inflation costs ~2% range. Check monthly." },
    ],
  },
  {
    category: "Ownership",
    icon: Shield,
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/8",
    items: [
      { tip: "ULEZ compliance is automatic for BEVs", detail: "Pure battery EVs are exempt from ULEZ, LEZ, and CAZ charges in all UK zones." },
      { tip: "VED is changing in 2025", detail: "EVs will pay the lowest VED band (£10/yr) from April 2025 — not zero." },
      { tip: "V2G can pay your electricity bill", detail: "V2G-capable vehicles (Nissan, Hyundai) can export to the grid during peak pricing." },
      { tip: "Battery warranty ≠ range guarantee", detail: "Most manufacturers warrant 70% capacity retention at 8 years / 100k miles." },
    ],
  },
];

const REVIEWS = [
  { name: "Marcus T.", location: "London", vehicle: "Tesla Model 3 LR", rating: 5, review: "3 years in — the battery health is at 94%. Supercharger network made the switch completely painless. TCO vs my old BMW 3 series is about £2,400 cheaper per year.", verified: true },
  { name: "Claire M.", location: "Edinburgh", vehicle: "Hyundai IONIQ 5", rating: 5, review: "Range anxiety disappeared after week two. Home charger charges overnight for about £1.20. The V2L function powered our camping trip — unreal.", verified: true },
  { name: "David P.", location: "Bristol", vehicle: "MG4 Extended Range", rating: 4, review: "Best value EV on the market. 240 real miles per charge, costs £3 to fill from flat. The only negative is the public charger network outside cities is still patchy.", verified: true },
  { name: "Priya S.", location: "Manchester", vehicle: "BMW iX3", rating: 5, review: "Switched from a diesel X3. No regrets. The regenerative braking took a week to get used to. Now I barely touch the brakes in the city.", verified: true },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">

        {/* Hero */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-xs font-semibold text-brand mb-6">
            <Users className="h-3.5 w-3.5" />
            EV Owner Community
          </div>
          <h1 className="text-4xl font-bold tracking-tight">The knowledge base AutoTrader buyers never get.</h1>
          <p className="mt-4 text-lg text-white/50 leading-relaxed">
            Real owners. Real range data. Charging tips from people doing 15,000 miles a year on UK roads.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "12,400+", label: "EV owners",           icon: Users },
            { value: "94,000+", label: "Real-world trips",    icon: MapPin },
            { value: "4.8/5",   label: "Community rating",    icon: Star },
            { value: "£2,100",  label: "Avg annual saving",   icon: TrendingUp },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-5 text-center">
              <Icon className="mx-auto mb-2 h-5 w-5 text-brand/60" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>

        {/* Owner tips */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Knowledge base</p>
            <h2 className="mt-2 text-2xl font-bold">Owner-verified tips</h2>
            <p className="mt-1 text-sm text-white/50">Curated from community contributions, verified against real-world data.</p>
          </div>

          <div className="space-y-5">
            {TIPS.map(({ category, icon: Icon, color, border, bg, items }) => (
              <div key={category} className={`rounded-2xl border ${border} ${bg} overflow-hidden`}>
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <p className={`text-sm font-bold ${color}`}>{category} tips</p>
                  </div>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {items.map(({ tip, detail }) => (
                    <div key={tip} className="flex items-start gap-4 px-6 py-4">
                      <ChevronRight className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
                      <div>
                        <p className="text-sm font-semibold text-white">{tip}</p>
                        <p className="mt-0.5 text-xs text-white/50">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Owner reviews */}
        <div className="mb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Real owners</p>
            <h2 className="mt-2 text-2xl font-bold">What UK EV owners actually say</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-white/40">{r.vehicle} · {r.location}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">&ldquo;{r.review}&rdquo;</p>
                {r.verified && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-medium">Verified EVGuide owner</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Range optimisation guide */}
        <div className="mb-14 rounded-2xl border border-brand/20 bg-brand/5 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-brand" />
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">Community guide</p>
              </div>
              <h3 className="text-xl font-bold text-white">Getting the most range from your EV in the UK</h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                The UK&apos;s climate, motorways, and public charger landscape create specific challenges. This guide covers winter range, motorway planning, and how to use smart tariffs to keep costs under 3p/mile.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "Winter driving: keep 20% reserve minimum",
                  "M-way planning: ZapMap + Gridserve locations",
                  "Smart charging schedule for Octopus Go",
                  "One-pedal driving in city traffic",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <ChevronRight className="h-4 w-4 text-brand/60 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-white/[0.06] p-8 flex flex-col justify-center gap-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Real-world community finding</p>
                <p className="text-2xl font-bold text-white">82%</p>
                <p className="text-sm text-white/50">WLTP → real-world range in UK conditions</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Avg owner energy cost</p>
                <p className="text-2xl font-bold text-white">3.8p/mi</p>
                <p className="text-sm text-white/50">vs 10.6p/mi for average petrol car</p>
              </div>
            </div>
          </div>
        </div>

        {/* Private resale + community CTA */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <RefreshCw className="mb-3 h-6 w-6 text-brand/70" />
            <h3 className="text-lg font-bold text-white">Sell to a fellow EV owner</h3>
            <p className="mt-2 text-sm text-white/50">
              Private resale listings reach buyers who already understand EVs. No questions like &ldquo;how far does it go?&rdquo; — they know.
            </p>
            <Link
              href="/used-evs/sell"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              List your EV <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <MessageSquare className="mb-3 h-6 w-6 text-brand/70" />
            <h3 className="text-lg font-bold text-white">Join the community</h3>
            <p className="mt-2 text-sm text-white/50">
              Share your real-world range data, charging tips, and reviews. Help the next generation of EV buyers make better decisions.
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/8 px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/15"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

      <PremiumFooter />
    </main>
  );
}
