import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { notifySecurityEvent } from "@/lib/security/alerts";

function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-quotes", 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    await notifySecurityEvent({ type: "rate-limit", message: "Dealer quote requests exceeded rate limit." });
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to request dealer quotes." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Validate required fields
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const vehicleId = typeof body.vehicle_id === "string" ? body.vehicle_id.trim() : null;
  const vehicleLabel = typeof body.vehicle_label === "string" ? body.vehicle_label.trim() : "";
  const budgetMax = typeof body.budget_max === "number" ? body.budget_max : null;
  const monthlyBudget = typeof body.monthly_budget === "number" ? body.monthly_budget : null;
  const financeType = typeof body.finance_type === "string" ? body.finance_type : "pcp";
  const tradeIn = typeof body.trade_in === "string" ? body.trade_in.trim() : "";
  const targetDelivery = typeof body.target_delivery === "string" ? body.target_delivery.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  if (name.length < 2) return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  if (!phone.trim()) return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  if (!vehicleLabel) return NextResponse.json({ error: "Vehicle selection required." }, { status: 400 });

  const admin = createAdminClient();

  // Compose notes for the consultation_requests record
  const fullNotes = [
    vehicleLabel ? `Vehicle: ${vehicleLabel}` : null,
    budgetMax ? `Max budget: £${budgetMax.toLocaleString()}` : null,
    monthlyBudget ? `Monthly target: £${monthlyBudget}/mo` : null,
    financeType ? `Finance type: ${financeType.toUpperCase()}` : null,
    tradeIn ? `Part exchange: ${tradeIn}` : null,
    targetDelivery ? `Target delivery: ${targetDelivery}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join("\n");

  const { data, error } = await admin
    .from("consultation_requests")
    .insert({
      user_id: user.id,
      full_name: name,
      email,
      phone,
      sector: "dealer_bid",
      ev_model_id: vehicleId,
      ev_model_label: vehicleLabel,
      notes: fullNotes || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[dealer-quotes] insert failed:", error.message);
    return NextResponse.json({ error: "Unable to save your request. Please try again." }, { status: 500 });
  }

  // Send emails fire-and-forget
  void sendDealerQuoteEmails({
    requestId: data.id,
    name, email, vehicleLabel,
    budgetMax, monthlyBudget, financeType, tradeIn, targetDelivery, notes,
  });

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}

async function sendDealerQuoteEmails(params: {
  requestId: string;
  name: string;
  email: string;
  vehicleLabel: string;
  budgetMax: number | null;
  monthlyBudget: number | null;
  financeType: string;
  tradeIn: string;
  targetDelivery: string;
  notes: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "EVGuide <onboarding@resend.dev>";
  const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const {
    requestId, name, email, vehicleLabel,
    budgetMax, monthlyBudget, financeType, tradeIn, targetDelivery, notes,
  } = params;

  const summaryHtml = `
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;color:#94a3b8">Quote Request Summary</p>
      <p style="margin:4px 0"><strong>Vehicle:</strong> ${escapeHtml(vehicleLabel)}</p>
      ${budgetMax ? `<p style="margin:4px 0"><strong>Max budget:</strong> £${budgetMax.toLocaleString()}</p>` : ""}
      ${monthlyBudget ? `<p style="margin:4px 0"><strong>Monthly target:</strong> £${monthlyBudget}/mo</p>` : ""}
      <p style="margin:4px 0"><strong>Finance type:</strong> ${escapeHtml(financeType.toUpperCase())}</p>
      ${tradeIn ? `<p style="margin:4px 0"><strong>Part exchange:</strong> ${escapeHtml(tradeIn)}</p>` : ""}
      ${targetDelivery ? `<p style="margin:4px 0"><strong>Target delivery:</strong> ${escapeHtml(targetDelivery)}</p>` : ""}
      ${notes ? `<p style="margin:4px 0"><strong>Notes:</strong> ${escapeHtml(notes)}</p>` : ""}
      <p style="margin:8px 0 0;color:#94a3b8;font-size:12px">Reference: ${escapeHtml(requestId)}</p>
    </div>
  `;

  await Promise.allSettled([
    // Buyer confirmation
    resend.emails.send({
      from,
      to: email,
      subject: `Your quote request for ${escapeHtml(vehicleLabel)} is live`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#0A0A0A;padding:28px 32px;border-radius:12px 12px 0 0">
            <p style="color:#1FBF9F;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px">EVGuide AI · Dealer Quotes</p>
            <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0">Quotes on their way</h1>
          </div>
          <div style="background:#f8fafc;padding:28px 32px;border-radius:0 0 12px 12px">
            <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
            <p>Your no-haggle quote request for the <strong>${escapeHtml(vehicleLabel)}</strong> has been sent to verified EVGuide dealers. You'll hear back within 24–48 hours.</p>
            ${summaryHtml}
            <p style="color:#64748b;font-size:13px">Dealers compete to give you their best price — you're not obligated to accept any offer.</p>
          </div>
        </div>
      `,
    }),
    // Admin notification
    adminEmail ? resend.emails.send({
      from,
      to: adminEmail,
      replyTo: email,
      subject: `New dealer bid request — ${escapeHtml(vehicleLabel)} — ${escapeHtml(name)}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1e293b">
          <h2>New Dealer Bid Request</h2>
          <p><strong>Customer:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          ${summaryHtml}
          <hr/><p style="color:#94a3b8;font-size:12px">Manage in EVGuide Admin → Dealer Bids</p>
        </div>
      `,
    }) : Promise.resolve(),
  ]);
}
