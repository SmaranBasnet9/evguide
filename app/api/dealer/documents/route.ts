import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

const DOCUMENT_TYPES = new Set([
  "company_registration",
  "proof_of_address",
  "motor_trade_insurance",
  "vat_certificate",
  "fca_authorisation",
  "stock_ownership",
]);

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "dealer-documents", 12, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many document uploads. Please wait a moment." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to upload verification documents." }, { status: 401 });
  }

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) {
    return NextResponse.json({ error: "Submit your vendor application before uploading documents." }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const documentType = String(formData.get("documentType") ?? "");

  if (!DOCUMENT_TYPES.has(documentType)) {
    return NextResponse.json({ error: "Document type is required." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Upload a PDF, JPEG, PNG, or WebP file." }, { status: 400 });
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Document must be under 8 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const safeType = documentType.replace(/[^a-z0-9_-]/gi, "");
  const fileName = `dealer-documents/${dealerProfile.id}/${safeType}-${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("uploads")
    .upload(fileName, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[dealer/documents] upload error:", uploadError.message);
    return NextResponse.json({ error: "Document upload failed. Please try again." }, { status: 500 });
  }

  const { data: publicUrl } = admin.storage.from("uploads").getPublicUrl(fileName);

  const { error: insertError } = await admin.from("dealer_documents").insert({
    dealer_id: dealerProfile.id,
    document_type: documentType,
    file_name: file.name,
    file_url: publicUrl.publicUrl,
    mime_type: file.type,
    file_size: file.size,
    status: "submitted",
  });

  if (insertError) {
    if (insertError.message.includes("relation") || insertError.message.includes("table")) {
      // dealer_documents table not created yet — file is uploaded but not tracked
      // Run PENDING_MIGRATIONS.sql in Supabase Dashboard to enable document tracking
      console.warn("[dealer/documents] dealer_documents table missing — file uploaded but not tracked");
      return NextResponse.json({ ok: true, url: publicUrl.publicUrl, warning: "Document uploaded but tracking table not ready." }, { status: 201 });
    }
    console.error("[dealer/documents] insert error:", insertError.message);
    return NextResponse.json({ error: "Document was uploaded but could not be recorded." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: publicUrl.publicUrl }, { status: 201 });
}
