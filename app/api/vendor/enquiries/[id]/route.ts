import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireVerifiedVendor } from "@/lib/security/vendor";

type Params = { params: Promise<{ id: string }> };

export async function PUT(_req: Request, { params }: Params) {
  const { id } = await params;
  const guard = await requireVerifiedVendor();
  if (!guard.ok) return guard.response;

  const admin = createAdminClient();
  const { data: enquiry } = await admin
    .from("vendor_enquiries")
    .select("id, vendor_id")
    .eq("id", id)
    .single();

  if (!enquiry || enquiry.vendor_id !== guard.vendorId) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  await admin.from("vendor_enquiries").update({ is_read: true }).eq("id", id);
  return NextResponse.json({ ok: true });
}
