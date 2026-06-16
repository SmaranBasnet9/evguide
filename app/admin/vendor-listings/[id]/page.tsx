export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Car } from "lucide-react";
import Image from "next/image";
import VendorListingModerationForm from "@/components/admin/VendorListingModerationForm";

const STATUS_BADGE: Record<string, string> = {
  live:           "bg-emerald-50 text-emerald-700",
  pending_review: "bg-amber-50 text-amber-700",
  draft:          "bg-gray-100 text-gray-600",
  rejected:       "bg-red-50 text-red-700",
};

export default async function AdminVendorListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminClient = createAdminClient();

  const { data: listing } = await adminClient
    .from("vendor_listings")
    .select("*, vendors(id, company_name, email)")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const vendor = Array.isArray(listing.vendors) ? listing.vendors[0] : listing.vendors;

  const fields: { label: string; value: unknown }[] = [
    { label: "Make",         value: listing.make },
    { label: "Model",        value: listing.model },
    { label: "Variant",      value: listing.variant },
    { label: "Year",         value: listing.year },
    { label: "Condition",    value: listing.condition },
    { label: "Mileage",      value: listing.mileage ? `${listing.mileage.toLocaleString()} mi` : null },
    { label: "Price",        value: listing.price ? `£${Number(listing.price).toLocaleString()}` : null },
    { label: "Colour",       value: listing.colour },
    { label: "Engine Type",  value: listing.engine_type },
    { label: "Transmission", value: listing.transmission },
    { label: "Drivetrain",   value: listing.drivetrain },
    { label: "Horsepower",   value: listing.horsepower ? `${listing.horsepower} hp` : null },
    { label: "Battery",      value: listing.battery_kwh ? `${listing.battery_kwh} kWh` : null },
    { label: "Range (WLTP)", value: listing.range_km ? `${listing.range_km} km` : null },
    { label: "Max Charging", value: listing.charging_speed_kw ? `${listing.charging_speed_kw} kW` : null },
    { label: "Location",     value: listing.location },
    { label: "VIN",          value: listing.vin },
    { label: "Registration", value: listing.registration_number },
  ].filter((f) => f.value !== null && f.value !== undefined && f.value !== "");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/vendor-listings" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-gray-900">{listing.year} {listing.make} {listing.model}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[listing.status] ?? "bg-gray-100 text-gray-600"}`}>
              {listing.status.replace(/_/g, " ")}
            </span>
          </div>
          {vendor && (
            <p className="mt-1 text-sm text-gray-500">
              by <Link href={`/admin/vendors/${vendor.id}`} className="font-semibold text-brand hover:underline">{vendor.company_name}</Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-5 lg:col-span-2">
          {/* Images */}
          {listing.images?.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-bold text-gray-900">Photos</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {listing.images.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative block h-24 w-full overflow-hidden rounded-xl">
                    <Image src={url} alt="" fill className="object-cover transition hover:opacity-90" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Specs */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-gray-900 flex items-center gap-2"><Car className="h-4 w-4 text-gray-400" /> Specifications</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {fields.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</dt>
                  <dd className="mt-0.5 capitalize text-gray-900">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Description */}
          {listing.description && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-bold text-gray-900">Description</h2>
              <p className="whitespace-pre-line text-sm text-gray-700">{listing.description}</p>
            </section>
          )}
        </div>

        {/* Right: moderation */}
        <div>
          <VendorListingModerationForm listingId={id} currentStatus={listing.status} />
        </div>
      </div>
    </div>
  );
}
