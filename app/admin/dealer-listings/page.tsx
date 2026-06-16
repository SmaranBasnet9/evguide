export const dynamic = "force-dynamic";

import Link from "next/link";
import { Download } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDealerListingReviewButton from "@/components/AdminDealerListingReviewButton";
import AdminDealerListingActions from "@/components/AdminDealerListingActions";

async function getPendingListings() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, status, condition, description, images, location, drive, battery_kwh, range_km, created_at, dealer_id")
    .in("status", ["pending", "live", "rejected"])
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/dealer-listings]", error.message);
    return [];
  }
  return data ?? [];
}

async function getDealerNames(dealerIds: string[]) {
  if (dealerIds.length === 0) return {};
  const admin = createAdminClient();
  const { data } = await admin
    .from("dealer_profiles")
    .select("id, company_name")
    .in("id", dealerIds);
  return Object.fromEntries((data ?? []).map((d) => [d.id, d.company_name]));
}

const STATUS_STYLES: Record<string, string> = {
  pending:  "border-amber-200 bg-amber-50 text-amber-700",
  live:     "border-brand/20 bg-brand/10 text-brand",
  rejected: "border-red-200 bg-red-50 text-red-600",
};

export default async function AdminDealerListingsPage() {
  const listings = await getPendingListings();
  const dealerMap = await getDealerNames([...new Set(listings.map((l) => l.dealer_id))]);

  const pending  = listings.filter((l) => l.status === "pending").length;
  const live     = listings.filter((l) => l.status === "live").length;

  // Group listings by dealer for the per-dealer table view
  const byDealer = new Map<string, typeof listings>();
  for (const listing of listings) {
    const group = byDealer.get(listing.dealer_id);
    if (group) group.push(listing);
    else byDealer.set(listing.dealer_id, [listing]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dealer Listings</h1>
          <p className="mt-1 text-gray-500">{listings.length} total · {pending} pending review · {live} live</p>
        </div>
        <Link
          href="/api/admin/dealer-listings/export"
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Download CSV (all dealers)
        </Link>
      </div>

      <div className="mt-8">
        {byDealer.size === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <p className="text-gray-500">No dealer listings yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {[...byDealer.entries()].map(([dealerId, dealerListings]) => (
              <div key={dealerId} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {dealerMap[dealerId] ?? "Unknown dealer"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {dealerListings.length} {dealerListings.length === 1 ? "vehicle" : "vehicles"}
                    </p>
                  </div>
                  <Link
                    href={`/api/admin/dealer-listings/export?dealerId=${dealerId}`}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV
                  </Link>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase text-gray-400">
                        <th className="py-2 pr-4">Vehicle</th>
                        <th className="py-2 pr-4">Condition</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Mileage</th>
                        <th className="py-2 pr-4">Submitted</th>
                        <th className="py-2 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealerListings.map((listing) => (
                        <tr key={listing.id} className="border-b border-gray-100 text-gray-700 last:border-0">
                          <td className="py-2 pr-4 font-medium text-gray-900">
                            {listing.year} {listing.brand} {listing.model}
                          </td>
                          <td className="py-2 pr-4 capitalize">{listing.condition ?? "—"}</td>
                          <td className="py-2 pr-4">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[listing.status] ?? ""}`}>
                              {listing.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4">£{Number(listing.price).toLocaleString()}</td>
                          <td className="py-2 pr-4">{Number(listing.mileage).toLocaleString()} mi</td>
                          <td className="py-2 pr-4 text-gray-400">
                            {new Date(listing.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="py-2 pl-4">
                            <div className="flex justify-end">
                              {listing.status === "pending" ? (
                                <AdminDealerListingReviewButton listingId={listing.id} />
                              ) : (
                                <AdminDealerListingActions id={listing.id} status={listing.status} condition={listing.condition} />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
