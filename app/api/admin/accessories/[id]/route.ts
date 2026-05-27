import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accessories")
    .select("*, accessory_categories(id, name, slug)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const admin = createAdminClient();

  const patch: Record<string, unknown> = {};
  if (body.category_id   !== undefined) patch.category_id   = body.category_id;
  if (body.name          !== undefined) patch.name          = body.name?.trim();
  if (body.slug          !== undefined) patch.slug          = body.slug?.trim();
  if (body.description   !== undefined) patch.description   = body.description?.trim() ?? null;
  if (body.brand         !== undefined) patch.brand         = body.brand?.trim() ?? null;
  if (body.price_gbp     !== undefined) patch.price_gbp     = body.price_gbp != null ? Number(body.price_gbp) : null;
  if (body.image_url     !== undefined) patch.image_url     = body.image_url ?? null;
  if (body.affiliate_url !== undefined) patch.affiliate_url = body.affiliate_url?.trim() ?? null;
  if (body.badge         !== undefined) patch.badge         = body.badge ?? null;
  if (body.rating        !== undefined) patch.rating        = body.rating != null ? Number(body.rating) : null;
  if (body.review_count  !== undefined) patch.review_count  = Number(body.review_count);
  if (body.is_featured   !== undefined) patch.is_featured   = Boolean(body.is_featured);
  if (body.is_active     !== undefined) patch.is_active     = Boolean(body.is_active);
  if (body.compatible_with !== undefined) patch.compatible_with = body.compatible_with;
  if (body.display_order !== undefined) patch.display_order = Number(body.display_order);

  const { data, error } = await admin
    .from("accessories")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admin = createAdminClient();

  // Remove image from storage if present
  const { data: row } = await admin
    .from("accessories")
    .select("image_url")
    .eq("id", id)
    .single();

  if (row?.image_url) {
    const path = row.image_url.split("/storage/v1/object/public/accessories/")[1];
    if (path) await admin.storage.from("accessories").remove([path]);
  }

  const { error } = await admin.from("accessories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
