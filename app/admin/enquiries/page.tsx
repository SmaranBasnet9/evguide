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
  pending:   "border-amber-200  bg-amber-50   text-amber-700",
  contacted: "border-blue-200   bg-blue-50    text-blue-700",
  resolved:  "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:   Clock,
  contacted: PhoneCall,
  resolved:  CheckCircle,
};

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
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Enquiries</h1>
        <p className="mt-2 text-sm text-gray-500">
          All enquiry submissions from the platform. Update status after contacting the user.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pending",   value: pending,   color: "border-amber-200  bg-amber-50   text-amber-700"  },
          { label: "Contacted", value: contacted, color: "border-blue-200   bg-blue-50    text-blue-700"   },
          { label: "Resolved",  value: resolved,  color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border p-5 ${color}`}>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <EnquiriesToolbar from={from} to={to} total={enquiries.length} />

      {/* Table */}
      {enquiries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 py-16 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">No enquiries found</p>
          <p className="text-sm text-gray-500">
            {from || to ? "Try adjusting the date range." : "Enquiries submitted by users will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([dateKey, rows]) => (
            <div key={dateKey}>
              {/* Date group header */}
              <div className="mb-3 flex items-center gap-3">
                <p className="text-xs font-semibold text-gray-500">{formatDateGroup(rows[0].created_at)}</p>
                <div className="h-px flex-1 bg-gray-200" />
                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                  {rows.length}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200">
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {["Name", "Contact", "Vehicle / Topic", "Message", "Status", "Time", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
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
                            className={`border-b border-gray-100 transition hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                          >
                            <td className="px-4 py-3.5 font-medium text-gray-900">{e.full_name}</td>
                            <td className="px-4 py-3.5">
                              <p className="text-gray-700">{e.email}</p>
                              {e.phone && <p className="text-xs text-gray-400">{e.phone}</p>}
                            </td>
                            <td className="px-4 py-3.5 text-gray-600">
                              {e.ev_model_label ?? <span className="text-gray-400 italic">General</span>}
                            </td>
                            <td className="max-w-[220px] px-4 py-3.5 text-xs text-gray-500">
                              <p className="line-clamp-2">{e.notes ?? "—"}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[e.status] ?? STATUS_STYLES.pending}`}>
                                <StatusIcon className="h-3 w-3" />
                                {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
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
                <div className="divide-y divide-gray-100 md:hidden">
                  {rows.map((e) => {
                    const StatusIcon = STATUS_ICONS[e.status] ?? Clock;
                    return (
                      <div key={e.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">{e.full_name}</p>
                            <p className="text-xs text-gray-500">{e.email}</p>
                            {e.phone && <p className="text-xs text-gray-400">{e.phone}</p>}
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[e.status] ?? STATUS_STYLES.pending}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {e.status}
                          </span>
                        </div>
                        {e.ev_model_label && (
                          <p className="text-xs text-gray-600">{e.ev_model_label}</p>
                        )}
                        {e.notes && (
                          <p className="text-xs text-gray-400 line-clamp-2">{e.notes}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-gray-400">
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
