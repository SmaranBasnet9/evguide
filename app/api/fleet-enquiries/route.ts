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
  const rateLimit = applyRateLimit(request, "fleet-enquiries", 3, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
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

  const name         = typeof body.name === "string" ? body.name.trim() : "";
  const email        = typeof body.email === "string" ? body.email.trim() : "";
  const company      = typeof body.company === "string" ? body.company.trim() : "";
  const phone        = typeof body.phone === "string" ? body.phone.trim() : "";
  const fleetSize    = typeof body.fleet_size === "number" ? body.fleet_size : null;
  const industry     = typeof body.industry === "string" ? body.industry.trim() : "";
  const annualMileage = typeof body.annual_mileage === "number" ? body.annual_mileage : null;
  const message      = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
  const annualSaving = typeof body.annual_saving === "number" ? body.annual_saving : null;

  if (name.length < 2) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  if (!company) return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  if (!fleetSize || fleetSize < 1) return NextResponse.json({ error: "Fleet size required." }, { status: 400 });

  const notes = [
    `Company: ${company}`,
    fleetSize ? `Fleet size: ${fleetSize} vehicles` : null,
    industry ? `Industry: ${industry}` : null,
    annualMileage ? `Annual mileage per vehicle: ${annualMileage.toLocaleString()} mi` : null,
    annualSaving ? `Estimated annual saving: £${annualSaving.toLocaleString()}` : null,
    message ? `Message: ${message}` : null,
  ].filter(Boolean).join("\n");

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("consultation_requests")
    .insert({
      full_name: name,
      email,
      phone: phone || null,
      sector: "fleet_enquiry",
      ev_model_label: `Fleet: ${fleetSize} vehicles`,
      notes,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[fleet-enquiries] insert failed:", error.message);
    return NextResponse.json({ error: "Could not save enquiry. Please try again." }, { status: 500 });
  }

  // Email notification fire-and-forget
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  if (resendKey && adminEmail) {
    const resend = new Resend(resendKey);
    const from = process.env.RESEND_FROM_EMAIL ?? "EVGuide <onboarding@resend.dev>";
    void Promise.allSettled([
      resend.emails.send({
        from, to: email,
        subject: `EVGuide Fleet Tool — your enquiry is received`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
          <div style="background:#0A0A0A;padding:24px 28px;border-radius:12px 12px 0 0">
            <p style="color:#1FBF9F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px">EVGuide · Fleet Tool</p>
            <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">We've received your enquiry</h1>
          </div>
          <div style="background:#f8fafc;padding:24px 28px;border-radius:0 0 12px 12px">
            <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
            <p>Thanks for your interest in EVGuide Fleet for <strong>${escapeHtml(company)}</strong>. Our fleet specialist will be in touch within one business day.</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin:16px 0">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;color:#94a3b8">Your Enquiry</p>
              <p style="margin:3px 0"><strong>Company:</strong> ${escapeHtml(company)}</p>
              <p style="margin:3px 0"><strong>Fleet size:</strong> ${fleetSize} vehicles</p>
              ${annualSaving ? `<p style="margin:3px 0"><strong>Estimated saving:</strong> £${annualSaving.toLocaleString()}/yr</p>` : ""}
            </div>
          </div>
        </div>`,
      }),
      resend.emails.send({
        from, to: adminEmail, replyTo: email,
        subject: `New Fleet Enquiry — ${escapeHtml(company)} (${fleetSize} vehicles) — ${escapeHtml(name)}`,
        html: `<h2>Fleet Enquiry</h2><p><strong>${escapeHtml(name)}</strong> from <strong>${escapeHtml(company)}</strong> (${escapeHtml(email)})</p><pre>${escapeHtml(notes)}</pre><p style="color:#94a3b8;font-size:12px">ID: ${data.id}</p>`,
      }),
    ]);
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
