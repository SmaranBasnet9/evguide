import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_V4_OR_V1 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!id || !UUID_V4_OR_V1.test(id)) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Invalid role. Must be 'admin' or 'user'." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Update only existing profile rows. Do not create profiles in role update APIs.
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Profile not found for this user. Create profile during signup first." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id, role });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
