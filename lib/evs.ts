import { createClient } from "@/lib/supabase/server";

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

function mapDbEV(item: DbEV) {
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

export async function getAllEVs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ev_models")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all EVs:", error);
    return [];
  }

  return (data ?? []).map((item) => mapDbEV(item as DbEV));
}

export async function getTopSellingEVs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ev_models")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching EVs:", error);
    return [];
  }

  return data.map((item) => mapDbEV(item as DbEV));
}