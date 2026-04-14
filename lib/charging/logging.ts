// ─────────────────────────────────────────────────────────────────────────────
// Charging Analytics Logging
// Fire-and-forget helpers — errors are caught and logged but never thrown
// so they never interrupt the user-facing request.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "@/lib/supabase/admin";

export interface SearchLogPayload {
  user_id?: string | null;
  session_id?: string | null;
  searched_location: string;
  latitude?: number | null;
  longitude?: number | null;
  radius?: number | null;
  filters?: Record<string, unknown>;
  results_count: number;
}

export interface ClickLogPayload {
  user_id?: string | null;
  session_id?: string | null;
  charger_id: string;
  charger_name: string;
  network?: string | null;
  searched_location?: string | null;
}

export async function logChargerSearch(payload: SearchLogPayload): Promise<void> {
  try {
    let admin;
    try { admin = createAdminClient(); } catch { return; }
    const { error } = await admin.from("charger_search_logs").insert({
      user_id: payload.user_id ?? null,
      session_id: payload.session_id ?? null,
      searched_location: payload.searched_location,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      radius: payload.radius ?? null,
      filters: payload.filters ?? {},
      results_count: payload.results_count,
    });
    if (error) {
      console.error("[charging] failed to log search:", error.message);
    }
  } catch (err) {
    console.error("[charging] unexpected error logging search:", err);
  }
}

export async function logChargerClick(payload: ClickLogPayload): Promise<void> {
  try {
    let admin;
    try { admin = createAdminClient(); } catch { return; }
    const { error } = await admin.from("charger_click_logs").insert({
      user_id: payload.user_id ?? null,
      session_id: payload.session_id ?? null,
      charger_id: payload.charger_id,
      charger_name: payload.charger_name,
      network: payload.network ?? null,
      searched_location: payload.searched_location ?? null,
    });
    if (error) {
      console.error("[charging] failed to log click:", error.message);
    }
  } catch (err) {
    console.error("[charging] unexpected error logging click:", err);
  }
}
