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
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/20",
  contacted: "bg-blue-500/15  text-blue-400  border-blue-500/20",
  resolved:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
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
          <p className="text-sm font-semibold text-[#1FBF9F]">Vehicle Consultancy</p>
          <h1 className="text-3xl font-bold text-white">Vehicle Enquiries</h1>
          <p className="mt-1 text-sm text-white/50">{rows.length} total enquiries</p>
        </div>
        <Link
          href="/api/admin/consultations/export"
          download
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/70 transition-colors duration-150 hover:bg-white/[0.10] hover:text-white"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Pending",   value: pending,   color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Contacted", value: contacted, color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Resolved",  value: resolved,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border px-5 py-4 ${bg}`}>
            <p className="text-sm font-medium text-white/60">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-white/30">
          No consultation requests yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Applicant</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Selection</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Contact</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Preferred Time</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Notes</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Submitted</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white/40">Actions</th>
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

                  const statusStyle = STATUS_STYLES[row.status] ?? "bg-white/10 text-white/50 border-white/10";

                  return (
                    <tr key={row.id} className="border-b border-white/[0.06] last:border-b-0 transition-colors hover:bg-white/[0.04]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{row.full_name}</p>
                        <p className="text-xs text-white/40">{row.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/80">{selectionLabel}</p>
                        <p className="text-xs capitalize text-white/40">{row.sector}</p>
                      </td>
                      <td className="px-5 py-4 text-white/50">{row.phone ?? "-"}</td>
                      <td className="px-5 py-4 text-white/50">
                        {row.preferred_time
                          ? new Date(row.preferred_time).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "-"}
                      </td>
                      <td className="max-w-[180px] px-5 py-4 text-white/50">
                        <p className="line-clamp-2 text-xs">{row.notes ?? "-"}</p>
                      </td>
                      <td className="px-5 py-4 text-white/50">
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
