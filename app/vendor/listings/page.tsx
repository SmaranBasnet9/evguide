export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Eye, PauseCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const STATUS_STYLES: Record<string, string> = {
  live:           "bg-emerald-50 text-emerald-700",
  pending_review: "bg-amber-50 text-amber-700",
  draft:          "bg-gray-100 text-gray-600",
  sold:           "bg-blue-50 text-blue-700",
  paused:         "bg-orange-50 text-orange-700",
  rejected:       "bg-red-50 text-red-700",
};

export default async function VendorListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/vendor/listings");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!vendor) redirect("/vendor");

  const { data: listings } = await supabase
    .from("vendor_listings")
    .select("id, make, model, variant, year, price, mileage, condition, status, images, view_count, lead_count, rejection_reason, created_at")
    .eq("vendor_id", vendor.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Listings</h1>
          <p className="mt-1 text-sm text-gray-500">{listings?.length ?? 0} vehicles</p>
        </div>
        <Link
          href="/vendor/listings/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" /> Add Listing
        </Link>
      </div>

      {(!listings || listings.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Eye className="h-6 w-6 text-gray-400" />
          </div>
          <h2 className="font-bold text-gray-900">No listings yet</h2>
          <p className="mt-1 text-sm text-gray-500">Add your first vehicle listing to get started.</p>
          <Link href="/vendor/listings/new" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand/90">
            <Plus className="h-4 w-4" /> Add your first listing
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Vehicle</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Views / Leads</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {l.images?.[0] ? (
                        <div className="relative h-10 w-14 overflow-hidden rounded-lg">
                          <Image src={l.images[0]} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">No img</div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{l.year} {l.make} {l.model}</p>
                        {l.variant && <p className="text-xs text-gray-500">{l.variant}</p>}
                        {l.mileage && <p className="text-[11px] text-gray-400">{l.mileage.toLocaleString()} mi · {l.condition}</p>}
                      </div>
                    </div>
                    {l.rejection_reason && (
                      <p className="mt-1 text-[11px] text-red-600 font-medium">Rejected: {l.rejection_reason}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">£{Number(l.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {l.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    <span className="flex items-center justify-end gap-2">
                      <Eye className="h-3.5 w-3.5" />{l.view_count}
                      <span className="text-gray-300">·</span>
                      <CheckCircle2 className="h-3.5 w-3.5" />{l.lead_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/vendor/listings/${l.id}/edit`} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </Link>
                      {l.status === "live" && (
                        <form action={`/api/vendor/listings/${l.id}/action`} method="post" className="inline">
                          <input type="hidden" name="action" value="pause" />
                          <button type="submit" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600" title="Pause">
                            <PauseCircle className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                      {(l.status === "paused" || l.status === "rejected") && (
                        <form action={`/api/vendor/listings/${l.id}/action`} method="post" className="inline">
                          <input type="hidden" name="action" value="renew" />
                          <button type="submit" className="rounded-lg p-1.5 text-gray-400 transition hover:bg-brand/10 hover:text-brand" title="Resubmit">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
