import type { EVModel } from "@/types";

export type NewDealerListing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  variant?: string | null;
  colour?: string | null;
  description?: string | null;
  images?: string[] | null;
  range_km?: number | null;
  battery_kwh?: number | null;
  drive?: string | null;
  body_type?: string | null;
  charging_standard?: string | null;
  seats?: number | null;
  dc_charge_kw?: number | null;
};

/** Maps a "new" dealer listing onto the EVModel shape so it can appear
 *  alongside the main catalogue on /vehicles and the homepage. */
export function mapDealerListingToEVModel(listing: NewDealerListing): EVModel {
  const tier: EVModel["tier"] =
    listing.price <= 32000 ? "affordable" : listing.price <= 46000 ? "mid" : "premium";

  return {
    id: `dealer-${listing.id}`,
    brand: listing.brand,
    model: listing.model,
    variant: listing.variant ?? undefined,
    heroImage: listing.images?.[0] ?? "",
    tier,
    bodyType: listing.body_type ?? null,
    price: listing.price,
    motorCapacityKw: 0,
    torqueNm: 0,
    groundClearanceMm: 0,
    tyreSize: "",
    batteryKWh: listing.battery_kwh ?? 0,
    rangeKm: listing.range_km ?? 0,
    drive: listing.drive ?? "",
    chargingStandard: listing.charging_standard ?? "",
    fastChargeTime: listing.dc_charge_kw ? `${listing.dc_charge_kw} kW DC` : "",
    adas: "",
    warranty: "",
    seats: listing.seats ?? 5,
    bootLitres: 0,
    topSpeedKph: 0,
    acceleration: "",
    description: listing.description ?? "",
    bestFor: "Dealer stock",
    lovedReason: "",
    badge: "Dealer",
  };
}
