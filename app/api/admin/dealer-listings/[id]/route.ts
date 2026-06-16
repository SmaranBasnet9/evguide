import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = body.action;
  const reason = typeof body.reason === "string" ? body.reason.trim() : null;

  const admin = createAdminClient();

  if (action === "unapprove") {
    const { error } = await admin
      .from("dealer_listings")
      .update({
        status:      "pending",
        reviewed_by: guard.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, action });
  }

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve', 'reject', or 'unapprove'." }, { status: 400 });
  }

  const { error } = await admin
    .from("dealer_listings")
    .update({
      status:           action === "approve" ? "live" : "rejected",
      rejection_reason: action === "reject" ? reason : null,
      reviewed_by:      guard.userId,
      reviewed_at:      new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, action });
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin.from("dealer_listings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
