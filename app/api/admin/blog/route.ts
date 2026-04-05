import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
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

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { title, excerpt, content, cover_image, category, published } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const baseSlug = slugify(title);
  if (!baseSlug) {
    return NextResponse.json({ error: "Title produces an empty slug." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Ensure slug uniqueness by appending a short timestamp suffix if needed
  let slug = baseSlug;
  const { data: existing } = await supabase
    .from("blog_posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  const isPublished = Boolean(published);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title: title.trim(),
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      cover_image: cover_image?.trim() || null,
      category: category?.trim() || null,
      author_id: auth.userId,
      published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
