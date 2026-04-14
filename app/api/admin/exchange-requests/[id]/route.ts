import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** GET /api/admin/exchange-requests/[id] — full detail + images + activity */
export async function GET(_req: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admin = createAdminClient();

  const [requestResult, imagesResult, activityResult] = await Promise.all([
    admin.from("exchange_requests").select("*").eq("id", id).single(),
    admin
      .from("exchange_request_images")
      .select("*")
      .eq("exchange_request_id", id)
      .order("created_at"),
    admin
      .from("exchange_request_activity")
      .select("*")
      .eq("exchange_request_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (requestResult.error || !requestResult.data) {
    return NextResponse.json({ error: "Exchange request not found." }, { status: 404 });
  }

  // Mark as read on first admin view
  if (!requestResult.data.is_read) {
    await admin
      .from("exchange_requests")
      .update({ is_read: true })
      .eq("id", id);
  }

  return NextResponse.json({
    data: requestResult.data,
    images: imagesResult.data ?? [],
    activity: activityResult.data ?? [],
  });
}

/** PUT /api/admin/exchange-requests/[id] — update status, notes, valuation, assignee */
export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient();

  // Fetch current record to detect status change
  const { data: current } = await admin
    .from("exchange_requests")
    .select("status")
    .eq("id", id)
    .single();

  const allowedFields = [
    "status", "priority", "assigned_to", "admin_notes",
    "final_offer_value", "is_read",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field];
  }

  const { data, error } = await admin
    .from("exchange_requests")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/exchange-requests/[id]] update error:", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  // Auto-log status changes
  if (body.status && current && body.status !== current.status) {
    await admin.from("exchange_request_activity").insert({
      exchange_request_id: id,
      action_type:         "status_change",
      old_status:          current.status,
      new_status:          body.status,
      note:                body._activity_note ?? null,
      created_by:          body._created_by ?? "admin",
    });
  }

  // Log note-only updates
  if (!body.status && body._note) {
    await admin.from("exchange_request_activity").insert({
      exchange_request_id: id,
      action_type:         "note_added",
      note:                body._note,
      created_by:          body._created_by ?? "admin",
    });
  }

  return NextResponse.json({ data });
}
