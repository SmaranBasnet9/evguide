import { NextResponse } from "next/server";
import { searchChargers } from "@/lib/charging/service";
import { logChargerSearch } from "@/lib/charging/logging";
import type { ChargingSearchParams } from "@/lib/charging/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // ── Parse query params ───────────────────────────────────────────────────
  const latRaw = searchParams.get("lat");
  const lngRaw = searchParams.get("lng");
  const location = searchParams.get("location")?.trim() ?? undefined;
  const radiusRaw = searchParams.get("radius");

  const lat = latRaw ? parseFloat(latRaw) : undefined;
  const lng = lngRaw ? parseFloat(lngRaw) : undefined;
  const radius = radiusRaw ? parseFloat(radiusRaw) : 10;

  // ── Validation ───────────────────────────────────────────────────────────
  if (!location && (lat === undefined || lng === undefined)) {
    return NextResponse.json(
      { error: "Provide either a location string or lat/lng coordinates." },
      { status: 400 }
    );
  }

  if (lat !== undefined && (isNaN(lat) || lat < -90 || lat > 90)) {
    return NextResponse.json({ error: "Invalid latitude value." }, { status: 400 });
  }
  if (lng !== undefined && (isNaN(lng) || lng < -180 || lng > 180)) {
    return NextResponse.json({ error: "Invalid longitude value." }, { status: 400 });
  }
  if (isNaN(radius) || radius < 1 || radius > 100) {
    return NextResponse.json({ error: "Radius must be between 1 and 100 miles." }, { status: 400 });
  }

  // ── Build service params ─────────────────────────────────────────────────
  const params: ChargingSearchParams = {
    lat,
    lng,
    location,
    radius,
    network: searchParams.get("network") ?? undefined,
    connector: searchParams.get("connector") ?? undefined,
    minPower: searchParams.get("minPower") ? parseFloat(searchParams.get("minPower")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
    availableNow: searchParams.get("availableNow") === "true",
    open24Hours: searchParams.get("open24Hours") === "true",
  };

  // ── Execute search ───────────────────────────────────────────────────────
  try {
    const result = await searchChargers(params);

    // Fire-and-forget analytics log
    void logChargerSearch({
      searched_location: result.location_used,
      latitude: result.search_coords?.lat ?? null,
      longitude: result.search_coords?.lng ?? null,
      radius,
      filters: {
        network: params.network,
        connector: params.connector,
        minPower: params.minPower,
        maxPrice: params.maxPrice,
        availableNow: params.availableNow,
        open24Hours: params.open24Hours,
      },
      results_count: result.total,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[api/chargers/nearby] search failed:", err);
    return NextResponse.json(
      { error: "Unable to fetch charging stations right now. Please try again." },
      { status: 500 }
    );
  }
}
