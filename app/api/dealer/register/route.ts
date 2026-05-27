import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-register", 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to register as a dealer." },
      { status: 401 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const companyName  = typeof body.companyName  === "string" ? body.companyName.trim()  : "";
  const contactName  = typeof body.contactName  === "string" ? body.contactName.trim()  : "";
  const email        = typeof body.email        === "string" ? body.email.trim()        : "";
  const phone        = typeof body.phone        === "string" ? body.phone.trim()        : "";
  const addressLine1 = typeof body.addressLine1 === "string" ? body.addressLine1.trim() : "";
  const addressLine2 = typeof body.addressLine2 === "string" ? body.addressLine2.trim() : null;
  const city         = typeof body.city         === "string" ? body.city.trim()         : "";
  const postcode     = typeof body.postcode     === "string" ? body.postcode.trim()     : "";
  const fcaFrn       = typeof body.fcaFrn       === "string" ? body.fcaFrn.trim()       : null;
  const website      = typeof body.website      === "string" ? body.website.trim()      : null;

  if (!companyName || !contactName || !email || !phone || !addressLine1 || !city || !postcode) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  // Check they haven't already applied
  const { data: existing } = await supabase
    .from("dealer_profiles")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const msg =
      existing.status === "pending_approval"
        ? "Your dealer application is already under review."
        : existing.status === "approved"
        ? "Your dealer account is already approved."
        : "You already have a dealer application on file. Please contact support.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const { error: insertError } = await supabase.from("dealer_profiles").insert({
    user_id: user.id,
    company_name: companyName,
    contact_name: contactName,
    email,
    phone,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    postcode,
    fca_frn: fcaFrn,
    website,
    status: "pending_approval",
  });

  if (insertError) {
    console.error("[dealer/register] insert error:", insertError.message);
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 500 });
  }

  // Mark dealer_status on profiles (does NOT grant role="dealer" yet — admin does that on approval)
  await supabase
    .from("profiles")
    .update({ dealer_status: "pending_approval" })
    .eq("id", user.id);

  return NextResponse.json({ ok: true }, { status: 201 });
}
