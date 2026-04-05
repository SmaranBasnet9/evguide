import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_V4_OR_V1 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function ensureAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const };
}

function parseIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((id): id is string => typeof id === "string" && UUID_V4_OR_V1.test(id));
}

export async function PATCH(request: Request) {
  const auth = await ensureAdmin();
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
  const auth = await ensureAdmin();
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
