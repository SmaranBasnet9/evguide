import { createAdminClient } from "@/lib/supabase/admin";

// Columns that DealerVehicleForm.tsx sends but that may not exist yet on
// `dealer_listings` until PENDING_MIGRATIONS.sql has been applied.
const OPTIONAL_COLUMNS = ["condition", "variant", "dc_charge_kw", "ac_charge_kw", "charge_to_80_mins", "vin"] as const;

let cached: Set<string> | null = null;

/**
 * Probes once (cached for the life of the server instance) which of
 * OPTIONAL_COLUMNS actually exist on `dealer_listings`. Lets reads/writes
 * degrade gracefully — dropping unsupported fields — instead of erroring
 * out the whole dealer portal with "column does not exist".
 */
async function existingOptionalColumns(): Promise<Set<string>> {
  if (cached) return cached;
  const admin = createAdminClient();
  const present = new Set<string>();
  await Promise.all(
    OPTIONAL_COLUMNS.map(async (col) => {
      try {
        const { error } = await admin.from("dealer_listings").select(col).limit(1);
        if (!error) present.add(col);
      } catch {
        // not present
      }
    }),
  );
  cached = present;
  return present;
}

export async function hasConditionColumn(): Promise<boolean> {
  const present = await existingOptionalColumns();
  return present.has("condition");
}

export async function hasVinColumn(): Promise<boolean> {
  const present = await existingOptionalColumns();
  return present.has("vin");
}

/** Strips any keys from `payload` that don't exist on `dealer_listings` yet. */
export async function stripUnsupportedColumns<T extends Record<string, unknown>>(payload: T): Promise<T> {
  const present = await existingOptionalColumns();
  const result = { ...payload };
  for (const col of OPTIONAL_COLUMNS) {
    if (!present.has(col) && col in result) {
      delete result[col];
    }
  }
  return result;
}
