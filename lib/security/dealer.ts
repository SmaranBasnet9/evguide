import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type DealerGuardResult =
  | { ok: true; userId: string; dealerProfileId: string }
  | { ok: false; response: NextResponse };

/**
 * Protects dealer API routes.
 * Requires role="dealer" and dealer_profiles.status="approved".
 * Suspended dealers are blocked with 403.
 */
export async function requireDealer(): Promise<DealerGuardResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, dealer_status")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "dealer") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (profile?.dealer_status === "suspended") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Your dealer account has been suspended. Please contact support." },
        { status: 403 },
      ),
    };
  }

  // Resolve the dealer_profiles row to get the dealer UUID
  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Dealer profile not found." }, { status: 403 }),
    };
  }

  return { ok: true, userId: user.id, dealerProfileId: dealerProfile.id };
}
