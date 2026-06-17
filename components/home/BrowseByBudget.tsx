import Link from "next/link";

const BUDGETS = [
  { label: "Lease monthly", sublabel: "From £149/mo",  href: "/finance",               accentColor: "#3B82F6", bgFrom: "#0f172a", bgTo: "#1e3a5f" },
  { label: "Under £25k",    sublabel: "Entry-level EVs", href: "/vehicles?maxPrice=25000", accentColor: "#10B981", bgFrom: "#052e16", bgTo: "#064e3b" },
  { label: "Under £30k",    sublabel: "Most popular",  href: "/vehicles?maxPrice=30000", accentColor: "#F97316", bgFrom: "#1c0a00", bgTo: "#431407", hot: true },
  { label: "Under £40k",    sublabel: "Mid-range EVs", href: "/vehicles?maxPrice=40000", accentColor: "#8B5CF6", bgFrom: "#120924", bgTo: "#2e1065" },
  { label: "Under £50k",    sublabel: "Premium range", href: "/vehicles?maxPrice=50000", accentColor: "#06B6D4", bgFrom: "#022c22", bgTo: "#083344" },
  { label: "Open budget",   sublabel: "No limit",      href: "/vehicles",               accentColor: "#EAB308", bgFrom: "#1c1400", bgTo: "#422006" },
];

export default function BrowseByBudget() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Shop smarter</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Browse by Budget</h2>
          <p className="mt-1 text-sm text-gray-400">Every price point, every lifestyle</p>
        </div>

        <div
          className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {BUDGETS.map((b) => (
            <div key={b.label} className="shrink-0 w-[160px] sm:w-auto">
              <Link
                href={b.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
              >
                {b.hot && (
                  <span className="absolute right-2 top-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-lg">
                    Popular
                  </span>
                )}

                {/* Image placeholder box */}
                <div
                  className="relative flex h-[120px] w-full items-center justify-center overflow-hidden sm:h-[140px]"
                  style={{ background: `linear-gradient(135deg, ${b.bgFrom} 0%, ${b.bgTo} 100%)` }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(ellipse at 50% 60%, ${b.accentColor} 0%, transparent 70%)` }}
                  />
                  <div
                    className="absolute left-0 top-0 h-0.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${b.accentColor}, transparent)` }}
                  />
                  {/* Image icon */}
                  <svg
                    className="relative z-10 opacity-40"
                    width="48" height="48" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>

                {/* Label strip */}
                <div className="border-t border-gray-100 bg-white px-3 py-2.5 sm:px-4">
                  <p className="text-sm font-black text-gray-900">{b.label}</p>
                  <p className="mt-0.5 text-xs font-semibold" style={{ color: b.accentColor }}>
                    {b.sublabel}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          All prices include VAT · Finance available on every vehicle
        </p>
      </div>
    </section>
  );
}
