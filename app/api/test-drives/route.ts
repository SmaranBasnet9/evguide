import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { refreshIntentProfileForIdentity } from "@/lib/profiling/intent-profile";
import { refreshLeadScoreForIdentity } from "@/lib/scoring/lead-intent";
import { createClient } from "@/lib/supabase/server";
import { notifySecurityEvent } from "@/lib/security/alerts";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { hasAnalyticsConsent, hasPersonalizationConsent, readConsentFromCookieHeader } from "@/lib/privacy/consent";

function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

async function sendConfirmationEmails(booking: {
  id: string;
  full_name: string;
  email: string;
  ev_model_label: string | null;
  preferred_date: string;
  preferred_time_slot: string;
  preferred_location: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "EVGuide <onboarding@resend.dev>";
  const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? process.env.MG_DEALER_EMAIL;
  const vehicleLabel = booking.ev_model_label ?? "your chosen EV";

  await Promise.allSettled([
    // Buyer confirmation
    resend.emails.send({
      from,
      to: booking.email,
      subject: `Test drive request confirmed — ${escapeHtml(vehicleLabel)}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
          <div style="background:#0A0A0A;padding:28px 32px;border-radius:12px 12px 0 0">
            <p style="color:#1FBF9F;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px">EVGuide AI</p>
            <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0">Test drive request received</h1>
          </div>
          <div style="background:#f8fafc;padding:28px 32px;border-radius:0 0 12px 12px">
            <p style="margin:0 0 16px">Hi <strong>${escapeHtml(booking.full_name)}</strong>,</p>
            <p style="margin:0 0 20px">We've received your test drive request for the <strong>${escapeHtml(vehicleLabel)}</strong>. Our team will confirm your slot within 24 hours.</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:20px">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8">Booking summary</p>
              <p style="margin:4px 0"><strong>Vehicle:</strong> ${escapeHtml(vehicleLabel)}</p>
              <p style="margin:4px 0"><strong>Preferred date:</strong> ${escapeHtml(booking.preferred_date)}</p>
              <p style="margin:4px 0"><strong>Preferred time:</strong> ${escapeHtml(booking.preferred_time_slot)}</p>
              <p style="margin:4px 0"><strong>Location:</strong> ${escapeHtml(booking.preferred_location)}</p>
              <p style="margin:4px 0;color:#94a3b8;font-size:12px">Reference: ${escapeHtml(booking.id)}</p>
            </div>
            <p style="color:#64748b;font-size:13px">If you need to change or cancel, reply to this email with your reference number.</p>
          </div>
        </div>
      `,
    }),
    // Internal admin notification
    adminEmail ? resend.emails.send({
      from,
      to: adminEmail,
      replyTo: booking.email,
      subject: `New test drive request — ${escapeHtml(vehicleLabel)} — ${escapeHtml(booking.full_name)}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1e293b">
          <h2>New Test Drive Request</h2>
          <p><strong>Vehicle:</strong> ${escapeHtml(vehicleLabel)}</p>
          <p><strong>Customer:</strong> ${escapeHtml(booking.full_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
          <p><strong>Date:</strong> ${escapeHtml(booking.preferred_date)}</p>
          <p><strong>Time:</strong> ${escapeHtml(booking.preferred_time_slot)}</p>
          <p><strong>Location:</strong> ${escapeHtml(booking.preferred_location)}</p>
          <p><strong>ID:</strong> ${escapeHtml(booking.id)}</p>
          <hr/><p style="color:#94a3b8;font-size:12px">Manage in EVGuide Admin → Test Drives</p>
        </div>
      `,
    }) : Promise.resolve(),
  ]);
}

type IntentProfileGate = {
  id: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const consent = readConsentFromCookieHeader(request.headers.get("cookie"));
  const personalizationAllowed = hasPersonalizationConsent(consent);
  const analyticsAllowed = hasAnalyticsConsent(consent);

  const rateLimit = applyRateLimit(request, "test-drives", 8, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    await notifySecurityEvent({
      type: "rate-limit",
      message: "Test drive submissions exceeded rate limit.",
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    await notifySecurityEvent({
      type: "unauthorized-test-drive",
      message: "Unauthenticated test-drive request blocked.",
    });

    return NextResponse.json({ error: "Please sign in to book a test drive." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_intent_profiles")
    .select("id, intent_score, user_type, compare_count, visit_count")
    .eq("user_id", user.id)
    .maybeSingle();

  const intentProfile = (profile ?? null) as IntentProfileGate | null;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const rawEvModelId =
    typeof body.ev_model_id === "string" && body.ev_model_id.trim() ? body.ev_model_id.trim() : null;
  const evModelLabel = typeof body.ev_model_label === "string" && body.ev_model_label.trim() ? body.ev_model_label.trim() : null;
  const preferredDate = typeof body.preferred_date === "string" ? body.preferred_date.trim() : "";
  const preferredTimeSlot = typeof body.preferred_time_slot === "string" ? body.preferred_time_slot.trim() : "";
  const preferredLocation = typeof body.preferred_location === "string" ? body.preferred_location.trim() : "";
  const evModelId = rawEvModelId && UUID_REGEX.test(rawEvModelId) ? rawEvModelId : null;
  const normalizedVehicleLabel = evModelLabel ?? rawEvModelId;

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!preferredDate) {
    return NextResponse.json({ error: "Preferred date is required." }, { status: 400 });
  }
  if (!preferredTimeSlot) {
    return NextResponse.json({ error: "Preferred time is required." }, { status: 400 });
  }
  if (!preferredLocation) {
    return NextResponse.json({ error: "Preferred location is required." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("test_drive_bookings")
    .insert({
      profile_id: intentProfile?.id ?? null,
      user_id: user.id,
      full_name: fullName,
      email,
      phone: null,
      ev_model_id: evModelId,
      ev_model_label: normalizedVehicleLabel,
      preferred_date: preferredDate,
      preferred_time_slot: preferredTimeSlot,
      preferred_location: preferredLocation,
      current_vehicle: null,
      notes: null,
      status: "requested",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[test-drives] failed to insert booking:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let trackingError: { message: string } | null = null;

  if (analyticsAllowed) {
    const result = await admin.from("user_events").insert({
      user_id: user.id,
      session_id: null,
      car_id: evModelId,
      event_type: "test_drive_clicked",
      event_value: {
        booking_id: data.id,
        desired_vehicle: normalizedVehicleLabel,
        preferred_location: preferredLocation,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
      },
      page_path: "/appointment",
    });
    trackingError = result.error;
  }

  if (trackingError) {
    console.error("[test-drives] failed to insert tracking event:", trackingError.message);
  } else if (personalizationAllowed) {
    await refreshLeadScoreForIdentity({ userId: user.id, sessionId: null });
    await refreshIntentProfileForIdentity({ userId: user.id, sessionId: null });
  }

  // Fire-and-forget confirmation emails
  void sendConfirmationEmails({
    id: data.id,
    full_name: fullName,
    email,
    ev_model_label: normalizedVehicleLabel,
    preferred_date: preferredDate,
    preferred_time_slot: preferredTimeSlot,
    preferred_location: preferredLocation,
  });

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
