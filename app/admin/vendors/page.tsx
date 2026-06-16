export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Building2, CheckCircle, Clock, XCircle, PauseCircle } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  verified:  "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  rejected:  "bg-red-50 text-red-700",
  suspended: "bg-orange-50 text-orange-700",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  verified:  <CheckCircle className="h-3.5 w-3.5" />,
  pending:   <Clock className="h-3.5 w-3.5" />,
  rejected:  <XCircle className="h-3.5 w-3.5" />,
  suspended: <PauseCircle className="h-3.5 w-3.5" />,
};

export default async function AdminVendorsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const status = sp.status ?? "";
  const adminClient = createAdminClient();

  let query = adminClient
    .from("vendors")
    .select("id, company_name, email, business_type, status, created_at, city, postcode")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: vendors } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">{vendors?.length ?? 0} vendors</p>
        </div>
        <Link
          href="/admin/vendors/applications"
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90"
        >
          View Applications
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {["", "pending", "verified", "rejected", "suspended"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/vendors?status=${s}` : "/admin/vendors"}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              status === s
                ? "bg-gray-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {(!vendors || vendors.length === 0) ? (
          <div className="p-16 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-semibold text-gray-500">No vendors found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Applied</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{v.company_name}</p>
                    <p className="text-xs text-gray-400">{v.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{v.business_type?.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4 text-gray-600">{[v.city, v.postcode].filter(Boolean).join(", ")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[v.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_ICON[v.status]}
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(v.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/vendors/${v.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-brand/30 hover:text-brand">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
