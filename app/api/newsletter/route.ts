import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "newsletter", 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error } = await admin.from("consultation_requests").insert({
    full_name: "Newsletter Subscriber",
    email,
    phone: null,
    sector: "vehicle",
    notes: "Footer newsletter signup",
    status: "pending",
  });

  if (error) {
    console.error("[newsletter] insert failed:", error.code, error.message);
    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
