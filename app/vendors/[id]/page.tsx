import { createPublicServerClient } from "@/lib/supabase/public-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, Globe, Car, Building2, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const BUSINESS_LABEL: Record<string, string> = {
  independent_dealer: "Independent Dealer",
  franchised_dealer:  "Franchised Dealer",
  leasing_company:    "Leasing Company",
  fleet_operator:     "Fleet Operator",
  private_seller:     "Private Seller",
  other:              "Other",
};

const STATUS_BADGE: Record<string, string> = {
  live:   "bg-emerald-50 text-emerald-700",
  paused: "bg-orange-50 text-orange-700",
  sold:   "bg-blue-50 text-blue-700",
};

export default async function VendorPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicServerClient();
  if (!supabase) notFound();

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, company_name, city, postcode, business_type, description, logo_url, phone, website, address_line1")
    .eq("id", id)
    .eq("status", "verified")
    .single();

  if (!vendor) notFound();

  const { data: listings } = await supabase
    .from("vendor_listings")
    .select("id, make, model, variant, year, price, mileage, condition, images, status, engine_type, battery_kwh, range_km")
    .eq("vendor_id", id)
    .eq("status", "live")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-start gap-5">
            {vendor.logo_url ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200">
                <Image src={vendor.logo_url} alt={vendor.company_name} fill className="object-contain" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand flex-shrink-0">
                <Building2 className="h-8 w-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-black text-gray-900">{vendor.company_name}</h1>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">{BUSINESS_LABEL[vendor.business_type] ?? vendor.business_type}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {(vendor.city || vendor.postcode) && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{[vendor.city, vendor.postcode].filter(Boolean).join(", ")}</span>
                )}
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`} className="flex items-center gap-1 hover:text-brand"><Phone className="h-3.5 w-3.5" />{vendor.phone}</a>
                )}
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand"><Globe className="h-3.5 w-3.5" />{vendor.website.replace(/^https?:\/\//, "")}</a>
                )}
              </div>
            </div>
          </div>
          {vendor.description && (
            <p className="mt-6 max-w-2xl text-gray-600">{vendor.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-black text-gray-900">
          {listings?.length ?? 0} Vehicle{listings?.length !== 1 ? "s" : ""} for Sale
        </h2>

        {(!listings || listings.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Car className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-semibold text-gray-500">No listings at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((l) => (
              <div key={l.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
                {l.images?.[0] ? (
                  <div className="relative h-44 w-full">
                    <Image src={l.images[0]} alt={`${l.year} ${l.make} ${l.model}`} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center bg-gray-100 text-gray-400">
                    <Car className="h-8 w-8" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{l.year} {l.make} {l.model}</h3>
                  {l.variant && <p className="text-xs text-gray-400 mt-0.5">{l.variant}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    {l.mileage && <span>{l.mileage.toLocaleString()} mi</span>}
                    {l.condition && <span className="capitalize">{l.condition}</span>}
                    {l.engine_type && <span>{l.engine_type}</span>}
                    {l.range_km && <span>{l.range_km} km range</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-black text-gray-900">£{Number(l.price).toLocaleString()}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {l.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
