import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "pending_review";
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit  = 25;
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  const { data, error, count } = await admin
    .from("vendor_listings")
    .select(`
      id, make, model, variant, year, price, mileage, condition,
      status, images, created_at, published_at,
      vendors(id, company_name, email)
    `, { count: "exact" })
    .eq("status", status)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: "Failed to load listings." }, { status: 500 });
  return NextResponse.json({ listings: data ?? [], total: count ?? 0, page, limit });
}
