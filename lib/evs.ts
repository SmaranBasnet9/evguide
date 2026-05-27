import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { mapDbEV, type DbEV } from "@/lib/ev-models";
import { evModels } from "@/data/evModels";

async function fetchPublicEVRows(limit?: number) {
  const supabase = createPublicServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("ev_models")
    .select("*")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching EVs:", error.message);
    return [];
  }

  return (data ?? []).map((item) => mapDbEV(item as DbEV));
}

// Cache the full EV list for 2 minutes — data rarely changes.
// Revalidate via `revalidateTag("ev-models")` after admin updates.
const fetchAllEVsCached = unstable_cache(
  () => fetchPublicEVRows(),
  ["ev-models-all"],
  { revalidate: 3600, tags: ["ev-models"] },
);

export async function getAllEVs() {
  return fetchAllEVsCached();
}

const fetchTopSellingEVsCached = unstable_cache(
  () => fetchPublicEVRows(10),
  ["ev-models-top"],
  { revalidate: 3600, tags: ["ev-models"] },
);

export async function getTopSellingEVs() {
  return fetchTopSellingEVsCached();
}

async function fetchEVById(id: string) {
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
