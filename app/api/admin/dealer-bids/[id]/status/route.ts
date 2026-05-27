import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_STATUSES = ["pending", "contacted", "resolved"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = body.status as string | undefined;
  if (!status || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("consultation_requests")
    .update({ status })
    .eq("id", id)
    .eq("sector", "dealer_bid");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
