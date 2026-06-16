export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Car } from "lucide-react";
import Image from "next/image";

const STATUS_BADGE: Record<string, string> = {
  live:           "bg-emerald-50 text-emerald-700",
  pending_review: "bg-amber-50 text-amber-700",
  draft:          "bg-gray-100 text-gray-600",
  sold:           "bg-blue-50 text-blue-700",
  paused:         "bg-orange-50 text-orange-700",
  rejected:       "bg-red-50 text-red-700",
};

export default async function AdminVendorListingsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const status = sp.status ?? "pending_review";
  const adminClient = createAdminClient();

  let query = adminClient
    .from("vendor_listings")
    .select("id, make, model, variant, year, price, condition, status, images, created_at, vendors(id, company_name, email)")
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  if (status) query = query.eq("status", status);

  const { data: listings } = await query.limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Vendor Listings</h1>
        <p className="mt-1 text-sm text-gray-500">{listings?.length ?? 0} listings</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["pending_review", "live", "draft", "rejected", "paused", "sold"].map((s) => (
          <Link
            key={s}
            href={`/admin/vendor-listings?status=${s}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              status === s
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {(!listings || listings.length === 0) ? (
          <div className="p-16 text-center">
            <Car className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-semibold text-gray-500">No listings in this status</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Vehicle</th>
                <th className="px-6 py-3 text-left">Vendor</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Submitted</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => {
                const vendor = Array.isArray(l.vendors) ? l.vendors[0] : l.vendors;
                return (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {l.images?.[0] ? (
                          <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image src={l.images[0]} alt="" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[9px] text-gray-400">No img</div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{l.year} {l.make} {l.model}</p>
                          {l.variant && <p className="text-xs text-gray-400">{l.variant}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor && (
                        <Link href={`/admin/vendors/${vendor.id}`} className="text-sm font-medium text-gray-900 hover:text-brand hover:underline">{vendor.company_name}</Link>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">£{Number(l.price).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {l.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(l.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/vendor-listings/${l.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-brand/30 hover:text-brand">
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
