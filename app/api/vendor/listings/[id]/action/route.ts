import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireVerifiedVendor } from "@/lib/security/vendor";

type Params = { params: Promise<{ id: string }> };

// POST /api/vendor/listings/[id]/action  body: { action: "pause" | "renew" | "sold" }
export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  let body: { action?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const action = body.action;
  if (!["pause", "renew", "sold"].includes(action ?? "")) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("vendor_listings")
    .select("id, vendor_id, status")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (!listing || listing.vendor_id !== guard.vendorId) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const patch: Record<string, unknown> = {};
  if (action === "pause")  { patch.status = "paused"; patch.paused_at = new Date().toISOString(); }
  if (action === "renew")  { patch.status = "pending_review"; patch.paused_at = null; }
  if (action === "sold")   { patch.status = "sold";  patch.sold_at   = new Date().toISOString(); }

  await admin.from("vendor_listings").update(patch).eq("id", id);
  return NextResponse.json({ ok: true });
}
