export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";

type Enquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  ev_model_label: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

function parseNotes(notes: string | null) {
  if (!notes) return {};
  const result: Record<string, string> = {};
  for (const line of notes.split("\n")) {
    const colon = line.indexOf(":");
    if (colon > 0) result[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
  }
  return result;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-500/8 border-amber-500/20",
  contacted: "text-brand bg-brand/8 border-brand/20",
  resolved: "text-white/40 bg-white/5 border-white/10",
};

async function getEnquiries(): Promise<Enquiry[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, ev_model_label, notes, status, created_at")
    .eq("sector", "fleet_enquiry")
    .order("created_at", { ascending: false });

  if (error) { console.error("[admin/fleet-enquiries]", error.message); return []; }
  return (data ?? []) as Enquiry[];
}

export default async function FleetEnquiriesAdminPage() {
  const enquiries = await getEnquiries();

  const counts = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Fleet Tool Enquiries</h1>
        <p className="mt-1 text-sm text-white/50">
          SME fleet transition enquiries from /fleet. Target: £299–£999/mo per client.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total",     value: counts.total,     color: "text-white" },
          { label: "Pending",   value: counts.pending,   color: "text-amber-400" },
          { label: "Contacted", value: counts.contacted,  color: "text-brand" },
          { label: "Resolved",  value: counts.resolved,   color: "text-white/50" },
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
          £{(counts.contacted * 299).toLocaleString()} – £{(counts.contacted * 999).toLocaleString()}/mo
        </p>
        <p className="mt-1 text-xs text-white/50">
          From {counts.contacted} active clients at £299–£999/mo SaaS
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] py-12 text-center">
          <p className="text-white/40">No fleet enquiries yet.</p>
          <p className="mt-1 text-xs text-white/25">Enquiries appear here once businesses submit at /fleet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enq) => {
            const parsed = parseNotes(enq.notes);
            const cfg = STATUS_COLORS[enq.status] ?? STATUS_COLORS.pending;
            return (
              <div key={enq.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{enq.full_name}</p>
                    <p className="text-xs text-white/40">{enq.email}{enq.phone ? ` · ${enq.phone}` : ""}</p>
                  </div>
                  <span className={`shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${cfg}`}>
                    {enq.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Company",      value: parsed["company"] },
                    { label: "Fleet size",   value: parsed["fleet size"] },
                    { label: "Industry",     value: parsed["industry"] },
                    { label: "Est. saving",  value: parsed["estimated annual saving"] },
                  ].filter((r) => r.value).map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-white/6 bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
                      <p className="mt-1 text-xs font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/30">
                  {new Date(enq.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
