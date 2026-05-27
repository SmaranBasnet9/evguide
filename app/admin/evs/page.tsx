import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminEVDeleteButton from "@/components/AdminEVDeleteButton";
import AdminSeedVehiclesButton from "@/components/AdminSeedVehiclesButton";

async function getAllEVs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ev_models")
    .select("id, brand, model, price, range_km, battery_kwh, drive")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function AdminEVsPage() {
  const evs = await getAllEVs();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">EV Models</h1>
          <p className="mt-1 text-white/50">{evs.length} model{evs.length !== 1 ? "s" : ""} in the database</p>
        </div>
        <div className="flex items-center gap-3">
          <AdminSeedVehiclesButton />
          <Link
            href="/admin/evs/new"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add New EV
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {evs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] py-20 text-center">
            <p className="text-white/50">No EV models yet.</p>
            <Link
              href="/admin/evs/new"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add your first EV
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left">
                  <th className="px-6 py-3 font-semibold text-white/60">Brand</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Model</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Price</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Range</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Battery</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Drive</th>
                  <th className="px-6 py-3 font-semibold text-white/60"></th>
                </tr>
              </thead>
              <tbody>
                {evs.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-4 font-medium text-white">{ev.brand}</td>
                    <td className="px-6 py-4 text-white/80">{ev.model}</td>
                    <td className="px-6 py-4 text-white/80">GBP {ev.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/80">{ev.range_km} km</td>
                    <td className="px-6 py-4 text-white/80">{ev.battery_kwh} kWh</td>
                    <td className="px-6 py-4 text-white/80">{ev.drive ?? "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/evs/${ev.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <AdminEVDeleteButton id={ev.id} />
                      </div>
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
