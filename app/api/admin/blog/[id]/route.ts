import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const };
}

function normalizeKeywords(keywords: unknown) {
  if (Array.isArray(keywords)) {
    return keywords.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof keywords !== "string") {
    return null;
  }

  const values = keywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : null;
}

function isMissingBlogSeoColumnError(message: string | undefined) {
  return typeof message === "string" && message.includes("column blog_posts.");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  }

  const body = await request.json();
  const {
    title,
    excerpt,
    content,
    cover_image,
    category,
    published,
    meta_title,
    meta_description,
    keywords,
    geo_location,
    author,
  } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const isPublished = Boolean(published);
  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("blog_posts").select("published, published_at").eq("id", id).single();

  const publishedAt =
    isPublished && !current?.published
      ? new Date().toISOString()
      : isPublished
      ? current?.published_at ?? new Date().toISOString()
      : null;

  const payload = {
    title: title.trim(),
    excerpt: excerpt?.trim() || null,
    content: content.trim(),
    cover_image: cover_image?.trim() || null,
    category: category?.trim() || null,
    meta_title: meta_title?.trim() || null,
    meta_description: meta_description?.trim() || null,
    keywords: normalizeKeywords(keywords),
    geo_location: geo_location?.trim() || null,
    author: author?.trim() || "EVGuide AI Editorial",
    published: isPublished,
    published_at: publishedAt,
  };

  const updateWithSeo = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (!updateWithSeo.error) {
    return NextResponse.json({ success: true, data: updateWithSeo.data });
  }

  if (!isMissingBlogSeoColumnError(updateWithSeo.error.message)) {
    return NextResponse.json({ error: updateWithSeo.error.message }, { status: 400 });
  }

  const legacyPayload = {
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image: payload.cover_image,
    category: payload.category,
    published: payload.published,
    published_at: payload.published_at,
  };

  const legacyUpdate = await supabase
    .from("blog_posts")
    .update(legacyPayload)
    .eq("id", id)
    .select()
    .single();

  if (legacyUpdate.error) {
    return NextResponse.json({ error: legacyUpdate.error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: legacyUpdate.data,
    warning: "Post saved without SEO fields because the blog SEO migration has not been applied yet.",
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid post id." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, id });
}
