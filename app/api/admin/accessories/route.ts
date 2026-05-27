import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accessories")
    .select("*, accessory_categories(id, name, slug)")
    .order("category_id")
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("accessories")
    .insert({
      category_id:     body.category_id,
      name:            body.name?.trim(),
      slug:            body.slug?.trim(),
      description:     body.description?.trim() ?? null,
      brand:           body.brand?.trim() ?? null,
      price_gbp:       body.price_gbp != null ? Number(body.price_gbp) : null,
      image_url:       body.image_url ?? null,
      affiliate_url:   body.affiliate_url?.trim() ?? null,
      badge:           body.badge ?? null,
      rating:          body.rating != null ? Number(body.rating) : null,
      review_count:    body.review_count != null ? Number(body.review_count) : 0,
      is_featured:     body.is_featured ?? false,
      is_active:       body.is_active ?? true,
      compatible_with: body.compatible_with ?? [],
      display_order:   body.display_order != null ? Number(body.display_order) : 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
