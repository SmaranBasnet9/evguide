import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

const UUID_V4_OR_V1 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((id): id is string => typeof id === "string" && UUID_V4_OR_V1.test(id));
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const ids = parseIds(body?.ids);
  const isApproved = body?.is_approved;

  if (ids.length === 0) {
    return NextResponse.json({ error: "Provide at least one valid feedback id." }, { status: 400 });
  }

  if (typeof isApproved !== "boolean") {
    return NextResponse.json({ error: "is_approved must be boolean." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_ev_feedback")
    .update({
      is_approved: isApproved,
      approved_at: isApproved ? new Date().toISOString() : null,
    })
    .in("id", ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, count: ids.length, is_approved: isApproved });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const ids = parseIds(body?.ids);

  if (ids.length === 0) {
    return NextResponse.json({ error: "Provide at least one valid feedback id." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_ev_feedback")
    .delete()
    .in("id", ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, count: ids.length });
}
