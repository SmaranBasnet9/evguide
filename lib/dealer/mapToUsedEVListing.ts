import type { UsedEVListing } from "@/data/usedEvListings";

export type LiveDealerListing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  description?: string | null;
  images?: string[] | null;
  range_km?: number | null;
  battery_kwh?: number | null;
  dc_charge_kw?: number | null;
};

/** Maps a "used" dealer listing onto the UsedEVListing shape so it can
 *  appear alongside the curated used-EV catalogue, without a separate
 *  "dealer marketplace" section. */
export function mapDealerListingToUsedEV(listing: LiveDealerListing): UsedEVListing {
  return {
    id: listing.id,
    brand: listing.brand,
    model: listing.model,
    year: listing.year,
    colour: listing.colour ?? "—",
    price: listing.price,
    mileage: listing.mileage,
    batteryHealthPct: 95,
    batteryKWh: listing.battery_kwh ?? 0,
    realWorldRangeMiles: listing.range_km ? Math.round(listing.range_km * 0.621) : 0,
    chargingSpeedDcKw: listing.dc_charge_kw ?? 50,
    location: "UK",
    ulezCompliant: true,
    wallboxIncluded: false,
    serviceHistoryFull: true,
    previousOwners: 1,
    image: listing.images?.[0] ?? "",
    description: listing.description ?? "",
    sellerType: "dealer",
    sellerName: "Verified dealer",
    listedAt: new Date().toISOString(),
    status: "active",
  };
}
