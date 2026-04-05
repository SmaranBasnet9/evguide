import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const VALID_CATEGORIES = ["EVs", "Charging", "Updated Features"];

async function getPublishedPosts(category?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, cover_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (category && VALID_CATEGORIES.includes(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching blog posts:", error.message);
    return [];
  }
  return data ?? [];
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory =
    category && VALID_CATEGORIES.includes(category) ? category : undefined;
  const posts = await getPublishedPosts(activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold text-blue-600">EV Guide Blog</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          {activeCategory ? activeCategory : "EV insights, finance tips, charging guides, and market trends"}
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Original articles, real driver stories, and expert EV advice.
        </p>

        {/* Category filter tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              !activeCategory
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </Link>
          {VALID_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="text-slate-500">
              {activeCategory
                ? `No posts published in "${activeCategory}" yet.`
                : "No posts published yet. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {post.cover_image ? (
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    unoptimized
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-2xl text-slate-400">
                    📝
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  {post.category && (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {post.category}
                    </p>
                  )}
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-slate-400">{formatDate(post.published_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}