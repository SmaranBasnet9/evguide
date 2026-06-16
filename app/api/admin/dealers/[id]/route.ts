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
  const userId = typeof body.userId === "string" ? body.userId : null;
  const reason = typeof body.reason === "string" ? body.reason.trim() : null;

  if (!["approve", "reject", "suspend"].includes(action as string)) {
    return NextResponse.json({ error: "action must be approve, reject, or suspend." }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const admin = createAdminClient();

  if (action === "approve") {
    const { data: dealerProfile, error: dealerFetchError } = await admin
      .from("dealer_profiles")
      .select("company_registration_number")
      .eq("id", id)
      .single();

    if (dealerFetchError || !dealerProfile) {
      return NextResponse.json({ error: "Dealer profile not found." }, { status: 404 });
    }

    if (!dealerProfile.company_registration_number) {
      return NextResponse.json(
        { error: "Company registration number is required before vendor approval." },
        { status: 400 },
      );
    }

    const { data: documents } = await admin
      .from("dealer_documents")
      .select("document_type")
      .eq("dealer_id", id);

    const submitted = new Set((documents ?? []).map((doc) => doc.document_type));
    const missing = ["company_registration", "proof_of_address", "motor_trade_insurance"]
      .filter((type) => !submitted.has(type));

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Required vendor verification documents are missing." },
        { status: 400 },
      );
    }

    // Update dealer_profiles
    const { error: profileError } = await admin
      .from("dealer_profiles")
      .update({
        status:      "approved",
        approved_at: new Date().toISOString(),
        approved_by: guard.userId,
      })
      .eq("id", id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Grant dealer role on profiles
    const { error: roleError } = await admin
      .from("profiles")
      .update({ role: "dealer", dealer_status: "approved" })
      .eq("id", userId);

    if (roleError) {
      console.error("[admin/dealers] role update failed:", roleError.message);
    }

    return NextResponse.json({ ok: true, action: "approved" });
  }

  // Reject
  if (action === "reject") {
    const { error: rejectError } = await admin
      .from("dealer_profiles")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", id);
    if (rejectError) return NextResponse.json({ error: rejectError.message }, { status: 500 });
    await admin.from("profiles").update({ role: "user", dealer_status: "rejected" }).eq("id", userId);
    return NextResponse.json({ ok: true, action: "rejected" });
  }

  // Suspend
  const { error: suspendError } = await admin
    .from("dealer_profiles")
    .update({ status: "suspended", rejection_reason: reason ?? null })
    .eq("id", id);
  if (suspendError) return NextResponse.json({ error: suspendError.message }, { status: 500 });
  await admin.from("profiles").update({ dealer_status: "suspended" }).eq("id", userId);
  return NextResponse.json({ ok: true, action: "suspended" });
}
