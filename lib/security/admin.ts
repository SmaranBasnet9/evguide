import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifySecurityEvent } from "@/lib/security/alerts";

export type AdminGuardResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminGuardResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    await notifySecurityEvent({
      type: "admin-unauthorized",
      message: "Unauthorized admin route access attempt.",
    });

    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await notifySecurityEvent({
      type: "admin-forbidden",
      message: "Non-admin user attempted to access an admin-only route.",
      details: { userId: user.id },
    });

    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, userId: user.id };
}
