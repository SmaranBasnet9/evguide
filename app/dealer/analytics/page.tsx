import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics | Dealer Portal" };

// ── helpers ──────────────────────────────────────────────────────────────────

function dayLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Build a map of ISO date → count for the last N days
function buildDailyMap(rows: { created_at: string }[], days: number): { label: string; count: number; date: string }[] {
  const map = new Map<string, number>();
  const now = new Date();

  const result: { label: string; count: number; date: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    map.set(key, 0);
    result.push({ label: dayLabel(d), count: 0, date: key });
  }

  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return result.map((r) => ({ ...r, count: map.get(r.date) ?? 0 }));
}

// ── Status colour helpers ────────────────────────────────────────────────────

const STATUS_COLOURS: Record<string, string> = {
  live:     "bg-green-500",
  pending:  "bg-amber-400",
  draft:    "bg-white/20",
  rejected: "bg-red-500",
  sold:     "bg-brand",
};

const STATUS_TEXT: Record<string, string> = {
  live:     "text-green-400",
  pending:  "text-amber-400",
  draft:    "text-white/50",
  rejected: "text-red-400",
  sold:     "text-brand",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DealerAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dealer/analytics");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/dealer");

  const dealerId = dealerProfile.id;

  // ── Counts ────────────────────────────────────────────────────────────────
  const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: allListings },
    { data: enquiries30d },
    { count: unreadCount },
    { data: topListings },
  ] = await Promise.all([
    supabase
      .from("dealer_listings")
      .select("id, status")
      .eq("dealer_id", dealerId),

    supabase
      .from("dealer_enquiries")
      .select("id, created_at, listing_id, is_read")
      .eq("dealer_id", dealerId)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false }),

    supabase
      .from("dealer_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerId)
      .eq("is_read", false),

    supabase
      .from("dealer_listings")
      .select("id, brand, model, year, status, created_at")
      .eq("dealer_id", dealerId),
  ]);

  const listings = allListings ?? [];
  const enqRows  = enquiries30d ?? [];
  const tops     = topListings ?? [];

  // Status breakdown
  const statusCounts: Record<string, number> = { live: 0, pending: 0, draft: 0, rejected: 0, sold: 0 };
  for (const l of listings) {
    if (l.status in statusCounts) statusCounts[l.status]++;
    else statusCounts[l.status] = (statusCounts[l.status] ?? 0) + 1;
  }
  const totalListings = listings.length;

  // Enquiry counts per listing (last 30d)
  const enquiriesPerListing = new Map<string, number>();
  for (const e of enqRows) {
    enquiriesPerListing.set(e.listing_id, (enquiriesPerListing.get(e.listing_id) ?? 0) + 1);
  }

  // Top 5 by enquiry count
  const topVehicles = tops
    .map((l) => ({ ...l, enqCount: enquiriesPerListing.get(l.id) ?? 0 }))
    .filter((l) => l.enqCount > 0)
    .sort((a, b) => b.enqCount - a.enqCount)
    .slice(0, 5);

  // Daily bar chart data (last 14 days)
  const dailyData = buildDailyMap(enqRows, 14);
  const maxDay    = Math.max(...dailyData.map((d) => d.count), 1);
  const allZero   = dailyData.every((d) => d.count === 0);

  const liveCnt       = statusCounts.live ?? 0;
  const total30dEnq   = enqRows.length;
  const enqPerListing = liveCnt > 0 ? (total30dEnq / liveCnt).toFixed(1) : "—";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-white/50">Last 30 days</p>
      </div>

      {/* Row 1: stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Live Listings",      value: liveCnt,             sub: "currently active" },
          { label: "Total Enquiries",    value: total30dEnq,         sub: "last 30 days" },
          { label: "Unread Leads",       value: unreadCount ?? 0,    sub: "need response" },
          { label: "Enquiries / Listing", value: enqPerListing,      sub: "conversion proxy" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/50">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-white/30">{sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: chart + breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Bar chart — 2/3 */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Enquiries — Last 14 Days</h2>
          {allZero ? (
            <p className="py-10 text-center text-sm text-white/40">No enquiries in this period</p>
          ) : (
            <div className="flex items-end gap-1.5" style={{ height: 100 }}>
              {dailyData.map(({ label, count, date }) => {
                const barH = Math.round((count / maxDay) * 80);
                return (
                  <div key={date} className="group flex flex-1 flex-col items-center gap-1">
                    <div
                      className="relative w-full rounded-t-sm bg-brand/60 transition-all hover:bg-brand"
                      style={{ height: barH, minHeight: count > 0 ? 4 : 0 }}
                      title={`${count} enquir${count !== 1 ? "ies" : "y"}`}
                    />
                    <span className="text-[9px] text-white/30 group-hover:text-white/60">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inventory breakdown — 1/3 */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 text-base font-semibold text-white">Inventory</h2>
          <div className="space-y-4">
            {(["live", "pending", "draft", "rejected"] as const).map((status) => {
              const cnt = statusCounts[status] ?? 0;
              const pct = totalListings > 0 ? Math.round((cnt / totalListings) * 100) : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`text-xs font-medium capitalize ${STATUS_TEXT[status]}`}>{status}</span>
                    <span className="text-xs text-white/50">{cnt} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all ${STATUS_COLOURS[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {totalListings === 0 && (
              <p className="text-sm text-white/40">No listings yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Top vehicles */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="mb-6 text-base font-semibold text-white">Top Vehicles by Leads</h2>
        {topVehicles.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/40">No enquiries yet — leads will appear here once buyers reach out.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Vehicle", "Status", "Enquiries", "Listed"].map((h) => (
                    <th key={h} className="pb-3 pr-6 text-left text-xs font-medium text-white/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {topVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-6 font-medium text-white">
                      {v.year} {v.brand} {v.model}
                    </td>
                    <td className="py-3 pr-6">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_TEXT[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6 font-semibold text-brand">{v.enqCount}</td>
                    <td className="py-3 text-xs text-white/40">{fmtDate(v.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
