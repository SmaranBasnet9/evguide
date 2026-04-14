import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** POST /api/admin/exchange-requests/[id]/activity — add a manual note / activity entry */
export async function POST(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();

  if (!body.note?.trim()) {
    return NextResponse.json({ error: "Note text is required." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("exchange_request_activity")
    .insert({
      exchange_request_id: id,
      action_type:         body.action_type ?? "note_added",
      old_status:          body.old_status ?? null,
      new_status:          body.new_status ?? null,
      note:                body.note.trim(),
      created_by:          body.created_by ?? "admin",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add note." }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
