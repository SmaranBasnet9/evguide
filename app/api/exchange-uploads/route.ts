/**
 * Public image upload endpoint for exchange request vehicle photos.
 * No admin auth required — this is called from the public exchange form.
 * Files go into the "exchange-uploads" Supabase Storage bucket (or local fallback).
 *
 * Limits: PNG/JPG/WEBP only, max 5 MB per file.
 */

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const MIME_EXTENSION: Record<string, string> = {
  "image/png":  ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, and WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image size must be 5 MB or less." },
        { status: 400 }
      );
    }

    const extension =
      path.extname(file.name).toLowerCase() || MIME_EXTENSION[file.type] || ".jpg";
    const baseName = path
      .basename(file.name, extension)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    const safeName = baseName || "exchange-photo";
    const fileName = `exchange/${Date.now()}-${safeName}-${randomUUID()}${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    // Try Supabase Storage first (bucket: "uploads" — same as the admin upload route)
    try {
      const admin = createAdminClient();
      const bucket = process.env.SUPABASE_UPLOADS_BUCKET ?? "uploads";

      const { error: uploadError } = await admin.storage
        .from(bucket)
        .upload(fileName, bytes, { contentType: file.type, upsert: false });

      if (!uploadError) {
        const { data: { publicUrl } } = admin.storage.from(bucket).getPublicUrl(fileName);
        if (publicUrl) {
          return NextResponse.json({ url: publicUrl }, { status: 201 });
        }
      }
    } catch {
      // Fall through to local storage fallback
    }

    // Local fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "exchange");
    await mkdir(uploadsDir, { recursive: true });
    const localFileName = `${Date.now()}-${safeName}-${randomUUID()}${extension}`;
    const filePath = path.join(uploadsDir, localFileName);
    await writeFile(filePath, bytes);

    return NextResponse.json(
      { url: `/uploads/exchange/${localFileName}` },
      { status: 201 }
    );
  } catch (err) {
    console.error("[exchange-uploads]", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
