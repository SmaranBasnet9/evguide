import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

// GET — list all dealers (used by admin dashboard)
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dealer_profiles")
    .select("id, company_name, contact_name, email, phone, city, status, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dealers: data });
}

// POST — admin creates a new dealer account
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const companyName  = typeof body.companyName  === "string" ? body.companyName.trim()  : "";
  const contactName  = typeof body.contactName  === "string" ? body.contactName.trim()  : "";
  const email        = typeof body.email        === "string" ? body.email.trim().toLowerCase() : "";
  const phone        = typeof body.phone        === "string" ? body.phone.trim()        : "";
  const addressLine1 = typeof body.addressLine1 === "string" ? body.addressLine1.trim() : "";
  const addressLine2 = typeof body.addressLine2 === "string" ? body.addressLine2.trim() : null;
  const city         = typeof body.city         === "string" ? body.city.trim()         : "";
  const postcode     = typeof body.postcode     === "string" ? body.postcode.trim()     : "";
  const fcaFrn       = typeof body.fcaFrn       === "string" ? body.fcaFrn.trim()       : null;
  const website      = typeof body.website      === "string" ? body.website.trim()      : null;
  const password     = typeof body.password     === "string" ? body.password            : "";

  if (!companyName || !contactName || !email || !phone || !addressLine1 || !city || !postcode) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const admin = createAdminClient();

  // 1. Create the Supabase auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // pre-confirm so dealer can log in immediately
    user_metadata: { full_name: contactName },
  });

  if (authError) {
    const msg = authError.message.includes("already registered")
      ? "A user with this email already exists."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2. Set role=dealer and dealer_status=approved on profiles
  // (profiles row is created by a Supabase trigger on auth.users insert)
  // Retry a couple of times in case the trigger hasn't fired yet
  let profileUpdated = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    await new Promise((r) => setTimeout(r, attempt * 300));
    const { error: profileError } = await admin
      .from("profiles")
      .update({ role: "dealer", dealer_status: "approved" })
      .eq("id", userId);
    if (!profileError) { profileUpdated = true; break; }
  }

  if (!profileUpdated) {
    // Profile trigger may not have fired — insert if missing
    await admin.from("profiles").upsert({
      id: userId,
      role: "dealer",
      dealer_status: "approved",
    });
  }

  // 3. Create dealer_profiles entry (pre-approved since admin created it)
  const { error: dealerError } = await admin.from("dealer_profiles").insert({
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
    status:        "approved",
    approved_at:   new Date().toISOString(),
    approved_by:   guard.userId,
  });

  if (dealerError) {
    // Roll back auth user if dealer profile creation fails
    await admin.auth.admin.deleteUser(userId);
    console.error("[admin/dealers POST] dealer_profiles insert:", dealerError.message);
    return NextResponse.json({ error: "Failed to create dealer profile. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId }, { status: 201 });
}
