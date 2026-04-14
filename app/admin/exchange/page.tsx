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
  new:                  "bg-blue-100 text-blue-700",
  contacted:            "bg-cyan-100 text-cyan-700",
  valuation_reviewed:   "bg-violet-100 text-violet-700",
  inspection_scheduled: "bg-amber-100 text-amber-700",
  offer_sent:           "bg-orange-100 text-orange-700",
  converted:            "bg-emerald-100 text-emerald-700",
  rejected:             "bg-red-100 text-red-700",
  archived:             "bg-slate-100 text-slate-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  low:    "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high:   "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
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
  if (profile?.role !== "admin") redirect("/");

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
          <h1 className="text-2xl font-bold text-slate-900">Exchange Requests</h1>
          <p className="mt-1 text-sm text-slate-500">
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
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
          No exchange requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
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
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-slate-50 ${!row.is_read ? "bg-blue-50/40" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!row.is_read && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" title="Unread" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{row.customer_name}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                        <p className="text-xs text-slate-400">{row.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {row.current_vehicle_year} {row.current_vehicle_brand} {row.current_vehicle_model}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{row.fuel_type}</p>
                    {row.mileage != null && (
                      <p className="text-xs text-slate-400">{row.mileage.toLocaleString()} km</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {row.target_ev_brand ? (
                      <div>
                        <p className="font-medium text-slate-800">
                          {row.target_ev_brand} {row.target_ev_model}
                        </p>
                        {row.target_ev_price != null && (
                          <p className="text-xs text-slate-500">
                            £{Number(row.target_ev_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {row.estimated_value != null ? (
                      <div>
                        <p className="font-semibold text-slate-900">
                          £{Number(row.estimated_value).toLocaleString()}
                        </p>
                        {row.final_offer_value != null && (
                          <p className="text-xs text-emerald-600 font-semibold">
                            Final: £{Number(row.final_offer_value).toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 capitalize">
                          {row.valuation_confidence} conf.
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_COLORS[row.status as ExchangeStatus] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {STATUS_LABELS[row.status as ExchangeStatus] ?? row.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        PRIORITY_COLORS[row.priority] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/exchange/${row.id}`}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 whitespace-nowrap"
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
