import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, adminUserId: user.id };
}

export async function POST(request: Request) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = String(body.id ?? "");
  const emailToRaw = String(body.emailTo ?? "").trim();

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid consultation id." }, { status: 400 });
  }
  if (emailToRaw && !EMAIL_REGEX.test(emailToRaw)) {
    return NextResponse.json({ error: "Invalid recipient email." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: consultation, error: consultationError } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, sector, bank_name, ev_model_label, preferred_time, notes, status, created_at")
    .eq("id", id)
    .single();

  if (consultationError || !consultation) {
    return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
  }

  if (consultation.sector !== "bank" || !consultation.bank_name) {
    return NextResponse.json({ error: "Only bank consultations can be forwarded." }, { status: 400 });
  }

  if (!emailToRaw) {
    return NextResponse.json(
      { error: "Recipient email is required in testing mode." },
      { status: 400 }
    );
  }
  const toEmail = emailToRaw;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured." }, { status: 500 });
  }

  const resend = new Resend(resendKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "EV Guide <onboarding@resend.dev>";

  const preferredTimeText = consultation.preferred_time
    ? new Date(consultation.preferred_time).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Not provided";

  const submittedAtText = consultation.created_at
    ? new Date(consultation.created_at).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Unknown";

  const selectedVehicle = consultation.ev_model_label?.trim() || "Not specified by the user";

  const { error: emailError } = await resend.emails.send({
    from: fromAddress,
    to: toEmail,
    replyTo: consultation.email,
    subject: `EV Guide Inquiry - ${consultation.bank_name} Loan Consultation - ${consultation.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="margin-bottom: 12px;">Loan Consultation Inquiry</h2>
        <p>
          On behalf of <strong>EV Guide</strong>, we are forwarding a customer inquiry for
          <strong> ${consultation.bank_name}</strong> loan consultation.
        </p>
        <p>
          The user is trying to make an inquiry about the bank loan of the selected vehicle.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p><strong>Bank:</strong> ${consultation.bank_name}</p>
        <p><strong>Selected Vehicle:</strong> ${selectedVehicle}</p>
        <p><strong>Applicant Name:</strong> ${consultation.full_name}</p>
        <p><strong>Applicant Email:</strong> ${consultation.email}</p>
        <p><strong>Applicant Phone:</strong> ${consultation.phone ?? "Not provided"}</p>
        <p><strong>Preferred Meeting Time:</strong> ${preferredTimeText}</p>
        <p><strong>Notes:</strong> ${consultation.notes ?? "No additional notes"}</p>
        <p><strong>Submitted At:</strong> ${submittedAtText}</p>
        <p><strong>Reference ID:</strong> ${consultation.id}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="font-size: 12px; color: #64748b;">Forwarded by EV Guide Admin Panel.</p>
      </div>
    `,
  });

  if (emailError) {
    return NextResponse.json({ error: emailError.message }, { status: 502 });
  }

  const { error: updateError } = await admin
    .from("consultation_requests")
    .update({ status: "contacted" })
    .eq("id", consultation.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Consultation forwarded to loan department.",
    forwardedTo: toEmail,
  });
}
