import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();

  const { data: dealer } = await admin
    .from("dealer_profiles")
    .select("email, user_id")
    .eq("id", id)
    .single();

  if (!dealer?.email) return NextResponse.json({ error: "Dealer not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  // Direct password set
  if (body.newPassword) {
    if (!dealer.user_id) return NextResponse.json({ error: "Dealer has no linked auth account." }, { status: 400 });
    const { error } = await admin.auth.admin.updateUserById(dealer.user_id, { password: body.newPassword });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Fallback: generate recovery link
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: dealer.email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dealer-reset-password`,
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, actionLink: data.properties?.action_link });
}
