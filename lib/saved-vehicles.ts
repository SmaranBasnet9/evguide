/**
 * Saved Vehicles Library
 *
 * Handles user shortlists — save, unsave, and retrieve saved EVs.
 * Works for both authenticated users (by user_id) and anonymous
 * sessions (by session_id cookie).
 */

import { createClient } from "@/lib/supabase/server";
import type { SavedVehicle } from "@/types";

type SavedVehicleRow = {
  id: string;
  vehicle_id: string;
  vehicle_label: string;
  vehicle_price: number | null;
  saved_at: string;
};

function mapRow(row: SavedVehicleRow): SavedVehicle {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    vehicleLabel: row.vehicle_label,
    vehiclePrice: row.vehicle_price,
    savedAt: row.saved_at,
  };
}

/**
 * Get all saved vehicles for a user or session.
 */
export async function getSavedVehicles(
  userId: string | null,
  sessionId: string | null,
): Promise<SavedVehicle[]> {
  if (!userId && !sessionId) return [];

  const supabase = await createClient();
  let query = supabase
    .from("saved_vehicles")
    .select("id, vehicle_id, vehicle_label, vehicle_price, saved_at")
    .order("saved_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("session_id", sessionId!);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as SavedVehicleRow[]).map(mapRow);
}

/**
 * Check if a specific vehicle is saved.
 */
export async function isVehicleSaved(
  vehicleId: string,
  userId: string | null,
  sessionId: string | null,
): Promise<boolean> {
  if (!userId && !sessionId) return false;

  const supabase = await createClient();
  let query = supabase
    .from("saved_vehicles")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .limit(1);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("session_id", sessionId!);
  }

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}

/**
 * Save a vehicle to the user's shortlist.
 * Returns the saved record or null on failure.
 */
export async function saveVehicle(
  vehicleId: string,
  vehicleLabel: string,
  vehiclePrice: number | null,
  userId: string | null,
  sessionId: string | null,
): Promise<SavedVehicle | null> {
  if (!userId && !sessionId) return null;

  const supabase = await createClient();

  const insertRow: Record<string, unknown> = {
    vehicle_id: vehicleId,
    vehicle_label: vehicleLabel,
    vehicle_price: vehiclePrice,
  };
  if (userId) insertRow.user_id = userId;
  else insertRow.session_id = sessionId;

  const { data, error } = await supabase
    .from("saved_vehicles")
    .upsert(insertRow, { onConflict: userId ? "user_id,vehicle_id" : "session_id,vehicle_id" })
    .select("id, vehicle_id, vehicle_label, vehicle_price, saved_at")
    .single();

  if (error || !data) return null;
  return mapRow(data as SavedVehicleRow);
}

/**
 * Remove a vehicle from the user's shortlist.
 */
export async function unsaveVehicle(
  vehicleId: string,
  userId: string | null,
  sessionId: string | null,
): Promise<boolean> {
  if (!userId && !sessionId) return false;

  const supabase = await createClient();
  let query = supabase
    .from("saved_vehicles")
    .delete()
    .eq("vehicle_id", vehicleId);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("session_id", sessionId!);
  }

  const { error } = await query;
  return !error;
}
