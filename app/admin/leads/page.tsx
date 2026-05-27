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
    { label: "Total Leads",      value: leads.length, sub: "Scored sessions",      color: "border-white/10  bg-white/[0.04]    text-white" },
    { label: "Finance Ready",    value: financeReady,  sub: "Score >= 75 · Act now", color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
    { label: "Hot",              value: hot,           sub: "Score 50–74",          color: "border-orange-500/20  bg-orange-500/10  text-orange-400" },
    { label: "Warm",             value: warm,          sub: "Score 25–49",          color: "border-amber-500/20   bg-amber-500/10   text-amber-400" },
    { label: "With Consult.",    value: withConsult,   sub: "Completed wizard",     color: "border-blue-500/20    bg-blue-500/10    text-blue-400" },
    { label: "Finance Requests", value: withFinance,   sub: "Submitted forms",      color: "border-violet-500/20  bg-violet-500/10  text-violet-400" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Lead Intelligence</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Lead Pipeline</h1>
        <p className="mt-2 text-sm text-white/50">
          Platform-scored leads ranked by buying intent. Scores are computed from
          consultation, finance, comparison, and browsing behaviour.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className={`rounded-2xl border p-5 backdrop-blur-sm ${color}`}>
            <p className="text-xs font-medium text-white/50">{label}</p>
            <p className="mt-1 text-3xl font-extrabold">{value}</p>
            {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Finance-ready highlight strip */}
      {financeReady > 0 && (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Finance-ready leads — act now
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {leads
              .filter((l) => l.category === "finance_ready")
              .slice(0, 3)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {lead.full_name ?? lead.display_id}
                      </p>
                      {lead.email && (
                        <p className="truncate text-xs text-white/40">{lead.email}</p>
                      )}
                    </div>
                    <LeadScoreBadge score={lead.score} category={lead.category} size="sm" />
                  </div>
                  {lead.top_recommended_vehicle && (
                    <p className="mt-2 text-sm text-white/70">
                      Top match: <span className="font-medium text-white">{lead.top_recommended_vehicle}</span>
                    </p>
                  )}
                  {lead.consultation_budget_max && (
                    <p className="mt-1 text-xs text-white/40">
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
        <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-white/30">
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
