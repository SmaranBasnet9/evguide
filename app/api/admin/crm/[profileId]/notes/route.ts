import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  context: { params: Promise<{ profileId: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { profileId } = await context.params;
  if (!UUID_REGEX.test(profileId)) {
    return NextResponse.json({ error: "Invalid profile id." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const noteBody = typeof body.body === "string" ? body.body.trim() : "";
  if (noteBody.length < 2) {
    return NextResponse.json({ error: "Note is too short." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("crm_lead_notes").insert({
    profile_id: profileId,
    author_user_id: auth.userId,
    body: noteBody,
  });

  if (error) {
    console.error("[crm] failed to insert crm_lead_notes:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
