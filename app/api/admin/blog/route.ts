import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  return { ok: true as const, userId: user.id };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();
  const fullQuery = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, published, meta_title, meta_description, geo_location, author, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (!fullQuery.error) {
    return NextResponse.json({ data: fullQuery.data });
  }

  if (!isMissingBlogSeoColumnError(fullQuery.error.message)) {
    return NextResponse.json({ error: fullQuery.error.message }, { status: 400 });
  }

  const legacyQuery = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (legacyQuery.error) {
    return NextResponse.json({ error: legacyQuery.error.message }, { status: 400 });
  }

  return NextResponse.json({
    data: legacyQuery.data,
    warning: "Blog SEO columns are missing in the connected database. Run 004_add_blog_seo_columns.sql to enable full metadata support.",
  });
}

export async function POST(request: Request) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

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

  const baseSlug = slugify(title);
  if (!baseSlug) {
    return NextResponse.json({ error: "Title produces an empty slug." }, { status: 400 });
  }

  const supabase = createAdminClient();

  let slug = baseSlug;
  const { data: existing } = await supabase
    .from("blog_posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  const isPublished = Boolean(published);

  const payload = {
    slug,
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
    author_id: auth.userId,
    published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  const createWithSeo = await supabase
    .from("blog_posts")
    .insert(payload)
    .select()
    .single();

  if (!createWithSeo.error) {
    return NextResponse.json({ success: true, data: createWithSeo.data }, { status: 201 });
  }

  if (!isMissingBlogSeoColumnError(createWithSeo.error.message)) {
    return NextResponse.json({ error: createWithSeo.error.message }, { status: 400 });
  }

  const legacyPayload = {
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image: payload.cover_image,
    category: payload.category,
    author_id: payload.author_id,
    published: payload.published,
    published_at: payload.published_at,
  };

  const legacyCreate = await supabase
    .from("blog_posts")
    .insert(legacyPayload)
    .select()
    .single();

  if (legacyCreate.error) {
    return NextResponse.json({ error: legacyCreate.error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      success: true,
      data: legacyCreate.data,
      warning: "Post saved without SEO fields because the blog SEO migration has not been applied yet.",
    },
    { status: 201 },
  );
}
