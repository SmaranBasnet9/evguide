import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import { getProductsByCategory } from "@/lib/accessories";
import { STATIC_ACCESSORIES } from "@/lib/accessories-static";
import type { Accessory, AccessoryCategory } from "@/lib/accessories";

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return STATIC_ACCESSORIES.map((g) => ({ slug: g.category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getProductsByCategory(slug);
  const cat = category ?? STATIC_ACCESSORIES.find((g) => g.category.slug === slug)?.category;
  if (!cat) return { title: "Accessories | EVGuide" };
  return {
    title: `${cat.name} | EV Accessories | EVGuide`,
    description: cat.description ?? `Shop ${cat.name} for your EV or hybrid.`,
  };
}

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
      <div className="relative flex h-44 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <span className="text-6xl opacity-40 select-none">📦</span>
        )}
        {product.badge && (
          <span className={`absolute left-2 top-2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${BADGE_COLOR[product.badge] ?? "text-white/60"}`}>
            {product.badge}
          </span>
        )}
        {product.compatibleWith.length > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.compatibleWith.map((c) => (
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
        <p className="text-sm font-bold leading-snug text-white group-hover:text-brand transition-colors">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs leading-relaxed text-white/45 line-clamp-3">{product.description}</p>
        )}
        {product.rating != null && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-white/35">({product.reviewCount} reviews)</span>
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-xl font-black text-white">
          {product.priceGbp != null ? `£${product.priceGbp.toFixed(2)}` : "View price"}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-brand-hover">
          <ShoppingCart className="h-3.5 w-3.5" /> Buy now
        </span>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AccessoryCategoryPage({ params }: Props) {
  const { slug } = await params;

  // Try DB first, fall back to static
  const dbResult = await getProductsByCategory(slug);
  const hasDbData = dbResult.category !== null;

  const category: AccessoryCategory | null = hasDbData
    ? dbResult.category
    : (STATIC_ACCESSORIES.find((g) => g.category.slug === slug)?.category ?? null);

  const products: Accessory[] = hasDbData
    ? dbResult.products
    : (STATIC_ACCESSORIES.find((g) => g.category.slug === slug)?.products ?? []);

  if (!category) notFound();

  const accent = ICON_ACCENT[category.icon ?? ""] ?? FALLBACK_ACCENT;

  return (
    <main className="min-h-screen overflow-x-hidden bg-surface-base font-sans text-white selection:bg-brand/30">
      <PremiumNavbar />

      {/* Hero */}
      <div className="border-b border-white/[0.06] bg-[#0a0a0a] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-xs text-white/40">
            <Link href="/accessories" className="flex items-center gap-1 transition hover:text-white">
              <ArrowLeft className="h-3 w-3" /> All Accessories
            </Link>
            <span>/</span>
            <span className="text-white/70">{category.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl ${accent.border} ${accent.bg}`}>
              {accent.emoji}
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accent.text}`}>Accessories</p>
              <h1 className="text-2xl font-black text-white sm:text-3xl">{category.name}</h1>
            </div>
          </div>

          {category.description && (
            <p className="mt-3 max-w-xl text-sm text-white/50">{category.description}</p>
          )}
          <p className="mt-2 text-xs text-white/30">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}
