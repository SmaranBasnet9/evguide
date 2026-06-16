import Image from "next/image";
import Link from "next/link";

// ── Budget tiers ─────────────────────────────────────────────────────────────

const BUDGETS = [
  {
    label: "Lease monthly",
    sublabel: "From £149/mo",
    href: "/finance",
    glowRgb: "59,130,246",
    accentColor: "#3B82F6",
    // Sleek blue EV on dark background — finance/lease feel
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
    alt: "Electric car lease deal",
  },
  {
    label: "Under £25k",
    sublabel: "Entry-level EVs",
    href: "/vehicles?maxPrice=25000",
    glowRgb: "16,185,129",
    accentColor: "#10B981",
    // Compact EV — entry level
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80",
    alt: "Affordable electric car under 25k",
  },
  {
    label: "Under £30k",
    sublabel: "Most popular",
    href: "/vehicles?maxPrice=30000",
    glowRgb: "249,115,22",
    accentColor: "#F97316",
    hot: true,
    // Popular EV hatchback
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80",
    alt: "Popular electric car under 30k",
  },
  {
    label: "Under £40k",
    sublabel: "Mid-range EVs",
    href: "/vehicles?maxPrice=40000",
    glowRgb: "139,92,246",
    accentColor: "#8B5CF6",
    // Mid-range crossover
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    alt: "Mid-range electric SUV under 40k",
  },
  {
    label: "Under £50k",
    sublabel: "Premium range",
    href: "/vehicles?maxPrice=50000",
    glowRgb: "100,116,139",
    accentColor: "#94A3B8",
    // Premium EV sedan
    image: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&w=600&q=80",
    alt: "Premium electric car under 50k",
  },
  {
    label: "Open budget",
    sublabel: "No limit",
    href: "/vehicles",
    glowRgb: "234,179,8",
    accentColor: "#EAB308",
    // Luxury performance EV
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    alt: "Luxury electric car no budget limit",
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
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
              >
                {b.hot && (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-lg">
                    Popular
                  </span>
                )}

                {/* Real car photo */}
                <div className="relative h-32 w-full overflow-hidden sm:h-36">
                  <Image
                    src={b.image}
                    alt={b.alt}
                    fill
                    sizes="(max-width: 640px) 155px, 200px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/10 to-transparent" />
                  {/* Accent glow at bottom */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-50 transition-opacity duration-300 group-hover:opacity-80"
                    style={{ background: `linear-gradient(to top, rgba(${b.glowRgb},0.6), transparent)` }}
                  />
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
