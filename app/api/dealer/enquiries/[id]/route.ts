import { NextResponse } from "next/server";
import { requireDealer } from "@/lib/security/dealer";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing enquiry id." }, { status: 400 });

  const supabase = await createClient();

  // Verify the enquiry belongs to this dealer before updating
  const { data: existing } = await supabase
    .from("dealer_enquiries")
    .select("id")
    .eq("id", id)
    .eq("dealer_id", guard.dealerProfileId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  const { error } = await supabase
    .from("dealer_enquiries")
    .update({ is_read: true })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
