import { evModels } from "@/data/evModels";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EVModel } from "@/types";

type DbEV = {
  id: string;
  brand: string;
  model: string;
  hero_image: string;
  price: number;
  motor_capacity_kw: number;
  torque_nm: number;
  ground_clearance_mm: number;
  tyre_size: string;
  battery_kwh: number;
  range_km: number;
  drive: string;
  charging_standard: string;
  fast_charge_time: string;
  adas: string;
  warranty: string;
  seats: number;
  boot_litres: number;
  top_speed_kph: number;
  acceleration: string;
  description: string;
  best_for: string;
  loved_reason: string;
};

function mapDbEV(item: DbEV): EVModel {
  return {
    id: item.id,
    brand: item.brand,
    model: item.model,
    heroImage: item.hero_image,
    price: item.price,
    motorCapacityKw: item.motor_capacity_kw,
    torqueNm: item.torque_nm,
    groundClearanceMm: item.ground_clearance_mm,
    tyreSize: item.tyre_size,
    batteryKWh: item.battery_kwh,
    rangeKm: item.range_km,
    drive: item.drive,
    chargingStandard: item.charging_standard,
    fastChargeTime: item.fast_charge_time,
    adas: item.adas,
    warranty: item.warranty,
    seats: item.seats,
    bootLitres: item.boot_litres,
    topSpeedKph: item.top_speed_kph,
    acceleration: item.acceleration,
    description: item.description,
    bestFor: item.best_for,
    lovedReason: item.loved_reason,
  };
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  let model = evModels.find((item) => item.id === id) ?? null;

  if (!model) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("ev_models")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (data) {
      model = mapDbEV(data as DbEV);
    }
  }

  if (!model) {
    return new Response("Vehicle not found", { status: 404 });
  }

  const manualText = [
    `Vehicle Manual`,
    `${model.brand} ${model.model}`,
    "",
    "1. Vehicle Overview",
    `${model.description}`,
    "",
    "2. Core Specifications",
    `Price: GBP ${model.price.toLocaleString()}`,
    `Range: ${model.rangeKm} km`,
    `Battery: ${model.batteryKWh} kWh`,
    `Motor Power: ${model.motorCapacityKw} kW`,
    `Torque: ${model.torqueNm} Nm`,
    `Top Speed: ${model.topSpeedKph} km/h`,
    `Acceleration (0-100 km/h): ${model.acceleration}`,
    `Drive Type: ${model.drive}`,
    `Charging Standard: ${model.chargingStandard}`,
    `Fast Charge Time: ${model.fastChargeTime}`,
    "",
    "3. Practical Information",
    `Seats: ${model.seats}`,
    `Boot Space: ${model.bootLitres} L`,
    `Ground Clearance: ${model.groundClearanceMm} mm`,
    `Tyre Size: ${model.tyreSize}`,
    `Warranty: ${model.warranty}`,
    "",
    "4. Safety & Assistance",
    `${model.adas}`,
    "",
    "5. Notes",
    "This is an EV Guide generated quick manual for review and comparison.",
    "Always verify final specifications with the official manufacturer brochure.",
    "",
    `Generated on: ${new Date().toISOString()}`,
  ].join("\n");

  const fileName = `${model.brand}-${model.model}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") + "-manual.txt";

  return new Response(manualText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
