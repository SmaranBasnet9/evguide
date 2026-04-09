import Link from "next/link";
import { getDatabaseAuditReport, type AuditStatus } from "@/lib/adminAudit";

const toneMap: Record<AuditStatus, string> = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  missing: "border-rose-200 bg-rose-50 text-rose-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  unverified: "border-slate-200 bg-slate-100 text-slate-800",
};

const badgeMap: Record<AuditStatus, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  missing: "bg-rose-100 text-rose-700",
  error: "bg-rose-100 text-rose-700",
  unverified: "bg-slate-200 text-slate-700",
};

function formatStatus(status: AuditStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function AdminAuditPage() {
  const report = await getDatabaseAuditReport();

  const issueCount = report.summary.warning + report.summary.missing + report.summary.error;
  const blockedRoutes = report.routes.filter((route) => route.status === "error").length;
  const degradedRoutes = report.routes.filter((route) => route.status === "warning").length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">System Audit</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Database and admin readiness</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            This audit checks the tables and columns the platform expects, highlights what the admin
            panel depends on, and shows which local Supabase migrations are present in the repo.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <p>
            Generated: <span className="font-medium text-slate-900">{new Date(report.generatedAt).toLocaleString("en-GB")}</span>
          </p>
          <p className="mt-1">
            Admin client: <span className="font-medium text-slate-900">{report.adminClientReady ? "Ready" : "Not ready"}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Healthy checks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{report.summary.healthy}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">Warnings</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">{report.summary.warning}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-rose-700">Missing or broken</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">{report.summary.missing + report.summary.error}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-700">Blocked admin routes</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{blockedRoutes}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Degraded routes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{degradedRoutes}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Environment and migrations</h2>
            <p className="mt-1 text-sm text-slate-500">
              This helps separate missing SQL from missing environment setup.
            </p>
          </div>
          <div className="space-y-4 px-6 py-5">
            <div className={`rounded-2xl border p-4 ${report.adminClientReady ? toneMap.healthy : toneMap.unverified}`}>
              <p className="text-sm font-semibold">Admin client status</p>
              <p className="mt-1 text-sm">{report.adminClientMessage}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <span className={`rounded-full px-2.5 py-1 ${report.env.hasSupabaseUrl ? badgeMap.healthy : badgeMap.missing}`}>
                  {report.env.hasSupabaseUrl ? "Supabase URL present" : "Supabase URL missing"}
                </span>
                <span className={`rounded-full px-2.5 py-1 ${report.env.hasServiceRoleKey ? badgeMap.healthy : badgeMap.missing}`}>
                  {report.env.hasServiceRoleKey ? "Service role key present" : "Service role key missing"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Local migration files</p>
              <div className="mt-3 space-y-3">
                {report.migrationFiles.map((migration) => (
                  <div key={migration.file} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{migration.file}</p>
                      <p className="text-slate-500">{migration.description}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${migration.exists ? badgeMap.healthy : badgeMap.missing}`}>
                      {migration.exists ? "Present" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Admin route impact</h2>
            <p className="mt-1 text-sm text-slate-500">
              Which parts of the admin panel are healthy, degraded, or blocked.
            </p>
          </div>
          <div className="space-y-3 px-6 py-5">
            {report.routes.map((route) => (
              <div key={route.route} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{route.label}</p>
                    <p className="text-sm text-slate-500">{route.route}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeMap[route.status]}`}>
                    {formatStatus(route.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{route.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Schema checks</h2>
          <p className="mt-1 text-sm text-slate-500">
            Each row checks a table and the specific columns the product currently expects.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-6 py-3 font-semibold text-slate-600">Check</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Table</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Columns</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Used by</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Migration</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.checks.map((check) => (
                <tr key={check.id} className="border-b border-slate-100 align-top last:border-b-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{check.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{check.message}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs">{check.table}</code>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{check.columns.join(", ")}</td>
                  <td className="px-6 py-4 text-slate-600">{check.usedBy.join(", ")}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {check.localMigration ? (
                      <div>
                        <p className="font-medium text-slate-900">{check.localMigration}</p>
                        <p className="text-xs text-slate-500">{check.hasLocalMigration ? "Present in repo" : "Referenced but not found locally"}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">No local migration tracked</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeMap[check.status]}`}>
                      {formatStatus(check.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-950">Recommended next actions</h2>
        <div className="mt-3 space-y-2 text-sm text-blue-900">
          <p>1. Run every missing local SQL migration in Supabase SQL Editor before relying on the affected admin routes.</p>
          <p>2. If this page shows many items as unverified, confirm `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are valid in the running environment.</p>
          <p>3. If blog SEO fields are warning or missing, run `004_add_blog_seo_columns.sql` so the upgraded article metadata and admin blog editor can use the new fields safely.</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/blog" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Review blog admin
          </Link>
          <Link href="/admin/seo" className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100">
            Review SEO admin
          </Link>
        </div>
        <p className="mt-4 text-xs text-blue-800">
          Current detected issues: {issueCount}. This page audits the connected environment, so its status is more reliable than assuming the repo and live Supabase are already aligned.
        </p>
      </section>
    </div>
  );
}
