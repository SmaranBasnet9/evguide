import type { EVModel, VehicleTier } from "@/types";

export type DbEV = {
  id: string;
  brand: string;
  model: string;
  hero_image: string;
  tier?: VehicleTier | null;
  body_type?: string | null;
  badge?: string | null;
  popularity_score?: number | null;
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
  // EV-native columns (added in migration 008)
  range_miles?: number | null;
  real_world_range_miles?: number | null;
  charging_speed_ac_kw?: number | null;
  charging_speed_dc_kw?: number | null;
  charge_port_type?: string | null;
  charge_time_to80_mins?: number | null;
  battery_warranty_years?: number | null;
  v2g_capable?: boolean | null;
  annual_energy_cost_gbp?: number | null;
  co2_saving_kg_per_year?: number | null;
};

export function mapDbEV(item: DbEV): EVModel {
  const tier =
    item.tier === "affordable" || item.tier === "mid" || item.tier === "premium"
      ? item.tier
      : item.price <= 32000
        ? "affordable"
        : item.price <= 46000
          ? "mid"
          : "premium";

  return {
    id: item.id,
    brand: item.brand,
    model: item.model,
    heroImage: item.hero_image?.trim() ?? "",
    tier,
    bodyType: item.body_type ?? null,
    badge: item.badge ?? null,
    popularityScore: item.popularity_score ?? 0,
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
    // EV-native fields entered by admin
    rangeMiles: item.range_miles ?? undefined,
    realWorldRangeMiles: item.real_world_range_miles ?? undefined,
    chargingSpeedAcKw: item.charging_speed_ac_kw ?? undefined,
    chargingSpeedDcKw: item.charging_speed_dc_kw ?? undefined,
    chargePortType: item.charge_port_type ?? undefined,
    chargeTimeTo80Mins: item.charge_time_to80_mins ?? undefined,
    batteryWarrantyYears: item.battery_warranty_years ?? undefined,
    v2gCapable: item.v2g_capable ?? undefined,
    annualEnergyCostGbp: item.annual_energy_cost_gbp ?? undefined,
    co2SavingKgPerYear: item.co2_saving_kg_per_year ?? undefined,
  };
}
