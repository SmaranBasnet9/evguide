export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import { usedEvListings } from "@/data/usedEvListings";

type Listing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  seller_name: string;
  seller_type: string;
  contact_email: string;
  status: string;
  created_at: string;
};

async function getListings(): Promise<Listing[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("used_ev_listings")
    .select("id, brand, model, year, price, mileage, location, seller_name, seller_type, contact_email, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    // Return static data shaped for display
    return usedEvListings.map((l) => ({
      id: l.id,
      brand: l.brand,
      model: l.model,
      year: l.year,
      price: l.price,
      mileage: l.mileage,
      location: l.location,
      seller_name: l.sellerName,
      seller_type: l.sellerType,
      contact_email: "—",
      status: l.status,
      created_at: l.listedAt,
    }));
  }
  return data as Listing[];
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-500/8 border-emerald-500/20",
  pending: "text-amber-400 bg-amber-500/8 border-amber-500/20",
  sold: "text-white/40 bg-white/5 border-white/10",
};

export default async function UsedListingsAdminPage() {
  const listings = await getListings();

  const counts = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    pending: listings.filter((l) => l.status === "pending").length,
    sold: listings.filter((l) => l.status === "sold").length,
  };

  const totalValue = listings.filter((l) => l.status === "active").reduce((s, l) => s + l.price, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Used EV Listings</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage the used EV marketplace. Review, approve, and publish listings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total listings",  value: counts.total,   color: "text-white" },
          { label: "Live",            value: counts.active,  color: "text-emerald-400" },
          { label: "Pending review",  value: counts.pending, color: "text-amber-400" },
          { label: "Sold",            value: counts.sold,    color: "text-white/50" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue projection */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Live inventory value</p>
        <p className="mt-2 text-2xl font-bold text-white">{formatGBP(totalValue)}</p>
        <p className="mt-1 text-xs text-white/50">
          {counts.active} live listings · Listing fees: £{(counts.active * 25).toLocaleString()}–£{(counts.active * 75).toLocaleString()} earned
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03]">
                {["Vehicle", "Price", "Mileage", "Location", "Seller", "Status", "Listed"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {listings.map((l) => (
                <tr key={l.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{l.year} {l.brand} {l.model}</p>
                    <p className="text-xs text-white/40 capitalize">{l.seller_type}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand">{formatGBP(l.price)}</td>
                  <td className="px-4 py-3 text-white/70">{l.mileage.toLocaleString()} mi</td>
                  <td className="px-4 py-3 text-white/70">{l.location}</td>
                  <td className="px-4 py-3">
                    <p className="text-white/70">{l.seller_name}</p>
                    <p className="text-xs text-white/30">{l.contact_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[l.status] ?? STATUS_COLORS.pending}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">
                    {new Date(l.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
