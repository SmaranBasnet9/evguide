import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessageSquare, Clock, CheckCircle, PhoneCall } from "lucide-react";
import AdminConsultationStatusButton from "@/components/AdminConsultationStatusButton";
import EnquiriesToolbar from "@/components/admin/EnquiriesToolbar";

export const metadata = { title: "Enquiries | EVGuide Admin" };
export const dynamic = "force-dynamic";

type EnquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  sector: string;
  ev_model_label: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "border-amber-500/20  bg-amber-500/10  text-amber-400",
  contacted: "border-blue-500/20   bg-blue-500/10   text-blue-400",
  resolved:  "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:   Clock,
  contacted: PhoneCall,
  resolved:  CheckCircle,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatDateGroup(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function isoDateKey(iso: string) {
  return iso.slice(0, 10); // "YYYY-MM-DD"
}

async function getEnquiries(from: string | null, to: string | null): Promise<EnquiryRow[]> {
  const admin = createAdminClient();
  let query = admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, sector, ev_model_label, notes, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (from) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to)   query = query.lte("created_at", `${to}T23:59:59.999Z`);

  const { data } = await query;
  return (data ?? []) as EnquiryRow[];
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role as string | undefined;
  if (role !== "admin" && role !== "super_admin") redirect("/");

  const { from = "", to = "" } = await searchParams;
  const enquiries = await getEnquiries(from || null, to || null);

  const pending   = enquiries.filter((e) => e.status === "pending").length;
  const contacted = enquiries.filter((e) => e.status === "contacted").length;
  const resolved  = enquiries.filter((e) => e.status === "resolved").length;

  // Group by date
  const groups = new Map<string, EnquiryRow[]>();
  for (const e of enquiries) {
    const key = isoDateKey(e.created_at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Admin</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Enquiries</h1>
        <p className="mt-2 text-sm text-white/50">
          All enquiry submissions from the platform. Update status after contacting the user.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending",   value: pending,   color: "border-amber-500/20  bg-amber-500/10  text-amber-400"  },
          { label: "Contacted", value: contacted, color: "border-blue-500/20   bg-blue-500/10   text-blue-400"   },
          { label: "Resolved",  value: resolved,  color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border p-5 backdrop-blur-sm ${color}`}>
            <p className="text-xs font-medium text-white/50">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <EnquiriesToolbar from={from} to={to} total={enquiries.length} />

      {/* Table */}
      {enquiries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] py-16 text-center">
          <MessageSquare className="h-10 w-10 text-white/20" />
          <p className="text-lg font-semibold text-white">No enquiries found</p>
          <p className="text-sm text-white/40">
            {from || to ? "Try adjusting the date range." : "Enquiries submitted by users will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([dateKey, rows]) => (
            <div key={dateKey}>
              {/* Date group header */}
              <div className="mb-3 flex items-center gap-3">
                <p className="text-xs font-semibold text-white/40">{formatDateGroup(rows[0].created_at)}</p>
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40">
                  {rows.length}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/8">
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/[0.03]">
                        {["Name", "Contact", "Vehicle / Topic", "Message", "Status", "Time", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((e, i) => {
                        const StatusIcon = STATUS_ICONS[e.status] ?? Clock;
                        return (
                          <tr
                            key={e.id}
                            className={`border-b border-white/[0.05] transition hover:bg-white/[0.02] ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                          >
                            <td className="px-4 py-3.5 font-medium text-white">{e.full_name}</td>
                            <td className="px-4 py-3.5">
                              <p className="text-white/80">{e.email}</p>
                              {e.phone && <p className="text-xs text-white/40">{e.phone}</p>}
                            </td>
                            <td className="px-4 py-3.5 text-white/60">
                              {e.ev_model_label ?? <span className="text-white/25 italic">General</span>}
                            </td>
                            <td className="max-w-[220px] px-4 py-3.5 text-xs text-white/50">
                              <p className="line-clamp-2">{e.notes ?? "—"}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[e.status] ?? STATUS_STYLES.pending}`}>
                                <StatusIcon className="h-3 w-3" />
                                {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-white/40 whitespace-nowrap">
                              {new Date(e.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="px-4 py-3.5">
                              <AdminConsultationStatusButton id={e.id} initialStatus={e.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-white/[0.05] md:hidden">
                  {rows.map((e) => {
                    const StatusIcon = STATUS_ICONS[e.status] ?? Clock;
                    return (
                      <div key={e.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">{e.full_name}</p>
                            <p className="text-xs text-white/50">{e.email}</p>
                            {e.phone && <p className="text-xs text-white/40">{e.phone}</p>}
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[e.status] ?? STATUS_STYLES.pending}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {e.status}
                          </span>
                        </div>
                        {e.ev_model_label && (
                          <p className="text-xs text-white/60">{e.ev_model_label}</p>
                        )}
                        {e.notes && (
                          <p className="text-xs text-white/40 line-clamp-2">{e.notes}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/30">
                            {new Date(e.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <AdminConsultationStatusButton id={e.id} initialStatus={e.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
