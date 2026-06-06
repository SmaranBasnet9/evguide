import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLeadTable from "@/components/AdminLeadTable";
import LeadScoreBadge from "@/components/LeadScoreBadge";
import { getPipelineLeads } from "@/lib/lead-pipeline";

export const metadata = {
  title: "Lead Pipeline | EV Guide Admin",
  description: "Platform lead scores, pipeline stages, and scoring intelligence.",
};

export const revalidate = 60;

export default async function PlatformLeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role as string | undefined;
  if (role !== "admin" && role !== "super_admin") redirect("/");

  const leads = await getPipelineLeads();

  const financeReady = leads.filter((l) => l.category === "finance_ready").length;
  const hot          = leads.filter((l) => l.category === "hot").length;
  const warm         = leads.filter((l) => l.category === "warm").length;
  const withConsult  = leads.filter((l) => l.consultation_id).length;
  const withFinance  = leads.filter((l) => l.finance_request_id).length;

  const stats = [
    { label: "Total Leads",      value: leads.length, sub: "Scored sessions",      color: "border-gray-200  bg-white    text-gray-900" },
    { label: "Finance Ready",    value: financeReady,  sub: "Score >= 75 · Act now", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    { label: "Hot",              value: hot,           sub: "Score 50–74",          color: "border-orange-200  bg-orange-50  text-orange-700" },
    { label: "Warm",             value: warm,          sub: "Score 25–49",          color: "border-amber-200   bg-amber-50   text-amber-700" },
    { label: "With Consult.",    value: withConsult,   sub: "Completed wizard",     color: "border-blue-200    bg-blue-50    text-blue-700" },
    { label: "Finance Requests", value: withFinance,   sub: "Submitted forms",      color: "border-violet-200  bg-violet-50  text-violet-700" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Lead Intelligence</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Lead Pipeline</h1>
        <p className="mt-2 text-sm text-gray-500">
          Platform-scored leads ranked by buying intent. Scores are computed from
          consultation, finance, comparison, and browsing behaviour.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className={`rounded-2xl border p-5 shadow-sm ${color}`}>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Finance-ready highlight strip */}
      {financeReady > 0 && (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Finance-ready leads — act now
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {leads
              .filter((l) => l.category === "finance_ready")
              .slice(0, 3)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {lead.full_name ?? lead.display_id}
                      </p>
                      {lead.email && (
                        <p className="truncate text-xs text-gray-400">{lead.email}</p>
                      )}
                    </div>
                    <LeadScoreBadge score={lead.score} category={lead.category} size="sm" />
                  </div>
                  {lead.top_recommended_vehicle && (
                    <p className="mt-2 text-sm text-gray-600">
                      Top match: <span className="font-medium text-gray-900">{lead.top_recommended_vehicle}</span>
                    </p>
                  )}
                  {lead.consultation_budget_max && (
                    <p className="mt-1 text-xs text-gray-400">
                      Budget: £{lead.consultation_budget_max.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lead table */}
      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          <p className="text-sm">No scored leads yet.</p>
          <p className="mt-1 text-xs">
            Scores are written when users complete the consultation or trigger major events.
          </p>
        </div>
      ) : (
        <AdminLeadTable leads={leads} />
      )}
    </div>
  );
}
