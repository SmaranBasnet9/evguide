import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

const UUID_V4_OR_V1 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  const { userId: feedbackId } = await params;

  if (!feedbackId || !UUID_V4_OR_V1.test(feedbackId)) {
    return NextResponse.json({ error: "Invalid feedback id." }, { status: 400 });
  }

  const { is_approved } = await request.json();
  if (typeof is_approved !== "boolean") {
    return NextResponse.json({ error: "is_approved must be boolean." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("user_ev_feedback")
    .update({
      is_approved,
      approved_at: is_approved ? new Date().toISOString() : null,
    })
    .eq("id", feedbackId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, feedbackId, is_approved });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  const { userId: feedbackId } = await params;

  if (!feedbackId || !UUID_V4_OR_V1.test(feedbackId)) {
    return NextResponse.json({ error: "Invalid feedback id." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("user_ev_feedback")
    .delete()
    .eq("id", feedbackId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, feedbackId });
}
