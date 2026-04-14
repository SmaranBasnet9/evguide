import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

/** GET /api/admin/exchange-requests — list all exchange requests */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status    = searchParams.get("status");
  const fuelType  = searchParams.get("fuel_type");
  const city      = searchParams.get("city");
  const targetEv  = searchParams.get("target_ev_id");
  const dateFrom  = searchParams.get("date_from");
  const dateTo    = searchParams.get("date_to");

  const admin = createAdminClient();

  let query = admin
    .from("exchange_requests")
    .select(`
      id, created_at, updated_at,
      customer_name, phone, email, city,
      current_vehicle_brand, current_vehicle_model, current_vehicle_year,
      fuel_type, mileage, condition,
      target_ev_brand, target_ev_model, target_ev_price,
      estimated_value, valuation_confidence,
      final_offer_value,
      status, priority, assigned_to, source_page,
      is_read
    `)
    .order("created_at", { ascending: false });

  if (status)   query = query.eq("status", status);
  if (fuelType) query = query.eq("fuel_type", fuelType);
  if (city)     query = query.ilike("city", `%${city}%`);
  if (targetEv) query = query.eq("target_ev_id", targetEv);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo)   query = query.lte("created_at", dateTo);

  const { data, error } = await query;

  if (error) {
    console.error("[admin/exchange-requests] list error:", error);
    return NextResponse.json({ error: "Failed to fetch exchange requests." }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
