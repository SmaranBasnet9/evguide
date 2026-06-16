import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyRateLimit } from "@/lib/security/rate-limit";

const DOCUMENT_TYPES = new Set([
  "company_registration",
  "business_license",
  "government_id",
  "vat_registration",
  "proof_of_address",
  "dealership_authorization",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "vendor-documents", 12, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many uploads. Please wait a moment." }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to upload documents." }, { status: 401 });
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    return NextResponse.json({ error: "Submit your vendor application before uploading documents." }, { status: 400 });
  }
  if (vendor.status === "rejected") {
    return NextResponse.json({ error: "Your vendor application has been rejected." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const documentType = String(formData.get("documentType") ?? "");

  if (!DOCUMENT_TYPES.has(documentType)) {
    return NextResponse.json({ error: "Invalid document type." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Upload a PDF, JPEG, or PNG file." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File must be under 10 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const safeType = documentType.replace(/[^a-z0-9_-]/gi, "");
  const fileName = `vendor-documents/${vendor.id}/${safeType}-${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from("uploads")
    .upload(fileName, await file.arrayBuffer(), { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[vendor/documents] upload error:", uploadError.message);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { data: publicUrl } = admin.storage.from("uploads").getPublicUrl(fileName);

  const { error: insertError } = await admin.from("vendor_documents").insert({
    vendor_id: vendor.id,
    document_type: documentType,
    file_name: file.name,
    file_url: publicUrl.publicUrl,
    mime_type: file.type,
    file_size_bytes: file.size,
    status: "submitted",
  });

  if (insertError) {
    console.error("[vendor/documents] insert error:", insertError.message);
    return NextResponse.json({ error: "Document uploaded but could not be recorded." }, { status: 500 });
  }

  // Audit log
  await admin.from("vendor_audit_logs").insert({
    vendor_id: vendor.id,
    actor_user_id: user.id,
    action: "document_uploaded",
    details: { document_type: documentType, file_name: file.name },
  });

  return NextResponse.json({ ok: true, url: publicUrl.publicUrl }, { status: 201 });
}
