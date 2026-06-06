"use client";

import Link from "next/link";
import { Star, ArrowRight, ShoppingCart } from "lucide-react";
import type { CategoryWithProducts } from "@/lib/accessories";
import { STATIC_ACCESSORIES } from "@/lib/accessories-static";

const BADGE_COLOR: Record<string, string> = {
  Popular: "text-emerald-600",
  Hot:     "text-orange-500",
  New:     "text-blue-500",
  Trending:"text-amber-500",
};

const BADGE_BG: Record<string, string> = {
  Popular: "bg-emerald-50",
  Hot:     "bg-orange-50",
  New:     "bg-blue-50",
  Trending:"bg-amber-50",
};

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
      <span className="text-[10px] font-semibold text-amber-500">{rating.toFixed(1)}</span>
      <span className="text-[9px] text-gray-400">({count})</span>
    </div>
  );
}

function ProductCard({ product }: { product: CategoryWithProducts["products"][0] }) {
  const href = product.affiliateUrl ?? `/accessories/${product.categorySlug}/${product.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative flex h-[100px] shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-gray-50 sm:h-[120px]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-3xl opacity-30 select-none">📦</span>
        )}
        {product.badge && (
          <span className={`absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${BADGE_BG[product.badge] ?? "bg-gray-100"} ${BADGE_COLOR[product.badge] ?? "text-gray-500"}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-2 pt-1.5">
        {product.brand && (
          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 truncate">{product.brand}</p>
        )}
        <p className="text-[11px] font-semibold leading-tight text-gray-800 group-hover:text-brand transition-colors line-clamp-2 flex-1">
          {product.name}
        </p>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-center justify-between border-t border-gray-50 pt-1.5 mt-0.5">
          <span className="text-xs font-black text-gray-900">
            {product.priceGbp != null ? `£${product.priceGbp.toFixed(2)}` : "View"}
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-brand/10 px-2 py-0.5 text-[9px] font-semibold text-brand transition group-hover:bg-brand group-hover:text-white">
            <ShoppingCart className="h-2 w-2" /> Buy
          </span>
        </div>
      </div>
    </Link>
  );
}

interface Props { data: CategoryWithProducts[] }

export default function EVAccessories({ data }: Props) {
  const source = data.length > 0 ? data : STATIC_ACCESSORIES;

  // Flatten all products, featured first, then by display order
  const allProducts = source
    .flatMap((g) => g.products)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, 10);

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">EV &amp; Hybrid</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Accessories &amp; Gadgets</h2>
            <p className="mt-1 text-sm text-gray-400">Essential kit for every EV and hybrid owner</p>
          </div>
          <Link
            href="/accessories"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-500 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand sm:mt-0"
          >
            Browse all accessories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Flat product grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/accessories"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover hover:shadow-md"
          >
            Shop all accessories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
