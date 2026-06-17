import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { evModels } from "@/data/evModels";
import { mapDealerListingToEVModel } from "@/lib/dealer/mapToEVModel";
import { createAdminClient } from "@/lib/supabase/admin";

async function fetchPublicEVRows(limit?: number) {
  const supabase = createPublicServerClient();

  if (!supabase) {
    return limit ? evModels.slice(0, limit) : evModels;
  }

  let query = supabase
    .from("ev_models")
    .select("*")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    console.error("Error fetching EVs, falling back to static data:", error?.message ?? "empty");
    return limit ? evModels.slice(0, limit) : evModels;
  }

  // Merge: DB rows first, then fill remaining slots from static data for any brands not in DB
  const dbRows = data.map((item) => mapDbEV(item as DbEV));
  const dbIds = new Set(dbRows.map((m) => m.id));
  const staticFill = evModels.filter((m) => !dbIds.has(m.id));
  const merged = [...dbRows, ...staticFill];
  return limit ? merged.slice(0, limit) : merged;
}

// New dealer stock (condition="new", status="live") is folded into the main
// vehicle catalogue so it appears alongside ev_models on /vehicles and the
// homepage — dealers don't get a separately-branded "marketplace" section.
async function fetchNewDealerListings() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("dealer_listings")
      .select("id, brand, model, year, price, variant, colour, description, images, range_km, battery_kwh, drive, body_type, charging_standard, seats, dc_charge_kw")
      .eq("status", "live")
      .eq("condition", "new")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data ?? []).map(mapDealerListingToEVModel);
  } catch {
    return [];
  }
}

// Cache the full EV list for 2 minutes — data rarely changes.
// Revalidate via `revalidateTag("ev-models")` after admin updates.
const fetchAllEVsCached = unstable_cache(
  () => fetchPublicEVRows(),
  ["ev-models-all"],
  { revalidate: 3600, tags: ["ev-models"] },
);

export async function getAllEVs() {
  const [evs, dealerNew] = await Promise.all([fetchAllEVsCached(), fetchNewDealerListings()]);
  return [...dealerNew, ...evs];
}

const fetchTopSellingEVsCached = unstable_cache(
  () => fetchPublicEVRows(10),
  ["ev-models-top"],
  { revalidate: 3600, tags: ["ev-models"] },
);

export async function getTopSellingEVs() {
  const [evs, dealerNew] = await Promise.all([fetchTopSellingEVsCached(), fetchNewDealerListings()]);
  return [...dealerNew, ...evs].slice(0, 10);
}

async function fetchEVById(id: string) {
  if (id.startsWith("dealer-")) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("dealer_listings")
        .select("id, brand, model, year, price, variant, colour, description, images, range_km, battery_kwh, drive, body_type, charging_standard, seats, dc_charge_kw")
        .eq("id", id.slice("dealer-".length))
        .eq("status", "live")
        .eq("condition", "new")
        .single();
      return data ? mapDealerListingToEVModel(data) : null;
    } catch {
      return null;
    }
  }

  const supabase = createPublicServerClient();
  if (!supabase) return evModels.find((m) => m.id === id) ?? null;

  const { data, error } = await supabase
    .from("ev_models")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    // Fallback to static data
    return evModels.find((m) => m.id === id) ?? null;
  }
  return mapDbEV(data as DbEV);
}

export async function getEVById(id: string) {
  return fetchEVById(id);
}
