import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullNameRaw = user.user_metadata?.full_name;
    const phoneRaw = user.user_metadata?.phone_number;

    const fullName = typeof fullNameRaw === "string" && fullNameRaw.trim().length > 0
      ? fullNameRaw.trim()
      : null;

    const phoneNumber = typeof phoneRaw === "string" && phoneRaw.trim().length > 0
      ? phoneRaw.trim()
      : null;

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("user_followups")
      .select("full_name, phone_number")
      .eq("user_id", user.id)
      .maybeSingle();

    const mergedFullName = fullName ?? existing?.full_name ?? null;
    const mergedPhone = phoneNumber ?? existing?.phone_number ?? null;

    const { error: upsertError } = await admin
      .from("user_followups")
      .upsert(
        {
          user_id: user.id,
          full_name: mergedFullName,
          email: user.email ?? "",
          phone_number: mergedPhone,
          last_login_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
