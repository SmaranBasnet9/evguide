import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit  = 20;
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("vendors")
    .select(`
      id, company_name, business_type, contact_person, email, phone,
      city, postcode, status, created_at, approved_at, is_deleted,
      vendor_documents(id, status)
    `, { count: "exact" })
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Failed to load vendors." }, { status: 500 });

  return NextResponse.json({ vendors: data ?? [], total: count ?? 0, page, limit });
}
