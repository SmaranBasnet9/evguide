import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security/admin";

type Params = { params: Promise<{ id: string }> };

// POST — upload a new image and save URL to the row
export async function POST(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admin = createAdminClient();

  const formData = await request.formData();
  const file = formData.get("image") as File | null;
  if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${id}/image.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Remove old image first
  const { data: row } = await admin.from("accessories").select("image_url").eq("id", id).single();
  if (row?.image_url) {
    const oldPath = row.image_url.split("/storage/v1/object/public/accessories/")[1];
    if (oldPath) await admin.storage.from("accessories").remove([oldPath]);
  }

  const { error: uploadError } = await admin.storage
    .from("accessories")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from("accessories").getPublicUrl(path);
  const imageUrl = urlData.publicUrl;

  const { error: updateError } = await admin
    .from("accessories")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ imageUrl });
}

// DELETE — remove image from storage and clear image_url
export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: row } = await admin.from("accessories").select("image_url").eq("id", id).single();
  if (row?.image_url) {
    const path = row.image_url.split("/storage/v1/object/public/accessories/")[1];
    if (path) await admin.storage.from("accessories").remove([path]);
  }

  const { error } = await admin.from("accessories").update({ image_url: null }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
