export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasConditionColumn, hasVinColumn } from "@/lib/dealer/conditionColumn";
import { Plus } from "lucide-react";
import DealerVehicleActions from "@/components/DealerVehicleActions";

const STATUS_STYLES: Record<string, string> = {
  draft:    "border-white/10 bg-white/[0.06] text-white/50",
  pending:  "border-amber-500/20 bg-amber-500/10 text-amber-300",
  live:     "border-brand/20 bg-brand/10 text-brand",
  rejected: "border-red-500/20 bg-red-500/10 text-red-400",
};

export default async function DealerVehiclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dealer/vehicles");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/dealer");

  const conditionCol = await hasConditionColumn();
  const vinCol = await hasVinColumn();
  const { data: listings } = await supabase
    .from("dealer_listings")
    .select(`id, brand, model, year, price, mileage, status,${conditionCol ? " condition," : ""}${vinCol ? " vin," : ""} created_at, rejection_reason`)
    .eq("dealer_id", dealerProfile.id)
    .order("created_at", { ascending: false });

  const rows = (listings ?? []) as unknown as Array<{
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    status: string;
    condition?: "new" | "used" | null;
    vin?: string | null;
    created_at: string;
    rejection_reason: string | null;
  }>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Vehicles</h1>
          <p className="mt-1 text-white/50">{rows.length} listing{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dealer/vehicles/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Link>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
            <p className="text-white/50">No listings yet.</p>
            <Link
              href="/dealer/vehicles/new"
              className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Add your first vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="px-6 py-3 font-semibold text-white/50">Vehicle</th>
                  <th className="px-6 py-3 font-semibold text-white/50">VIN</th>
                  <th className="px-6 py-3 font-semibold text-white/50">Price</th>
                  <th className="px-6 py-3 font-semibold text-white/50">Mileage</th>
                  <th className="px-6 py-3 font-semibold text-white/50">Status</th>
                  <th className="px-6 py-3 font-semibold text-white/50">Added</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white">
                      {row.year} {row.brand} {row.model}
                      <span className="ml-2 inline-block rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                        {row.condition === "new" ? "New" : "Used"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-white/40">{row.vin || "—"}</td>
                    <td className="px-6 py-4 text-white/70">£{Number(row.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/70">{Number(row.mileage).toLocaleString()} mi</td>
                    <td className="px-6 py-4">
                      <div>
                        <span
                          className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[row.status] ?? STATUS_STYLES.draft}`}
                        >
                          {row.status}
                        </span>
                        {row.status === "rejected" && row.rejection_reason ? (
                          <p className="mt-1 text-xs text-red-400/70">{row.rejection_reason}</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/40">
                      {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <DealerVehicleActions id={row.id} status={row.status} condition={row.condition} />
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
