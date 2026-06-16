import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCSV(value: string | number | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const dealerId = searchParams.get("dealerId");

  const admin = createAdminClient();

  let query = admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, status, condition, location, battery_kwh, range_km, dealer_id, created_at")
    .order("dealer_id", { ascending: true })
    .order("created_at", { ascending: false });

  if (dealerId) query = query.eq("dealer_id", dealerId);

  const { data: listings, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const dealerIds = [...new Set((listings ?? []).map((l) => l.dealer_id))];
  const { data: dealers } = await admin
    .from("dealer_profiles")
    .select("id, company_name, email")
    .in("id", dealerIds.length > 0 ? dealerIds : [""]);

  const dealerMap = Object.fromEntries((dealers ?? []).map((d) => [d.id, d]));

  const headers = ["Dealer", "Dealer Email", "Listing ID", "Year", "Brand", "Model", "Condition", "Status", "Price (£)", "Mileage", "Location", "Battery (kWh)", "Range (km)", "Created"];
  const csvLines = [
    headers.join(","),
    ...(listings ?? []).map((l) => {
      const dealer = dealerMap[l.dealer_id];
      return [
        escapeCSV(dealer?.company_name ?? "Unknown dealer"),
        escapeCSV(dealer?.email),
        escapeCSV(l.id),
        escapeCSV(l.year),
        escapeCSV(l.brand),
        escapeCSV(l.model),
        escapeCSV(l.condition),
        escapeCSV(l.status),
        escapeCSV(l.price),
        escapeCSV(l.mileage),
        escapeCSV(l.location),
        escapeCSV(l.battery_kwh),
        escapeCSV(l.range_km),
        escapeCSV(new Date(l.created_at).toLocaleString("en-GB")),
      ].join(",");
    }),
  ];

  const dealerName = dealerId ? dealerMap[dealerId]?.company_name : null;
  const filename = dealerName
    ? `dealer-listings-${dealerName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`
    : "dealer-listings-all.csv";

  return new NextResponse(csvLines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
