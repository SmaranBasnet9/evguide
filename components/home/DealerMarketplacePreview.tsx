import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, ChevronRight, ShieldCheck } from "lucide-react";

export type DealerListingCard = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  images: string[] | null;
  location: string | null;
};

interface DealerMarketplacePreviewProps {
  listings: DealerListingCard[];
}

function formatGBP(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(v);
}

function DealerCard({ listing, index }: { listing: DealerListingCard; index: number }) {
  const img = listing.images?.[0];

  return (
    <article className="group relative flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] sm:min-w-0">
      {/* Top: brand + model + verified badge */}
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              {listing.year} · {listing.brand}
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900">{listing.model}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {listing.mileage != null
                ? `${listing.mileage.toLocaleString()} miles`
                : "New stock"}{listing.location ? ` · ${listing.location}` : ""}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-green-400/25 bg-green-400/[0.08] px-2.5 py-1 text-[10px] font-semibold text-green-400">
            Verified
          </span>
        </div>
      </div>

      {/* Middle: car image — same h-40/h-44 */}
      <div className="relative mx-5 mt-4 h-40 overflow-hidden rounded-xl sm:h-44">
        {img ? (
          <Image
            src={img}
            alt={`${listing.brand} ${listing.model}`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-3xl font-black text-gray-200">{listing.brand}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Spec chips */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-1">
        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
          <ShieldCheck className="h-2.5 w-2.5" />Verified dealer
        </span>
        {listing.location && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
            <MapPin className="h-2.5 w-2.5" />{listing.location}
          </span>
        )}
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Cash from</p>
          <p className="text-xl font-black text-gray-900 leading-tight">{formatGBP(listing.price)}</p>
          <p className="text-xs text-gray-400">Finance options available</p>
        </div>
        <Link
          href={`/used-evs/${listing.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-all hover:scale-110 hover:bg-brand hover:text-white"
          aria-label={`View ${listing.brand} ${listing.model}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}

export default function DealerMarketplacePreview({ listings }: DealerMarketplacePreviewProps) {
  if (listings.length === 0) return null;

  const display = listings.slice(0, 3);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Live stock</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">Dealer Marketplace</h2>
            <p className="mt-1 text-sm text-gray-400">Verified UK dealers · real-time inventory</p>
          </div>
          <Link
            href="/used-evs"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-hover sm:inline-flex"
          >
            See all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards */}
        <div
          className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {display.map((listing, i) => (
            <DealerCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <Link
            href="/used-evs"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
          >
            Browse all dealer stock
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-gray-400">
            Are you a dealer?{" "}
            <Link href="/dealer" className="text-brand transition hover:text-brand-hover">
              List your inventory →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
