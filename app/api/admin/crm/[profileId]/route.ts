import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";
import type { CrmLeadPriority, CrmLeadStatus } from "@/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_STATUSES: CrmLeadStatus[] = [
  "new",
  "qualified",
  "nurture",
  "hot",
  "contacted",
  "follow_up",
  "converted",
  "closed_lost",
];

const ALLOWED_PRIORITIES: CrmLeadPriority[] = ["low", "medium", "high", "urgent"];

export async function PATCH(
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

  const status = body.status;
  const priority = body.priority;
  const ownerName = typeof body.owner_name === "string" ? body.owner_name.trim() : null;
  const qualificationNotes =
    typeof body.qualification_notes === "string" ? body.qualification_notes.trim() : null;
  const nextFollowUpAt =
    typeof body.next_follow_up_at === "string" && body.next_follow_up_at.trim()
      ? body.next_follow_up_at
      : null;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status as CrmLeadStatus)) {
    return NextResponse.json({ error: "Invalid CRM status." }, { status: 400 });
  }
  if (typeof priority !== "string" || !ALLOWED_PRIORITIES.includes(priority as CrmLeadPriority)) {
    return NextResponse.json({ error: "Invalid CRM priority." }, { status: 400 });
  }

  const admin = createAdminClient();
  const payload = {
    profile_id: profileId,
    status,
    priority,
    owner_name: ownerName || null,
    tags,
    qualification_notes: qualificationNotes || null,
    next_follow_up_at: nextFollowUpAt,
    last_contacted_at:
      status === "contacted" || status === "follow_up" || status === "converted"
        ? new Date().toISOString()
        : null,
  };

  const { error } = await admin.from("crm_leads").upsert(payload, {
    onConflict: "profile_id",
  });

  if (error) {
    console.error("[crm] failed to upsert crm_leads:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
