"use client";

import Link from "next/link";
import { Star, ArrowRight, ShoppingCart } from "lucide-react";
import type { CategoryWithProducts } from "@/lib/accessories";
import { STATIC_ACCESSORIES } from "@/lib/accessories-static";

// ── Accent styles ─────────────────────────────────────────────────────────────
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

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number | null; count: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-amber-400">{rating.toFixed(1)}</span>
      <span className="text-[11px] text-white/35">({count})</span>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: CategoryWithProducts["products"][0] }) {
  const href = product.affiliateUrl ?? `/accessories/${product.categorySlug}/${product.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Image */}
      <div className="relative flex h-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.04]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <span className="text-4xl opacity-40 select-none">📦</span>
        )}
        {product.badge && (
          <span className={`absolute left-1.5 top-1.5 rounded-full border border-white/10 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide backdrop-blur-sm ${BADGE_COLOR[product.badge] ?? "text-white/60"}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1">
        {product.brand && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">{product.brand}</p>
        )}
        <p className="text-xs font-bold leading-snug text-gray-900 group-hover:text-brand transition-colors line-clamp-2">
          {product.name}
        </p>
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <span className="text-sm font-black text-gray-900">
          {product.priceGbp != null ? `£${product.priceGbp.toFixed(2)}` : "View price"}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-semibold text-brand transition group-hover:bg-brand group-hover:text-white">
          <ShoppingCart className="h-2.5 w-2.5" /> Buy
        </span>
      </div>
    </Link>
  );
}

// ── Category row ──────────────────────────────────────────────────────────────
function CategoryRow({ group }: { group: CategoryWithProducts }) {
  const { category, products } = group;
  const accent = ICON_ACCENT[category.icon ?? ""] ?? FALLBACK_ACCENT;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base ${accent.border} ${accent.bg}`}>
            {accent.emoji}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
            {category.description && (
              <p className="hidden text-xs text-gray-400 line-clamp-1 max-w-xs sm:block">{category.description}</p>
            )}
          </div>
        </div>
        <Link href={`/accessories/${category.slug}`} className={`flex items-center gap-1 text-xs font-medium ${accent.text} hover:underline`}>
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {products.slice(0, 3).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props { data: CategoryWithProducts[] }

export default function EVAccessories({ data }: Props) {
  const display = data.length > 0 ? data : STATIC_ACCESSORIES;

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">EV &amp; Hybrid</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Accessories &amp; Gadgets</h2>
            <p className="mt-1 text-sm text-gray-400">Essential kit for every EV and hybrid owner</p>
          </div>
          <Link href="/accessories" className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand sm:mt-0">
            Browse all accessories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-10">
          {display.map((group) => (
            <CategoryRow key={group.category.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
