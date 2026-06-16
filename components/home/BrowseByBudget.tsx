import Link from "next/link";
import dynamic from "next/dynamic";

const Budget3DCar = dynamic(() => import("./Budget3DCar"), { ssr: false });

// ── Budget tiers ─────────────────────────────────────────────────────────────

const BUDGETS = [
  {
    label: "Lease monthly",
    sublabel: "From £149/mo",
    href: "/finance",
    glowRgb: "59,130,246",
    accentColor: "#3B82F6",
  },
  {
    label: "Under £25k",
    sublabel: "Entry-level EVs",
    href: "/vehicles?maxPrice=25000",
    glowRgb: "16,185,129",
    accentColor: "#10B981",
  },
  {
    label: "Under £30k",
    sublabel: "Most popular",
    href: "/vehicles?maxPrice=30000",
    glowRgb: "249,115,22",
    accentColor: "#F97316",
    hot: true,
  },
  {
    label: "Under £40k",
    sublabel: "Mid-range EVs",
    href: "/vehicles?maxPrice=40000",
    glowRgb: "139,92,246",
    accentColor: "#8B5CF6",
  },
  {
    label: "Under £50k",
    sublabel: "Premium range",
    href: "/vehicles?maxPrice=50000",
    glowRgb: "148,163,184",
    accentColor: "#94A3B8",
  },
  {
    label: "Open budget",
    sublabel: "No limit",
    href: "/vehicles",
    glowRgb: "234,179,8",
    accentColor: "#EAB308",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BrowseByBudget() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Shop smarter</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Browse by Budget</h2>
          <p className="mt-1 text-sm text-gray-400">Every price point, every lifestyle</p>
        </div>

        {/* Horizontally scrollable card row */}
        <div
          className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {BUDGETS.map((b) => (
            <div key={b.label} className="shrink-0 w-[155px] sm:w-auto">
              <Link
                href={b.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                {b.hot && (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-lg">
                    Popular
                  </span>
                )}

                {/* 3D car canvas — dark background, accent-coloured car */}
                <div
                  className="relative h-32 w-full overflow-hidden sm:h-36"
                  style={{ background: "linear-gradient(160deg, #0d0d14 0%, #12121f 60%, #0a0a10 100%)" }}
                >
                  {/* Radial accent glow behind the car */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-65"
                    style={{
                      background: `radial-gradient(ellipse 70% 55% at 50% 65%, rgba(${b.glowRgb},0.55) 0%, transparent 75%)`,
                    }}
                  />
                  {/* Three.js canvas */}
                  <div className="absolute inset-0">
                    <Budget3DCar color={b.accentColor} />
                  </div>
                  {/* Subtle bottom fade into the card label area */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/5 to-transparent" />
                </div>

                {/* Label */}
                <div className="border-t border-gray-100 px-3 py-3 sm:px-4">
                  <p className="text-sm font-black text-gray-900">{b.label}</p>
                  <p className="mt-0.5 text-xs font-semibold" style={{ color: b.accentColor }}>
                    {b.sublabel}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          All prices include VAT · Finance options available on every vehicle
        </p>
      </div>
    </section>
  );
}
