import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-applications", 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name         = typeof body.name === "string" ? body.name.trim() : "";
  const email        = typeof body.email === "string" ? body.email.trim() : "";
  const dealership   = typeof body.dealership === "string" ? body.dealership.trim() : "";
  const phone        = typeof body.phone === "string" ? body.phone.trim() : "";
  const website      = typeof body.website === "string" ? body.website.trim() : "";
  const monthlyLeads = typeof body.monthly_leads === "number" ? body.monthly_leads : null;
  const plan         = typeof body.plan === "string" ? body.plan.trim() : "starter";
  const message      = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";

  if (name.length < 2) return NextResponse.json({ error: "Name required." }, { status: 400 });
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  if (!dealership) return NextResponse.json({ error: "Dealership name required." }, { status: 400 });

  const notes = [
    `Dealership: ${dealership}`,
    website ? `Website: ${website}` : null,
    monthlyLeads ? `Monthly leads: ${monthlyLeads}` : null,
    `Plan interest: ${plan}`,
    message ? `Message: ${message}` : null,
  ].filter(Boolean).join("\n");

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("consultation_requests")
    .insert({
      full_name: name,
      email,
      phone: phone || null,
      sector: "dealer_application",
      ev_model_label: `White-label: ${dealership}`,
      notes,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[dealer-applications] insert:", error.message);
    return NextResponse.json({ error: "Could not save application." }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  if (resendKey && adminEmail) {
    const resend = new Resend(resendKey);
    const from = process.env.RESEND_FROM_EMAIL ?? "EVGuide <onboarding@resend.dev>";
    void Promise.allSettled([
      resend.emails.send({
        from, to: email,
        subject: "EVGuide Partner Programme — application received",
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
          <div style="background:#0A0A0A;padding:24px 28px;border-radius:12px 12px 0 0">
            <p style="color:#1FBF9F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px">EVGuide · Dealer Partners</p>
            <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">Application received</h1>
          </div>
          <div style="background:#f8fafc;padding:24px 28px;border-radius:0 0 12px 12px">
            <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
            <p>Your application for <strong>${escapeHtml(dealership)}</strong> to join the EVGuide Partner Programme is under review. We'll be in touch within 2 business days to set up a demo.</p>
          </div>
        </div>`,
      }),
      resend.emails.send({
        from, to: adminEmail, replyTo: email,
        subject: `Dealer Partner Application — ${escapeHtml(dealership)} (${plan}) — ${escapeHtml(name)}`,
        html: `<h2>Dealer Partner Application</h2><p><strong>${escapeHtml(name)}</strong> from <strong>${escapeHtml(dealership)}</strong> (${escapeHtml(email)})</p><pre>${escapeHtml(notes)}</pre>`,
      }),
    ]);
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
