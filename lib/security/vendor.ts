import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type VendorGuardResult =
  | { ok: true; userId: string; vendorId: string }
  | { ok: false; response: NextResponse };

/**
 * Protects vendor API routes.
 * Requires vendor_status="verified". Suspended vendors receive 403.
 */
export async function requireVerifiedVendor(): Promise<VendorGuardResult> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("vendor_status")
    .eq("id", user.id)
    .single();

  if (profile?.vendor_status === "suspended") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Your vendor account has been suspended. Contact support." },
        { status: 403 },
      ),
    };
  }

  if (profile?.vendor_status !== "verified") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Vendor account not verified." }, { status: 403 }),
    };
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    return { ok: false, response: NextResponse.json({ error: "Vendor profile not found." }, { status: 403 }) };
  }

  return { ok: true, userId: user.id, vendorId: vendor.id };
}

/**
 * Allows access for any vendor that has submitted a registration (pending, verified, or suspended).
 * Used for document upload routes during the onboarding flow.
 */
export async function requireAnyVendor(): Promise<VendorGuardResult> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    return { ok: false, response: NextResponse.json({ error: "No vendor registration found." }, { status: 403 }) };
  }

  if (vendor.status === "rejected") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Your vendor application was rejected." }, { status: 403 }),
    };
  }

  return { ok: true, userId: user.id, vendorId: vendor.id };
}
