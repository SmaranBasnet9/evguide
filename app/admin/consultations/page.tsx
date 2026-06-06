import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminConsultationStatusButton from "@/components/AdminConsultationStatusButton";
import AdminConsultationForwardButton from "@/components/AdminConsultationForwardButton";
import { Download } from "lucide-react";

type ConsultationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  sector: string;
  bank_name: string | null;
  ev_model_label: string | null;
  ev_models: { brand: string; model: string }[] | null;
  preferred_time: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  contacted: "bg-blue-50  text-blue-700  border-blue-200",
  resolved:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

async function getConsultations(): Promise<ConsultationRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, sector, bank_name, ev_model_label, ev_models(brand, model), preferred_time, notes, status, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []) as ConsultationRow[];
}

export default async function AdminConsultationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, department")
    .eq("id", user.id)
    .single();
  const role = profile?.role as string | undefined;
  const dept = (profile?.department as string | null) ?? null;
  const canAccess =
    role === "super_admin" ||
    !dept ||
    dept === "management" ||
    (role === "admin" && (dept === "sales" || dept === "support" || dept === "operations"));
  if (!canAccess) redirect("/admin");

  const rows = await getConsultations();
  const pending   = rows.filter((r) => r.status === "pending").length;
  const contacted = rows.filter((r) => r.status === "contacted").length;
  const resolved  = rows.filter((r) => r.status === "resolved").length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Vehicle Consultancy</p>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Enquiries</h1>
          <p className="mt-1 text-sm text-gray-500">{rows.length} total enquiries</p>
        </div>
        <Link
          href="/api/admin/consultations/export"
          download
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Pending",   value: pending,   color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
          { label: "Contacted", value: contacted, color: "text-blue-700",    bg: "bg-blue-50 border-blue-200" },
          { label: "Resolved",  value: resolved,  color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border px-5 py-4 ${bg}`}>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          No consultation requests yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Applicant</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Selection</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Contact</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Preferred Time</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Notes</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Submitted</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const evLabel =
                    row.ev_model_label ||
                    (Array.isArray(row.ev_models) && row.ev_models[0]
                      ? `${row.ev_models[0].brand} ${row.ev_models[0].model}`
                      : null);

                  const selectionLabel =
                    row.sector === "bank"
                      ? row.bank_name
                      : row.sector === "finance"
                      ? evLabel ?? "Finance request"
                      : evLabel ?? "-";

                  const statusStyle = STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-600 border-gray-200";

                  return (
                    <tr key={row.id} className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{row.full_name}</p>
                        <p className="text-xs text-gray-400">{row.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{selectionLabel}</p>
                        <p className="text-xs capitalize text-gray-400">{row.sector}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{row.phone ?? "-"}</td>
                      <td className="px-5 py-4 text-gray-500">
                        {row.preferred_time
                          ? new Date(row.preferred_time).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "-"}
                      </td>
                      <td className="max-w-[180px] px-5 py-4 text-gray-500">
                        <p className="line-clamp-2 text-xs">{row.notes ?? "-"}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(row.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <AdminConsultationStatusButton
                            id={row.id}
                            initialStatus={row.status}
                          />
                          <AdminConsultationForwardButton
                            id={row.id}
                            sector={row.sector}
                            bankName={row.bank_name}
                            applicantName={row.full_name}
                            applicantEmail={row.email}
                            applicantPhone={row.phone}
                            selectedVehicle={evLabel}
                            preferredTime={row.preferred_time}
                            notes={row.notes}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
