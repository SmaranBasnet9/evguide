import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorInfoRequestEmail,
} from "@/lib/email/vendor-emails";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("vendors")
    .select(`
      *,
      vendor_documents(*),
      vendor_permissions(*),
      vendor_listings(id, make, model, year, status, price, created_at),
      vendor_audit_logs(id, action, details, created_at, actor_user_id)
    `)
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
  return NextResponse.json({ vendor: data });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const action = typeof body.action === "string" ? body.action : "";
  const validActions = ["approve", "reject", "suspend", "restore", "request_info"];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: vendor } = await admin
    .from("vendors")
    .select("id, status, email, company_name, user_id")
    .eq("id", id)
    .single();

  if (!vendor) return NextResponse.json({ error: "Vendor not found." }, { status: 404 });

  const previousStatus = vendor.status;
  const reason  = typeof body.reason  === "string" ? body.reason.trim()  : "";
  const notes   = typeof body.notes   === "string" ? body.notes.trim()   : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const statusMap: Record<string, string> = {
    approve:      "verified",
    reject:       "rejected",
    suspend:      "suspended",
    restore:      "pending",
  };

  if (action === "request_info") {
    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    await sendVendorInfoRequestEmail(vendor.email, vendor.company_name, message);
    await admin.from("vendor_audit_logs").insert({
      vendor_id: id, actor_user_id: guard.userId,
      action: "info_requested", details: { message },
    });
    await admin.from("vendor_verification_requests").insert({
      vendor_id: id, admin_user_id: guard.userId,
      requested_status: previousStatus, previous_status: previousStatus, notes: message,
    });
    return NextResponse.json({ ok: true });
  }

  const newStatus = statusMap[action];

  if (action === "reject" && !reason) {
    return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
  }

  // Update vendor status
  const patch: Record<string, unknown> = { status: newStatus };
  if (action === "approve") { patch.approved_at = new Date().toISOString(); patch.approved_by = guard.userId; }
  if (action === "reject")  { patch.rejection_reason = reason; patch.rejection_notes = notes || null; }
  await admin.from("vendors").update(patch).eq("id", id);

  // Sync profiles.vendor_status
  const profileStatusMap: Record<string, string> = {
    verified: "verified", rejected: "rejected", suspended: "suspended", pending: "pending",
  };
  await admin.from("profiles").update({ vendor_status: profileStatusMap[newStatus] ?? null }).eq("id", vendor.user_id);

  // Grant/revoke can_publish_listings
  if (action === "approve") {
    await admin.from("vendor_permissions").update({ can_publish_listings: true }).eq("vendor_id", id);
  }
  if (action === "reject" || action === "suspend") {
    await admin.from("vendor_permissions").update({ can_publish_listings: false }).eq("vendor_id", id);
  }

  // Audit + verification trail
  await admin.from("vendor_audit_logs").insert({
    vendor_id: id, actor_user_id: guard.userId,
    action, details: { previous_status: previousStatus, new_status: newStatus, reason, notes },
  });
  await admin.from("vendor_verification_requests").insert({
    vendor_id: id, admin_user_id: guard.userId,
    requested_status: newStatus, previous_status: previousStatus, notes: reason || notes || null,
  });

  // Send email notification to vendor
  try {
    if (action === "approve") await sendVendorApprovedEmail(vendor.email, vendor.company_name);
    if (action === "reject")  await sendVendorRejectedEmail(vendor.email, vendor.company_name, reason, notes);
  } catch { /* non-fatal */ }

  return NextResponse.json({ ok: true, newStatus });
}
