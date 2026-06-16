import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-apply", 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email        = typeof body.email        === "string" ? body.email.trim().toLowerCase() : "";
  const password     = typeof body.password     === "string" ? body.password                   : "";
  const contactName  = typeof body.contactName  === "string" ? body.contactName.trim()         : "";
  const companyName  = typeof body.companyName  === "string" ? body.companyName.trim()         : "";
  const phone        = typeof body.phone        === "string" ? body.phone.trim()               : "";
  const addressLine1 = typeof body.addressLine1 === "string" ? body.addressLine1.trim()        : "";
  const addressLine2 = typeof body.addressLine2 === "string" ? body.addressLine2.trim() || null : null;
  const city         = typeof body.city         === "string" ? body.city.trim()                : "";
  const postcode     = typeof body.postcode     === "string" ? body.postcode.trim()            : "";
  const companyRegNo = typeof body.companyRegistrationNumber === "string"
    ? body.companyRegistrationNumber.trim() : "";
  const vatNumber   = typeof body.vatNumber   === "string" ? body.vatNumber.trim()   || null : null;
  const tradingName = typeof body.tradingName === "string" ? body.tradingName.trim() || null : null;
  const fcaFrn      = typeof body.fcaFrn      === "string" ? body.fcaFrn.trim()      || null : null;
  const website     = typeof body.website     === "string" ? body.website.trim()     || null : null;

  if (!email || !password || !contactName || !companyName || !phone || !addressLine1 || !city || !postcode) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!companyRegNo) {
    return NextResponse.json({ error: "Company registration number is required." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Create auth user (email pre-confirmed so they can log in immediately after approval)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: contactName },
  });

  if (authError) {
    const isDuplicate =
      authError.message.toLowerCase().includes("already registered") ||
      authError.message.toLowerCase().includes("already exists") ||
      authError.message.toLowerCase().includes("unique");
    return NextResponse.json(
      { error: isDuplicate
          ? "An account with this email already exists. Please log in instead."
          : authError.message },
      { status: 400 },
    );
  }

  const userId = authData.user.id;

  // Update profiles row (created by DB trigger) — retry a few times
  let profileDone = false;
  for (let i = 0; i < 4; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, i * 250));
    const { error } = await admin
      .from("profiles")
      .update({ dealer_status: "pending_approval" })
      .eq("id", userId);
    if (!error) { profileDone = true; break; }
  }
  if (!profileDone) {
    // Trigger may not have fired yet — upsert
    await admin.from("profiles").upsert({ id: userId, dealer_status: "pending_approval" });
  }

  // Create dealer_profiles record
  const baseProfile: Record<string, unknown> = {
    user_id:       userId,
    company_name:  companyName,
    contact_name:  contactName,
    email,
    phone,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    postcode,
    fca_frn:       fcaFrn,
    website,
    status:        "pending_approval",
  };

  // Try with extended columns; fall back if migration not applied yet
  let dealerError: { message: string } | null = null;
  const ext = await admin.from("dealer_profiles").insert({
    ...baseProfile,
    company_registration_number: companyRegNo,
    vat_number:   vatNumber,
    trading_name: tradingName,
  });
  if (ext.error) {
    if (ext.error.message.includes("column")) {
      const fallback = await admin.from("dealer_profiles").insert(baseProfile);
      dealerError = fallback.error;
    } else {
      dealerError = ext.error;
    }
  }

  if (dealerError) {
    await admin.auth.admin.deleteUser(userId);
    console.error("[dealer/apply] dealer_profiles insert:", dealerError.message);
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId }, { status: 201 });
}
