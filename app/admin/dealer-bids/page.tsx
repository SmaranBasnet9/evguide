export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import DealerBidsTable from "@/components/admin/DealerBidsTable";

type BidRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  ev_model_label: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

async function getBidRequests(): Promise<BidRequest[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, ev_model_label, notes, status, created_at")
    .eq("sector", "dealer_bid")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/dealer-bids]", error.message);
    return [];
  }
  return (data ?? []) as BidRequest[];
}

export default async function DealerBidsAdminPage() {
  const requests = await getBidRequests();

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    contacted: requests.filter((r) => r.status === "contacted").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dealer Bid Requests</h1>
        <p className="mt-1 text-sm text-white/50">
          Buyer quote requests ready to forward to verified dealers. Each lead generates £30–£80 revenue.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total requests", value: counts.total, color: "text-white" },
          { label: "Pending action", value: counts.pending, color: "text-amber-400" },
          { label: "Dealers contacted", value: counts.contacted, color: "text-brand" },
          { label: "Resolved", value: counts.resolved, color: "text-white/50" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue projection */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Revenue projection</p>
        <p className="mt-2 text-2xl font-bold text-white">
          £{(counts.pending * 55).toLocaleString()} – £{(counts.pending * 80).toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-white/50">
          Estimated from {counts.pending} pending requests at £55–£80 per qualified lead
        </p>
      </div>

      <DealerBidsTable requests={requests} />
    </div>
  );
}
