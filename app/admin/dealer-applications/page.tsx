export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";

type Application = {
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
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  contacted: "text-brand bg-brand/8 border-brand/20",
  resolved: "text-gray-500 bg-gray-100 border-gray-200",
};

async function getApplications(): Promise<Application[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, ev_model_label, notes, status, created_at")
    .eq("sector", "dealer_application")
    .order("created_at", { ascending: false });

  if (error) { console.error("[admin/dealer-applications]", error.message); return []; }
  return (data ?? []) as Application[];
}

export default async function DealerApplicationsAdminPage() {
  const applications = await getApplications();

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    contacted: applications.filter((a) => a.status === "contacted").length,
    resolved: applications.filter((a) => a.status === "resolved").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dealer Partner Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          White-label AI Match applications from /dealers. Target: 80 dealers × £900/mo avg = £72,000/mo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total",         value: counts.total,     color: "text-gray-900" },
          { label: "Pending demo",  value: counts.pending,   color: "text-amber-600" },
          { label: "Demo booked",   value: counts.contacted, color: "text-brand" },
          { label: "Live",          value: counts.resolved,  color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Revenue</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          £{(counts.resolved * 500).toLocaleString()} – £{(counts.resolved * 2000).toLocaleString()}/mo
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {counts.resolved} live dealers at £500–£2,000/mo · Pipeline: {counts.pending} demos pending
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-gray-500">No applications yet.</p>
          <p className="mt-1 text-xs text-gray-400">Applications appear here once dealers apply at /dealers</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const parsed = parseNotes(app.notes);
            const cfg = STATUS_COLORS[app.status] ?? STATUS_COLORS.pending;
            return (
              <div key={app.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{app.full_name}</p>
                    <p className="text-xs text-gray-400">{app.email}{app.phone ? ` · ${app.phone}` : ""}</p>
                  </div>
                  <span className={`shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${cfg}`}>
                    {app.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Dealership",   value: parsed["dealership"] },
                    { label: "Website",      value: parsed["website"] },
                    { label: "Monthly leads", value: parsed["monthly leads"] },
                    { label: "Plan",         value: parsed["plan interest"] },
                  ].filter((r) => r.value).map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
