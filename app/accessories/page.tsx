import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import { getAllAccessoriesForPage } from "@/lib/accessories";
import { STATIC_ACCESSORIES } from "@/lib/accessories-static";
import type { CategoryWithProducts, Accessory } from "@/lib/accessories";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "EV & Hybrid Accessories | EVGuide",
  description: "Shop charging cables, home chargers, battery covers, range monitors and more for your EV or hybrid.",
};

// ── Accent map ────────────────────────────────────────────────────────────────
const ICON_ACCENT: Record<string, { border: string; bg: string; text: string; emoji: string }> = {
  Cable:          { border: "border-brand/25",      bg: "bg-brand/10",       text: "text-brand",       emoji: "🔌" },
  BatteryCharging:{ border: "border-amber-400/25",  bg: "bg-amber-400/10",   text: "text-amber-400",   emoji: "⚡" },
  Shield:         { border: "border-violet-400/25", bg: "bg-violet-400/10",  text: "text-violet-400",  emoji: "🛡️" },
  Plug:           { border: "border-cyan-400/25",   bg: "bg-cyan-400/10",    text: "text-cyan-400",    emoji: "🔋" },
  Wind:           { border: "border-rose-400/25",   bg: "bg-rose-400/10",    text: "text-rose-400",    emoji: "💨" },
  Gauge:          { border: "border-emerald-400/25",bg: "bg-emerald-400/10", text: "text-emerald-400", emoji: "📊" },
  Wrench:         { border: "border-white/15",      bg: "bg-white/[0.05]",   text: "text-white/60",    emoji: "🔧" },
  Zap:            { border: "border-orange-400/25", bg: "bg-orange-400/10",  text: "text-orange-400",  emoji: "⚡" },
};
const FALLBACK_ACCENT = ICON_ACCENT["Cable"];

const BADGE_COLOR: Record<string, string> = {
  Popular: "text-brand",
  Hot:     "text-orange-400",
  New:     "text-rose-400",
  Trending:"text-amber-400",
};

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Accessory }) {
  const href = product.affiliateUrl ?? `/accessories/${product.categorySlug}/${product.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#111] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Image */}
      <div className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <span className="text-5xl opacity-40 select-none">📦</span>
        )}
        {product.badge && (
          <span className={`absolute left-2 top-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${BADGE_COLOR[product.badge] ?? "text-white/60"}`}>
            {product.badge}
          </span>
        )}
        {product.compatibleWith.length > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.compatibleWith.slice(0, 2).map((c) => (
              <span key={c} className="rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-semibold text-white/70 backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5">
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{product.brand}</p>
        )}
        <p className="text-sm font-bold leading-snug text-white group-hover:text-brand transition-colors line-clamp-2">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs leading-relaxed text-white/45 line-clamp-2">{product.description}</p>
        )}
        {product.rating != null && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-white/35">({product.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-base font-black text-white">
          {product.priceGbp != null ? `£${product.priceGbp.toFixed(2)}` : "View price"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-[11px] font-semibold text-brand transition group-hover:bg-brand group-hover:text-white">
          <ShoppingCart className="h-3 w-3" /> Buy
        </span>
      </div>
    </Link>
  );
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ group }: { group: CategoryWithProducts }) {
  const { category, products } = group;
  const accent = ICON_ACCENT[category.icon ?? ""] ?? FALLBACK_ACCENT;

  return (
    <section id={category.slug} className="scroll-mt-24">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg ${accent.border} ${accent.bg}`}>
            {accent.emoji}
          </div>
          <div>
            <h2 className="text-lg font-black text-white sm:text-xl">{category.name}</h2>
            {category.description && (
              <p className="text-sm text-white/40">{category.description}</p>
            )}
          </div>
        </div>
        <Link
          href={`/accessories/${category.slug}`}
          className={`flex items-center gap-1 text-xs font-medium ${accent.text} hover:underline`}
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AccessoriesPage() {
  const dbData = await getAllAccessoriesForPage();
  const data = dbData.length > 0 ? dbData : STATIC_ACCESSORIES;

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-base font-sans text-white selection:bg-brand/30">
      <PremiumNavbar />

      {/* Hero */}
      <div className="border-b border-white/[0.06] bg-[#0a0a0a] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Shop</p>
          <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            EV &amp; Hybrid Accessories
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/50">
            Everything you need to charge smarter, drive further, and protect your investment.
          </p>

          {/* Category jump pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {data.map((group) => {
              const accent = ICON_ACCENT[group.category.icon ?? ""] ?? FALLBACK_ACCENT;
              return (
                <a
                  key={group.category.slug}
                  href={`#${group.category.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <span>{accent.emoji}</span>
                  {group.category.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {data.map((group) => (
          <CategorySection key={group.category.id} group={group} />
        ))}
      </div>

      <PremiumFooter />
    </main>
  );
}
