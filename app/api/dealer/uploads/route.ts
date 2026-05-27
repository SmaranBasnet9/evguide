import { NextResponse } from "next/server";
import { requireDealer } from "@/lib/security/dealer";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-uploads", 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }

  const guard = await requireDealer();
  if (!guard.ok) return guard.response;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and AVIF images are allowed." }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `dealer-listings/${guard.dealerProfileId}/${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("uploads")
    .upload(fileName, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[dealer/uploads]", uploadError.message);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { data: publicUrl } = admin.storage.from("uploads").getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl.publicUrl }, { status: 201 });
}
