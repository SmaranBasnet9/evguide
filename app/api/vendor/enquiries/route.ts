import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireVerifiedVendor } from "@/lib/security/vendor";

export async function GET(request: Request) {
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const admin = createAdminClient();
  let query = admin
    .from("vendor_enquiries")
    .select(`id, full_name, email, phone, message, is_read, created_at, vendor_listings(id, make, model, year)`)
    .eq("vendor_id", guard.vendorId)
    .order("created_at", { ascending: false });

  if (unreadOnly) query = query.eq("is_read", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to load enquiries." }, { status: 500 });
  return NextResponse.json({ enquiries: data ?? [] });
}
