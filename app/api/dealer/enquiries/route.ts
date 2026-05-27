import { NextResponse } from "next/server";
import { requireDealer } from "@/lib/security/dealer";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dealer_enquiries")
    .select("id, full_name, email, phone, message, is_read, created_at, listing_id")
    .eq("dealer_id", guard.dealerProfileId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ enquiries: data });
}
