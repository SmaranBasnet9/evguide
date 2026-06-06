import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Battery, MapPin, Gauge, Shield, CheckCircle, Zap, RefreshCw, User, AlertTriangle, Building2 } from "lucide-react";
import UsedEVEnquireButton from "@/components/used-evs/UsedEVEnquireButton";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import { usedEvListings } from "@/data/usedEvListings";
import { createAdminClient } from "@/lib/supabase/admin";
import DealerEnquiryForm from "@/components/DealerEnquiryForm";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getDealerListing(id: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, colour, description, images, range_km, battery_kwh, drive, body_type, charging_standard, seats, location, status, dealer_id, created_at")
    .eq("id", id)
    .eq("status", "live")
    .single();
  return data ?? null;
}

async function getDealerProfile(dealerId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("dealer_profiles")
    .select("id, company_name, city, phone")
    .eq("id", dealerId)
    .single();
  return data ?? null;
}

export async function generateStaticParams() {
  return usedEvListings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (UUID_RE.test(id)) {
    const listing = await getDealerListing(id);
    if (!listing) return { title: "Listing not found | EVGuide" };
    return {
      title: `${listing.year} ${listing.brand} ${listing.model} — Used EV for sale | EVGuide`,
      description: `${listing.year} ${listing.brand} ${listing.model} for £${Number(listing.price).toLocaleString()}. ${listing.mileage.toLocaleString()} miles.${listing.location ? ` Located in ${listing.location}.` : ""}`,
    };
  }
  const listing = usedEvListings.find((l) => l.id === id);
  if (!listing) return { title: "Listing not found | EVGuide" };
  return {
    title: `${listing.year} ${listing.brand} ${listing.model} — Used EV for sale | EVGuide`,
    description: `${listing.year} ${listing.brand} ${listing.model} for ${new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(listing.price)}. Battery health ${listing.batteryHealthPct}%, ${listing.realWorldRangeMiles}mi real-world range. ${listing.location}.`,
  };
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function BatteryBar({ pct }: { pct: number }) {
  const color = pct >= 95 ? "bg-emerald-500" : pct >= 88 ? "bg-brand" : pct >= 80 ? "bg-amber-500" : "bg-red-500";
  const label = pct >= 95 ? "Excellent" : pct >= 88 ? "Good" : pct >= 80 ? "Fair" : "Below average";
  const desc = pct >= 95
    ? "Battery is in near-new condition"
    : pct >= 88
    ? "Normal degradation for age and mileage"
    : pct >= 80
    ? "Some degradation — check full history"
    : "Significant degradation — negotiate price";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-black">Battery health (SOH)</p>
          <p className="mt-1 text-3xl font-bold text-black">{pct}%</p>
          <p className="text-sm font-medium" style={{ color: pct >= 95 ? "#10b981" : pct >= 88 ? "#1FBF9F" : pct >= 80 ? "#f59e0b" : "#ef4444" }}>
            {label}
          </p>
        </div>
        <Battery className="h-10 w-10 text-gray-200" />
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-black">{desc}</p>
    </div>
  );
}

export default async function UsedEVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // UUID → dealer listing from DB
  if (UUID_RE.test(id)) {
    const listing = await getDealerListing(id);
    if (!listing) notFound();
    const dealer = await getDealerProfile(listing.dealer_id);
    return <DealerListingDetailPage listing={listing} dealer={dealer} />;
  }

  const listing = usedEvListings.find((l) => l.id === id);
  if (!listing) notFound();

  const estimatedMonthly = Math.round(listing.price / 60); // rough 5yr estimate

  return (
    <main className="min-h-screen bg-white text-black">
      <PremiumNavbar />

      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-24">

        <Link
          href="/used-evs"
          className="inline-flex items-center gap-1.5 text-sm text-black transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All used EVs
        </Link>

        {/* Hero grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Image
              src={listing.image}
              alt={`${listing.year} ${listing.brand} ${listing.model}`}
              fill
              className="object-contain p-4"
              priority
            />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {listing.ulezCompliant && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                  ULEZ ✓
                </span>
              )}
              {listing.wallboxIncluded && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                  Wallbox included
                </span>
              )}
            </div>
            {listing.sellerType === "dealer" && (
              <div className="absolute right-4 top-4">
                <span className="rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur-md">
                  Dealer listing
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black">{listing.brand}</p>
              <h1 className="mt-1 text-2xl font-bold text-black">{listing.year} {listing.brand} {listing.model}</h1>
              {listing.variant && <p className="mt-0.5 text-sm text-black">{listing.variant}</p>}
              <p className="mt-0.5 text-sm text-black">{listing.colour} · {listing.previousOwners} previous owner{listing.previousOwners > 1 ? "s" : ""}</p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand">{formatGBP(listing.price)}</span>
                <span className="text-sm text-black">≈ {formatGBP(estimatedMonthly)}/mo over 5 yrs</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-black" />
                <span className="text-sm text-black">{listing.location}</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Gauge,   label: "Mileage",     value: `${listing.mileage.toLocaleString()} mi` },
                { icon: Battery, label: "Real range",   value: `${listing.realWorldRangeMiles} mi` },
                { icon: Zap,     label: "DC rapid",     value: `${listing.chargingSpeedDcKw} kW` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                  <Icon className="mx-auto mb-1 h-4 w-4 text-brand" />
                  <p className="text-sm font-semibold text-black">{value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-black">{label}</p>
                </div>
              ))}
            </div>

            {/* Quick facts */}
            <div className="flex flex-wrap gap-2">
              {listing.serviceHistoryFull && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-medium text-emerald-400">
                  <CheckCircle className="h-3 w-3" /> Full service history
                </span>
              )}
              {!listing.serviceHistoryFull && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-xs font-medium text-amber-400">
                  <AlertTriangle className="h-3 w-3" /> Partial service history
                </span>
              )}
              {listing.ulezCompliant && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs font-medium text-emerald-400">
                  <Shield className="h-3 w-3" /> ULEZ compliant
                </span>
              )}
              {listing.wallboxIncluded && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-xs font-medium text-amber-400">
                  <Zap className="h-3 w-3" /> Wallbox included
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-black">{listing.description}</p>

            {/* Seller */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white">
                  <User className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{listing.sellerName}</p>
                  <p className="text-xs text-black capitalize">{listing.sellerType} seller · Listed {new Date(listing.listedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <UsedEVEnquireButton vehicleLabel={`${listing.year} ${listing.brand} ${listing.model}`} />
                <Link
                  href="/battery-health"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-black transition hover:border-brand/20 hover:text-brand"
                >
                  <RefreshCw className="h-4 w-4" /> Battery report
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Battery health card */}
        <div>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">EV-specific data</h2>
          <p className="mb-5 text-2xl font-bold text-black">Battery health analysis</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <BatteryBar pct={listing.batteryHealthPct} />

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-black">Full listing data</p>
              {[
                { label: "Battery capacity", value: `${listing.batteryKWh} kWh` },
                { label: "Real-world range", value: `${listing.realWorldRangeMiles} mi (UK conditions)` },
                { label: "DC rapid charging", value: `${listing.chargingSpeedDcKw} kW` },
                { label: "ULEZ compliant",   value: listing.ulezCompliant ? "Yes" : "No" },
                { label: "Wallbox included", value: listing.wallboxIncluded ? "Yes — stays with car" : "No" },
                { label: "Service history",  value: listing.serviceHistoryFull ? "Full" : "Partial" },
                { label: "Previous owners",  value: String(listing.previousOwners) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-black">{row.label}</span>
                  <span className="text-xs font-semibold text-black">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Battery health report CTA */}
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
              <RefreshCw className="h-5 w-5 text-brand" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black">Get a full battery health report — £29</p>
              <p className="mt-1 text-sm text-black">
                VIN-level diagnostics: cell balance, charge cycle count, degradation vs fleet average.
                Know exactly what you&apos;re buying.
              </p>
            </div>
            <Link
              href="/battery-health"
              className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Get report
            </Link>
          </div>
        </div>

      </div>

      <PremiumFooter />
    </main>
  );
}

// ─── Dealer listing detail (from DB) ────────────────────────────────────────

type DealerListingRow = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  description?: string | null;
  images?: string[];
  range_km?: number | null;
  battery_kwh?: number | null;
  drive?: string | null;
  body_type?: string | null;
  charging_standard?: string | null;
  seats?: number | null;
  location?: string | null;
  created_at: string;
};

type DealerProfileRow = {
  id: string;
  company_name: string;
  city: string;
  phone?: string | null;
} | null;

function DealerListingDetailPage({
  listing,
  dealer,
}: {
  listing: DealerListingRow;
  dealer: DealerProfileRow;
}) {
  const specs = [
    { label: "Year",              value: String(listing.year) },
    { label: "Mileage",          value: `${Number(listing.mileage).toLocaleString()} mi` },
    { label: "Colour",           value: listing.colour ?? "—" },
    { label: "Body type",        value: listing.body_type ?? "—" },
    { label: "Drive",            value: listing.drive ?? "—" },
    { label: "Battery",          value: listing.battery_kwh ? `${listing.battery_kwh} kWh` : "—" },
    { label: "Range",            value: listing.range_km ? `${listing.range_km} km` : "—" },
    { label: "Charging",         value: listing.charging_standard ?? "—" },
    { label: "Seats",            value: listing.seats ? String(listing.seats) : "—" },
    { label: "Location",         value: listing.location ?? "—" },
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      <PremiumNavbar />

      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-24">
        <Link
          href="/used-evs"
          className="inline-flex items-center gap-1.5 text-sm text-black transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All used EVs
        </Link>

        {/* Hero grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {listing.images?.[0] ? (
                <Image
                  src={listing.images[0]}
                  alt={`${listing.year} ${listing.brand} ${listing.model}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Gauge className="h-16 w-16 text-gray-200" />
                </div>
              )}
              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur-md">
                  Dealer
                </span>
              </div>
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.images.slice(1).map((url) => (
                  <div key={url} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200">
                    <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black">{listing.brand}</p>
              <h1 className="mt-1 text-2xl font-bold text-black">{listing.year} {listing.brand} {listing.model}</h1>
              {listing.colour && <p className="mt-0.5 text-sm text-black">{listing.colour}</p>}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand">£{Number(listing.price).toLocaleString()}</span>
              </div>
              {listing.location && (
                <div className="mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-black" />
                  <span className="text-sm text-black">{listing.location}</span>
                </div>
              )}
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <Gauge className="mx-auto mb-1 h-4 w-4 text-brand" />
                <p className="text-sm font-semibold text-black">{Number(listing.mileage).toLocaleString()}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-black">miles</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <Battery className="mx-auto mb-1 h-4 w-4 text-brand" />
                <p className="text-sm font-semibold text-black">{listing.battery_kwh ? `${listing.battery_kwh} kWh` : "—"}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-black">battery</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <Zap className="mx-auto mb-1 h-4 w-4 text-brand" />
                <p className="text-sm font-semibold text-black">{listing.range_km ? `${listing.range_km} km` : "—"}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-black">range</p>
              </div>
            </div>

            {listing.description && (
              <p className="text-sm leading-relaxed text-black">{listing.description}</p>
            )}

            {/* Dealer info */}
            {dealer && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
                    <Building2 className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{dealer.company_name}</p>
                    <p className="text-xs text-black">{dealer.city} · Verified dealer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specs table */}
        <div>
          <h2 className="mb-5 text-lg font-semibold text-black">Vehicle specifications</h2>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
            {specs.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-black">{row.label}</span>
                <span className="text-sm font-semibold text-black">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry form */}
        <div>
          <h2 className="mb-2 text-lg font-semibold text-black">Contact the dealer</h2>
          <p className="mb-5 text-sm text-black">
            Send a message directly to {dealer?.company_name ?? "the dealer"} about this vehicle.
          </p>
          <DealerEnquiryForm
            listingId={listing.id}
            vehicleTitle={`${listing.year} ${listing.brand} ${listing.model}`}
          />
        </div>
      </div>

      <PremiumFooter />
    </main>
  );
}

