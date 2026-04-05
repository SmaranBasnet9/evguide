import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();

  const { count: totalEVs } = await supabase
    .from("ev_models")
    .select("*", { count: "exact", head: true });

  const { data: brandRows } = await supabase
    .from("ev_models")
    .select("brand");

  const uniqueBrands = new Set(brandRows?.map((r) => r.brand) ?? []).size;

  const { data: recentEVs } = await supabase
    .from("ev_models")
    .select("id, brand, model, price, range_km")
    .order("created_at", { ascending: false })
    .limit(5);

  return { totalEVs: totalEVs ?? 0, uniqueBrands, recentEVs: recentEVs ?? [] };
}

export default async function AdminDashboardPage() {
  const { totalEVs, uniqueBrands, recentEVs } = await getStats();

  const stats = [
    { label: "Total EV Models", value: totalEVs },
    { label: "Brands", value: uniqueBrands },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of your EV Guide database.</p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
          </div>
        ))}

        {/* Quick actions as stat-style cards */}
        <Link
          href="/admin/evs/new"
          className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition hover:bg-blue-100"
        >
          <p className="text-sm font-medium text-blue-700">Quick Action</p>
          <p className="mt-2 text-lg font-bold text-blue-900">Add New EV</p>
        </Link>

        <Link
          href="/admin/evs"
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:bg-slate-50"
        >
          <p className="text-sm font-medium text-slate-500">Quick Action</p>
          <p className="mt-2 text-lg font-bold text-slate-900">Manage EVs</p>
        </Link>
      </div>

      {/* Recent EVs table */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recently Added</h2>
          <Link href="/admin/evs" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {recentEVs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-500">No EV models in the database yet.</p>
            <Link
              href="/admin/evs/new"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add your first EV
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Brand</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Model</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Price</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Range</th>
                  <th className="px-6 py-3 font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {recentEVs.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{ev.brand}</td>
                    <td className="px-6 py-4 text-slate-700">{ev.model}</td>
                    <td className="px-6 py-4 text-slate-700">£{ev.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-700">{ev.range_km} km</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/evs/${ev.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
