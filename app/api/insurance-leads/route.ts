import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "insurance-leads", 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const provider = typeof body.provider === "string" ? body.provider.trim() : "";
  const vehicleLabel = typeof body.vehicle_label === "string" ? body.vehicle_label.trim() : "";
  const vehicleId = typeof body.vehicle_id === "string" ? body.vehicle_id.trim() : null;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : (user?.email ?? "");

  if (!provider || !vehicleLabel) {
    return NextResponse.json({ error: "Provider and vehicle required." }, { status: 400 });
  }

  const admin = createAdminClient();

  await admin.from("consultation_requests").insert({
    user_id: user?.id ?? null,
    full_name: name || "Anonymous",
    email: email || "unknown@evguide.co.uk",
    sector: "insurance_lead",
    ev_model_id: vehicleId,
    ev_model_label: vehicleLabel,
    notes: `Provider: ${provider}\nVehicle: ${vehicleLabel}`,
    status: "pending",
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
