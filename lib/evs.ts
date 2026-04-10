import { createPublicServerClient } from "@/lib/supabase/public-server";
import { mapDbEV, type DbEV } from "@/lib/ev-models";

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

export async function getAllEVs() {
  return fetchPublicEVRows();
}

export async function getTopSellingEVs() {
  return fetchPublicEVRows(10);
}
