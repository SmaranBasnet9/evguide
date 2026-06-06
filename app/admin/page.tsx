import Link from "next/link";
import { AlertCircle, Plus, ShieldCheck } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [
    { count: totalEVs },
    { data: brandRows },
    { data: recentEVs },
    { count: totalBlogPosts },
    { count: publishedBlogPosts },
    { count: totalFeedback },
    { count: approvedFeedback },
    { count: totalConsultations },
    { count: pendingConsultations },
    { count: contactedConsultations },
    { count: resolvedConsultations },
    { count: totalVehicleQueries },
    { count: newVehicleQueries },
    { count: totalSeoPages },
    { count: activeSeoPages },
    { count: totalGeoRegions },
    { count: activeGeoRegions },
  ] = await Promise.all([
    supabase.from("ev_models").select("*", { count: "exact", head: true }),
    supabase.from("ev_models").select("brand"),
    supabase
      .from("ev_models")
      .select("id, brand, model, price, range_km")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("user_ev_feedback").select("*", { count: "exact", head: true }),
    supabase
      .from("user_ev_feedback")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true),
    supabase.from("consultation_requests").select("*", { count: "exact", head: true }),
    supabase
      .from("consultation_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("consultation_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "contacted"),
    supabase
      .from("consultation_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved"),
    supabase.from("vehicle_queries").select("*", { count: "exact", head: true }),
    supabase.from("vehicle_queries").select("*", { count: "exact", head: true }).eq("status", "new"),
    adminClient.from("seo_pages").select("*", { count: "exact", head: true }),
    adminClient.from("seo_pages").select("*", { count: "exact", head: true }).eq("is_active", true),
    adminClient.from("geo_regions").select("*", { count: "exact", head: true }),
    adminClient.from("geo_regions").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    totalEVs: totalEVs ?? 0,
    uniqueBrands: new Set(brandRows?.map((row) => row.brand) ?? []).size,
    recentEVs: recentEVs ?? [],
    totalBlogPosts: totalBlogPosts ?? 0,
    publishedBlogPosts: publishedBlogPosts ?? 0,
    totalFeedback: totalFeedback ?? 0,
    approvedFeedback: approvedFeedback ?? 0,
    totalConsultations: totalConsultations ?? 0,
    pendingConsultations: pendingConsultations ?? 0,
    contactedConsultations: contactedConsultations ?? 0,
    resolvedConsultations: resolvedConsultations ?? 0,
    totalVehicleQueries: totalVehicleQueries ?? 0,
    newVehicleQueries: newVehicleQueries ?? 0,
    totalSeoPages: totalSeoPages ?? 0,
    activeSeoPages: activeSeoPages ?? 0,
    totalGeoRegions: totalGeoRegions ?? 0,
    activeGeoRegions: activeGeoRegions ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const {
    totalEVs,
    uniqueBrands,
    recentEVs,
    totalBlogPosts,
    publishedBlogPosts,
    totalFeedback,
    approvedFeedback,
    totalConsultations,
    pendingConsultations,
    contactedConsultations,
    resolvedConsultations,
    totalVehicleQueries,
    newVehicleQueries,
    totalSeoPages,
    activeSeoPages,
    totalGeoRegions,
    activeGeoRegions,
  } = await getStats();

  const draftBlogPosts = Math.max(totalBlogPosts - publishedBlogPosts, 0);
  const pendingFeedback = Math.max(totalFeedback - approvedFeedback, 0);
  const activeConsultations = pendingConsultations + contactedConsultations;
  const totalAttentionItems = pendingConsultations + newVehicleQueries + pendingFeedback;

  const moduleCards = [
    {
      title: "EV Models",
      total: totalEVs,
      detailA: `${uniqueBrands} brands`,
      detailB: `${recentEVs.length} recently listed`,
      href: "/admin/evs",
      actionLabel: "Manage EVs",
      tone: "border-blue-200 bg-blue-50 text-blue-800",
      btn: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      title: "Blog Posts",
      total: totalBlogPosts,
      detailA: `${publishedBlogPosts} published`,
      detailB: `${draftBlogPosts} drafts`,
      href: "/admin/blog",
      actionLabel: "Manage Blog",
      tone: "border-indigo-200 bg-indigo-50 text-indigo-800",
      btn: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    },
    {
      title: "Feedback",
      total: totalFeedback,
      detailA: `${approvedFeedback} approved`,
      detailB: `${pendingFeedback} pending`,
      href: "/admin/feedback",
      actionLabel: "Moderate",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
      btn: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    },
    {
      title: "Consultations",
      total: totalConsultations,
      detailA: `${resolvedConsultations} resolved`,
      detailB: `${activeConsultations} active`,
      href: "/admin/consultations",
      actionLabel: "Manage",
      tone: "border-amber-200 bg-amber-50 text-amber-800",
      btn: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    },
    {
      title: "Vehicle Queries",
      total: totalVehicleQueries,
      detailA: `${newVehicleQueries} new enquiries`,
      detailB: `${totalVehicleQueries - newVehicleQueries} actioned`,
      href: "/admin/vehicle-queries",
      actionLabel: "View Queries",
      tone: "border-violet-200 bg-violet-50 text-violet-800",
      btn: "bg-violet-100 text-violet-700 hover:bg-violet-200",
    },
    {
      title: "SEO Pages",
      total: totalSeoPages,
      detailA: `${activeSeoPages} active`,
      detailB: `${totalSeoPages - activeSeoPages} inactive`,
      href: "/admin/seo",
      actionLabel: "Manage SEO",
      tone: "border-rose-200 bg-rose-50 text-rose-800",
      btn: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    },
    {
      title: "GEO Regions",
      total: totalGeoRegions,
      detailA: `${activeGeoRegions} active`,
      detailB: `${totalGeoRegions - activeGeoRegions} inactive`,
      href: "/admin/geo",
      actionLabel: "Manage GEO",
      tone: "border-teal-200 bg-teal-50 text-teal-800",
      btn: "bg-teal-100 text-teal-700 hover:bg-teal-200",
    },
  ];

  const taskReport = [
    {
      task: "EV Models Management",
      done: totalEVs,
      pending: 0,
      note: "Total vehicle records available",
    },
    {
      task: "Blog Publishing",
      done: publishedBlogPosts,
      pending: draftBlogPosts,
      note: "Published vs draft posts",
    },
    {
      task: "Feedback Moderation",
      done: approvedFeedback,
      pending: pendingFeedback,
      note: "Approved vs waiting feedback",
    },
    {
      task: "Consultation Handling",
      done: resolvedConsultations,
      pending: activeConsultations,
      note: "Resolved vs pending/contacted",
    },
    {
      task: "Vehicle Query Leads",
      done: totalVehicleQueries - newVehicleQueries,
      pending: newVehicleQueries,
      note: "Actioned vs new from Find My EV",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">EV Guide</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Platform-wide overview and task status.</p>
        </div>
        {totalAttentionItems > 0 && (
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {totalAttentionItems} {totalAttentionItems === 1 ? "item needs" : "items need"} attention
            </span>
          </div>
        )}
      </div>

      {/* Module cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {moduleCards.map((card) => (
          <div key={card.title} className={`rounded-2xl border p-5 ${card.tone}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{card.title}</p>
            <p className="mt-2 text-4xl font-bold tabular-nums">{card.total}</p>
            <p className="mt-2 text-xs font-medium opacity-70">{card.detailA}</p>
            <p className="text-xs font-medium opacity-70">{card.detailB}</p>
            <Link
              href={card.href}
              className={`mt-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${card.btn}`}
            >
              {card.actionLabel}
            </Link>
          </div>
        ))}
      </div>

      {/* Task completion report */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Task Completion Report</h2>
          <p className="mt-0.5 text-sm text-gray-500">Done vs pending status for each admin area.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Task Area
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Done
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Pending
                </th>
                <th className="hidden px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:table-cell">
                  Progress
                </th>
                <th className="hidden px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 md:table-cell">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {taskReport.map((item) => {
                const total = item.done + item.pending;
                const pct = total > 0 ? Math.round((item.done / total) * 100) : 100;
                return (
                  <tr
                    key={item.task}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{item.task}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {item.done}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.pending > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {item.pending}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-gray-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-gray-400 md:table-cell">{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/audit"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <ShieldCheck className="h-4 w-4" />
            Run System Audit
          </Link>
          <Link
            href="/admin/evs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            Add New EV
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Create Blog Post
          </Link>
        </div>
      </div>

      {/* Recently Added EVs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recently Added EVs</h2>
          <Link href="/admin/evs" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>

        {recentEVs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <p className="text-gray-400">No EV models in the database yet.</p>
            <Link
              href="/admin/evs/new"
              className="mt-4 inline-block rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Add your first EV
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Model
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Price
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Range
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {recentEVs.map((ev) => (
                    <tr
                      key={ev.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{ev.brand}</td>
                      <td className="px-6 py-4 text-gray-600">{ev.model}</td>
                      <td className="px-6 py-4 text-gray-600">
                        £{ev.price?.toLocaleString() ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ev.range_km} km</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/evs/${ev.id}`}
                          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
