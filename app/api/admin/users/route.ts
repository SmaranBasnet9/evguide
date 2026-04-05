import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get all auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Get all profiles (roles)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, role");
    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 400 });
    }

    const roleMap = new Map(profiles.map((p) => [p.id, p.role]));

    const users = authData.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      role: roleMap.get(u.id) ?? "user",
    }));

    return NextResponse.json({ users });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
