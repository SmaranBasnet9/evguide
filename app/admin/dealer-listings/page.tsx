export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import AdminDealerListingReviewButton from "@/components/AdminDealerListingReviewButton";

async function getPendingListings() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, status, description, images, location, drive, battery_kwh, range_km, created_at, dealer_id")
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

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dealer Listings</h1>
        <p className="mt-1 text-gray-500">{listings.length} total · {pending} pending review · {live} live</p>
      </div>

      <div className="mt-8">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <p className="text-gray-500">No dealer listings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {listing.year} {listing.brand} {listing.model}
                      </h2>
                      <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[listing.status] ?? ""}`}>
                        {listing.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      £{Number(listing.price).toLocaleString()} · {Number(listing.mileage).toLocaleString()} mi
                      {listing.location ? ` · ${listing.location}` : ""}
                      {listing.battery_kwh ? ` · ${listing.battery_kwh} kWh` : ""}
                      {listing.range_km ? ` · ${listing.range_km} km range` : ""}
                    </p>
                    <p className="mt-1 text-xs text-brand">
                      {dealerMap[listing.dealer_id] ?? "Unknown dealer"}
                    </p>
                    {listing.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">{listing.description}</p>
                    ) : null}
                    {listing.images && listing.images.length > 0 ? (
                      <div className="mt-3 flex gap-2">
                        {listing.images.slice(0, 4).map((url: string) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={url} src={url} alt="" className="h-16 w-20 rounded-lg object-cover" />
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 text-xs text-gray-400">
                      Submitted {new Date(listing.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {listing.status === "pending" ? (
                    <AdminDealerListingReviewButton listingId={listing.id} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
