import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminExchangeFilters from "@/components/exchange/AdminExchangeFilters";
import type { ExchangeRequestRow, ExchangeStatus } from "@/types";

// ── Server-side data fetch ────────────────────────────────────────────────────

async function getExchangeRequests(status?: string): Promise<ExchangeRequestRow[]> {
  const admin = createAdminClient();
  let query = admin
    .from("exchange_requests")
    .select(
      `id, created_at, updated_at,
       customer_name, phone, email, city,
       current_vehicle_brand, current_vehicle_model, current_vehicle_year,
       fuel_type, mileage, condition,
       target_ev_brand, target_ev_model, target_ev_price,
       estimated_value, valuation_confidence, final_offer_value,
       status, priority, assigned_to, source_page, is_read`
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data ?? []) as ExchangeRequestRow[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ExchangeStatus, string> = {
  new:                  "New",
  contacted:            "Contacted",
  valuation_reviewed:   "Valuation reviewed",
  inspection_scheduled: "Inspection scheduled",
  offer_sent:           "Offer sent",
  converted:            "Converted",
  rejected:             "Rejected",
  archived:             "Archived",
};

const STATUS_COLORS: Record<ExchangeStatus, string> = {
  new:                  "bg-blue-500/20 text-blue-300",
  contacted:            "bg-cyan-500/20 text-cyan-300",
  valuation_reviewed:   "bg-violet-500/20 text-violet-300",
  inspection_scheduled: "bg-amber-500/20 text-amber-300",
  offer_sent:           "bg-orange-500/20 text-orange-300",
  converted:            "bg-emerald-500/20 text-emerald-300",
  rejected:             "bg-red-500/20 text-red-300",
  archived:             "bg-white/[0.05] text-white/50",
};

const PRIORITY_COLORS: Record<string, string> = {
  low:    "bg-white/[0.05] text-white/60",
  medium: "bg-blue-500/20 text-blue-300",
  high:   "bg-amber-500/20 text-amber-300",
  urgent: "bg-red-500/20 text-red-300",
};

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminExchangePage({ searchParams }: Props) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "super_admin") redirect("/");

  const params = await searchParams;
  const activeStatus = params.status ?? "all";
  const rows = await getExchangeRequests(activeStatus === "all" ? undefined : activeStatus);

  // Counts per status for filter tabs
  const allRows = await getExchangeRequests();
  const countsByStatus = allRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
  const unreadCount = allRows.filter((r) => !r.is_read).length;

  const tabs: { value: string; label: string }[] = [
    { value: "all", label: `All (${allRows.length})` },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
      value,
      label: `${label} (${countsByStatus[value] ?? 0})`,
    })),
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
          <p className="mt-1 text-sm text-white/50">
            {allRows.length} total · {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/exchange${tab.value === "all" ? "" : `?status=${tab.value}`}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeStatus === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white/[0.05] text-white/60 hover:bg-white/[0.08]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Client-side search + filter bar */}
      <AdminExchangeFilters />

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-white/40">
          No exchange requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/[0.06] text-sm">
            <thead className="bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Current vehicle</th>
                <th className="px-4 py-3">Target EV</th>
                <th className="px-4 py-3">Est. value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-white/[0.03] ${!row.is_read ? "bg-blue-500/[0.06]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!row.is_read && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" title="Unread" />
                      )}
                      <div>
                        <p className="font-semibold text-white">{row.customer_name}</p>
                        <p className="text-xs text-white/50">{row.email}</p>
                        <p className="text-xs text-white/40">{row.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-white">
                      {row.current_vehicle_year} {row.current_vehicle_brand} {row.current_vehicle_model}
                    </p>
                    <p className="text-xs text-white/50 capitalize">{row.fuel_type}</p>
                    {row.mileage != null && (
                      <p className="text-xs text-white/40">{row.mileage.toLocaleString()} km</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {row.target_ev_brand ? (
                      <div>
                        <p className="font-medium text-white">
                          {row.target_ev_brand} {row.target_ev_model}
                        </p>
                        {row.target_ev_price != null && (
                          <p className="text-xs text-white/50">
                            £{Number(row.target_ev_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {row.estimated_value != null ? (
                      <div>
                        <p className="font-semibold text-white">
                          £{Number(row.estimated_value).toLocaleString()}
                        </p>
                        {row.final_offer_value != null && (
                          <p className="text-xs text-emerald-400 font-semibold">
                            Final: £{Number(row.final_offer_value).toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-white/40 capitalize">
                          {row.valuation_confidence} conf.
                        </p>
                      </div>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_COLORS[row.status as ExchangeStatus] ?? "bg-white/[0.05] text-white/60"
                      }`}
                    >
                      {STATUS_LABELS[row.status as ExchangeStatus] ?? row.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        PRIORITY_COLORS[row.priority] ?? "bg-white/[0.05] text-white/60"
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/exchange/${row.id}`}
                      className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/[0.12] whitespace-nowrap"
                    >
                      View
                    </Link>
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
