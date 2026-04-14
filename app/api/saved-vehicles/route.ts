import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveVehicle, unsaveVehicle, getSavedVehicles } from "@/lib/saved-vehicles";

async function getIdentity(req: NextRequest, bodySessionId?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  // Session ID comes from the request body (same pattern as /api/tracking)
  const sessionId = bodySessionId ?? null;
  return { userId, sessionId };
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const { userId, sessionId: resolvedSession } = await getIdentity(req, sessionId);

  const saved = await getSavedVehicles(userId, resolvedSession);
  return NextResponse.json({ saved });
}

export async function POST(req: NextRequest) {
  let body: { vehicleId: string; vehicleLabel: string; vehiclePrice: number; session_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userId, sessionId } = await getIdentity(req, body.session_id);

  if (!userId && !sessionId) {
    return NextResponse.json({ error: "No identity — provide session_id" }, { status: 401 });
  }

  const { vehicleId, vehicleLabel, vehiclePrice } = body;
  if (!vehicleId || !vehicleLabel) {
    return NextResponse.json({ error: "vehicleId and vehicleLabel required" }, { status: 400 });
  }

  const saved = await saveVehicle(vehicleId, vehicleLabel, vehiclePrice ?? null, userId, sessionId);
  if (!saved) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
  return NextResponse.json({ saved });
}

export async function DELETE(req: NextRequest) {
  let body: { vehicleId: string; session_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userId, sessionId } = await getIdentity(req, body.session_id);

  if (!userId && !sessionId) {
    return NextResponse.json({ error: "No identity — provide session_id" }, { status: 401 });
  }

  const { vehicleId } = body;
  if (!vehicleId) {
    return NextResponse.json({ error: "vehicleId required" }, { status: 400 });
  }

  const ok = await unsaveVehicle(vehicleId, userId, sessionId);
  return NextResponse.json({ success: ok });
}
