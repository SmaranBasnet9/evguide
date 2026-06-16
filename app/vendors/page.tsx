export const dynamic = "force-dynamic";

import { createPublicServerClient } from "@/lib/supabase/public-server";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

const BUSINESS_LABEL: Record<string, string> = {
  independent_dealer: "Independent Dealer",
  franchised_dealer:  "Franchised Dealer",
  leasing_company:    "Leasing Company",
  fleet_operator:     "Fleet Operator",
  private_seller:     "Private Seller",
  other:              "Other",
};

export default async function VendorsDirectoryPage() {
  const supabase = createPublicServerClient();
  if (!supabase) return <div className="p-16 text-center text-gray-500">Service unavailable.</div>;

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, company_name, city, postcode, business_type, description, logo_url")
    .eq("status", "verified")
    .order("company_name");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-black text-gray-900">EV Vendors</h1>
          <p className="mt-2 text-lg text-gray-500">Browse verified EV dealers and sellers across the UK.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {(!vendors || vendors.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <h2 className="font-bold text-gray-900">No vendors yet</h2>
            <p className="mt-1 text-sm text-gray-500">Check back soon as we verify new partners.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <Link
                key={v.id}
                href={`/vendors/${v.id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand/30 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {v.logo_url ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                      <Image src={v.logo_url} alt={v.company_name} fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Building2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 group-hover:text-brand transition truncate">{v.company_name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{BUSINESS_LABEL[v.business_type] ?? v.business_type}</p>
                    {(v.city || v.postcode) && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {[v.city, v.postcode].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                {v.description && (
                  <p className="mt-4 text-sm text-gray-500 line-clamp-2">{v.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
