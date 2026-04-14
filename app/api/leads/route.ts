import { NextResponse } from "next/server";
import { parseLeadPayload } from "@/lib/leads";
import { notifySecurityEvent } from "@/lib/security/alerts";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "lead-capture", 10, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    await notifySecurityEvent({
      type: "rate-limit",
      message: "Lead capture submissions exceeded rate limit.",
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseLeadPayload(body);
  if (!parsed.data) {
    return NextResponse.json(
      {
        error: parsed.error ?? "Please review the form and try again.",
        fieldErrors: parsed.fieldErrors ?? {},
      },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("leads")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        vehicle_id: parsed.data.vehicle_id,
        interest_type: parsed.data.interest_type,
        budget: parsed.data.budget,
        message: parsed.data.message,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[leads] failed to insert lead:", error.message);
      return NextResponse.json(
        { error: "Unable to save your request right now. Please try again shortly." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error("[leads] unexpected error:", error);
    return NextResponse.json(
      { error: "Unable to save your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
