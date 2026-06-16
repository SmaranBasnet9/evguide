import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendListingApprovedEmail, sendListingRejectedEmail } from "@/lib/email/vendor-emails";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vendor_listings")
    .select(`*, vendors(id, company_name, email, city)`)
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ listing: data });
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const action         = typeof body.action         === "string" ? body.action        : "";
  const rejectionReason = typeof body.rejectionReason === "string" ? body.rejectionReason.trim() : "";
  const adminNotes     = typeof body.adminNotes     === "string" ? body.adminNotes.trim() : "";

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Action must be approve or reject." }, { status: 400 });
  }
  if (action === "reject" && !rejectionReason) {
    return NextResponse.json({ error: "Rejection reason is required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("vendor_listings")
    .select("id, make, model, year, vendor_id, vendors(email, company_name)")
    .eq("id", id)
    .single();

  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

  const patch: Record<string, unknown> = {
    reviewed_by: guard.userId,
    reviewed_at: new Date().toISOString(),
    admin_notes: adminNotes || null,
  };

  if (action === "approve") {
    patch.status       = "live";
    patch.published_at = new Date().toISOString();
    patch.rejection_reason = null;
  } else {
    patch.status           = "rejected";
    patch.rejection_reason = rejectionReason;
  }

  await admin.from("vendor_listings").update(patch).eq("id", id);

  // Audit log
  await admin.from("vendor_audit_logs").insert({
    vendor_id: listing.vendor_id,
    actor_user_id: guard.userId,
    action: action === "approve" ? "listing_approved" : "listing_rejected",
    details: { listing_id: id, reason: rejectionReason || null },
  });

  // Email vendor
  const vendorData = Array.isArray(listing.vendors)
    ? (listing.vendors as { email: string; company_name: string }[])[0] ?? null
    : listing.vendors as { email: string; company_name: string } | null;
  if (vendorData?.email) {
    try {
      if (action === "approve") {
        await sendListingApprovedEmail(vendorData.email, { make: listing.make, model: listing.model, year: listing.year, id });
      } else {
        await sendListingRejectedEmail(vendorData.email, { make: listing.make, model: listing.model, year: listing.year }, rejectionReason);
      }
    } catch { /* non-fatal */ }
  }

  return NextResponse.json({ ok: true });
}
