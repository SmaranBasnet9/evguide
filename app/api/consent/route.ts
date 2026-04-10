import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildConsentPreferences,
  CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_COOKIE_KEY,
  CURRENT_CONSENT_VERSION,
  isConsentValid,
  readConsentFromCookieStore,
  type CookieConsentPreferences,
} from "@/lib/privacy/consent";

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  // Use a simple truncated hash for audit — not reversible to the original IP.
  // In a real production system, use crypto.subtle.digest or a server-side hash.
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `ip_${Math.abs(hash).toString(36)}`;
}

function truncateUserAgent(ua: string | null): string | null {
  if (!ua) return null;
  // Keep only enough for device-class audit (e.g. "Mozilla/5.0 (Windows NT...")
  return ua.length > 120 ? ua.slice(0, 120) : ua;
}

/**
 * GET /api/consent
 *
 * Returns the current consent state from the cookie.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const consent = readConsentFromCookieStore(cookieStore);

    if (!consent) {
      return NextResponse.json({ consent: null, valid: false });
    }

    return NextResponse.json({
      consent,
      valid: isConsentValid(consent),
    });
  } catch (error) {
    console.error("[consent] GET error:", error);
    return NextResponse.json({ consent: null, valid: false });
  }
}

/**
 * POST /api/consent
 *
 * Saves or updates the consent cookie and writes an audit row
 * to consent_logs for accountability.
 */
export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const analytics = Boolean(body.analytics);
    const personalization = Boolean(body.personalization);
    const method = typeof body.method === "string" ? body.method : "banner";

    const nextPreferences: CookieConsentPreferences = buildConsentPreferences({
      analytics,
      personalization,
    });

    const serialized = encodeURIComponent(JSON.stringify(nextPreferences));

    // Build the response with the consent cookie set.
    const response = NextResponse.json({
      consent: nextPreferences,
      valid: true,
    });

    response.cookies.set(COOKIE_CONSENT_COOKIE_KEY, serialized, {
      path: "/",
      maxAge: CONSENT_MAX_AGE_SECONDS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Must be readable by client-side JS
    });

    // Write audit log (fire-and-forget — don't fail the response).
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const cookieStore = await cookies();
      const sessionId = cookieStore.get("evguide_tracking_session_id")?.value ?? null;

      const ipHeader = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
      const rawIp = ipHeader?.split(",")[0]?.trim() ?? null;

      const admin = createAdminClient();
      await admin.from("consent_logs").insert({
        session_id: sessionId ? decodeURIComponent(sessionId).trim() || null : null,
        profile_id: user?.id ?? null,
        analytics,
        personalization,
        consent_version: CURRENT_CONSENT_VERSION,
        consent_method: method,
        ip_hash: hashIp(rawIp),
        user_agent: truncateUserAgent(request.headers.get("user-agent")),
      });
    } catch (auditError) {
      // Audit logging failure is non-fatal.
      console.error("[consent] audit log failed:", auditError);
    }

    return response;
  } catch (error) {
    console.error("[consent] POST error:", error);
    return NextResponse.json({ error: "Failed to save consent." }, { status: 500 });
  }
}
