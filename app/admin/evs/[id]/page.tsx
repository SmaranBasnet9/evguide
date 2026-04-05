import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminEVForm from "@/components/AdminEVForm";

async function getEV(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ev_models")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditEVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ev = await getEV(id);

  if (!ev) notFound();

  const initialData = {
    brand: ev.brand ?? "",
    model: ev.model ?? "",
    hero_image: ev.hero_image ?? "",
    price: ev.price != null ? String(ev.price) : "",
    motor_capacity_kw: ev.motor_capacity_kw != null ? String(ev.motor_capacity_kw) : "",
    torque_nm: ev.torque_nm != null ? String(ev.torque_nm) : "",
    ground_clearance_mm: ev.ground_clearance_mm != null ? String(ev.ground_clearance_mm) : "",
    tyre_size: ev.tyre_size ?? "",
    battery_kwh: ev.battery_kwh != null ? String(ev.battery_kwh) : "",
    range_km: ev.range_km != null ? String(ev.range_km) : "",
    drive: ev.drive ?? "",
    charging_standard: ev.charging_standard ?? "",
    fast_charge_time: ev.fast_charge_time ?? "",
    adas: ev.adas ?? "",
    warranty: ev.warranty ?? "",
    seats: ev.seats != null ? String(ev.seats) : "",
    boot_litres: ev.boot_litres != null ? String(ev.boot_litres) : "",
    top_speed_kph: ev.top_speed_kph != null ? String(ev.top_speed_kph) : "",
    acceleration: ev.acceleration ?? "",
    description: ev.description ?? "",
    best_for: ev.best_for ?? "",
    loved_reason: ev.loved_reason ?? "",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin/evs" className="hover:text-blue-600 hover:underline">
          EV Models
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{ev.brand} {ev.model}</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-slate-900">
        Edit {ev.brand} {ev.model}
      </h1>
      <p className="mt-1 text-slate-500">Changes are saved directly to the database.</p>

      <div className="mt-8">
        <AdminEVForm mode="edit" id={id} initialData={initialData} />
      </div>
    </div>
  );
}
