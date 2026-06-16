import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { inspectListing, applyInspectionResult } from "@/lib/ai/listingInspector";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: listing, error } = await admin
    .from("dealer_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  let result;
  try {
    result = await inspectListing({ id, ...listing });
  } catch (err) {
    return NextResponse.json({ error: `AI inspection failed: ${String(err)}` }, { status: 500 });
  }

  await applyInspectionResult(admin, id, result);

  return NextResponse.json({ ok: true, decision: result.decision, summary: result.summary, notes: result.notes, issues: result.issues });
}
