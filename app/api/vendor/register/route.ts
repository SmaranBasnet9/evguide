import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { sendVendorApplicationEmail } from "@/lib/email/vendor-emails";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "vendor-register", 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to register as a vendor." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const companyName   = typeof body.companyName   === "string" ? body.companyName.trim()   : "";
  const businessType  = typeof body.businessType  === "string" ? body.businessType.trim()  : "";
  const contactPerson = typeof body.contactPerson === "string" ? body.contactPerson.trim() : "";
  const email         = typeof body.email         === "string" ? body.email.trim()         : "";
  const phone         = typeof body.phone         === "string" ? body.phone.trim()         : "";
  const addressLine1  = typeof body.addressLine1  === "string" ? body.addressLine1.trim()  : "";
  const addressLine2  = typeof body.addressLine2  === "string" ? body.addressLine2.trim()  : null;
  const city          = typeof body.city          === "string" ? body.city.trim()          : "";
  const postcode      = typeof body.postcode      === "string" ? body.postcode.trim()      : "";
  const website       = typeof body.website       === "string" ? body.website.trim()       : null;
  const vatNumber     = typeof body.vatNumber     === "string" ? body.vatNumber.trim()     : null;
  const companyRegNumber = typeof body.companyRegistrationNumber === "string"
    ? body.companyRegistrationNumber.trim() : null;

  if (!companyName || !businessType || !contactPerson || !email || !phone || !addressLine1 || !city || !postcode) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  // Check for duplicate application
  const { data: existing } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const msg = existing.status === "pending"
      ? "Your vendor application is already under review."
      : existing.status === "verified"
      ? "Your vendor account is already verified."
      : "You already have a vendor application on file. Please contact support.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  // Insert vendor row
  const { data: vendor, error: insertError } = await supabase
    .from("vendors")
    .insert({
      user_id: user.id,
      company_name: companyName,
      business_type: businessType,
      contact_person: contactPerson,
      email,
      phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      postcode,
      website: website || null,
      vat_number: vatNumber || null,
      company_registration_number: companyRegNumber || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !vendor) {
    console.error("[vendor/register] insert error:", insertError?.message);
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 500 });
  }

  // Seed default permissions row
  await supabase.from("vendor_permissions").insert({
    vendor_id: vendor.id,
    can_publish_listings: false,
    max_active_listings: 10,
    can_use_analytics: true,
    can_receive_leads: true,
  });

  // Mark vendor_status on profiles
  await supabase.from("profiles").update({ vendor_status: "pending" }).eq("id", user.id);

  // Audit log
  await supabase.from("vendor_audit_logs").insert({
    vendor_id: vendor.id,
    actor_user_id: user.id,
    action: "created",
    details: { company_name: companyName, email },
  });

  // Notify admin via email
  try {
    const admin = createAdminClient();
    const { data: adminProfile } = await admin
      .from("profiles")
      .select("email")
      .in("role", ["admin", "super_admin"])
      .limit(1)
      .single();
    if (adminProfile?.email) {
      await sendVendorApplicationEmail(adminProfile.email, { companyName, contactPerson, email, vendorId: vendor.id });
    }
  } catch { /* non-fatal */ }

  return NextResponse.json({ ok: true, vendorId: vendor.id }, { status: 201 });
}
