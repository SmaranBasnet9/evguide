import Link from "next/link";
import Image from "next/image";
import type { FeaturedBlogPost } from "@/lib/blog";

type Props = {
  posts: FeaturedBlogPost[];
};

function formatDate(value: string | null) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function FeaturedBlogPostsSection({ posts }: Props) {
  const featured = posts[0];
  const secondary = posts.slice(1, 3);

  function previewWords(text: string | null | undefined, limit: number) {
    if (!text) return "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) return words.join(" ");
    return `${words.slice(0, limit).join(" ")}...`;
  }

  function getReadMoreHref(post: FeaturedBlogPost) {
    if (post.isDummy || !post.slug) {
      return "/blog";
    }
    return `/blog/${post.slug}`;
  }

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">Featured Blog Posts</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">Latest expert EV articles</h2>
          <p className="mt-3 text-sm text-slate-600">Read one deep-dive feature and two quick updates.</p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No featured blog posts available yet.
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.28fr_0.72fr]">
                <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    {featured.coverImage ? (
                      <Image
                        src={featured.coverImage}
                        alt={featured.title}
                        fill
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
                    )}
                  </div>

                  <div className="flex flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {featured.category ?? "EV Blog"}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(featured.publishedAt)}</span>
                    </div>

                    <h3 className="mt-4 text-3xl font-bold text-slate-900">{featured.title}</h3>

                    <p className="mt-4 text-[15px] leading-7 text-slate-600">{previewWords(featured.content || featured.excerpt, 140)}</p>

                    <div className="mt-6">
                      <Link href={getReadMoreHref(featured)} className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                        Read more
                      </Link>
                    </div>
                  </div>
                </article>

                <div className="grid gap-4">
                  {secondary.map((post) => (
                    <article key={post.id} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 transition hover:shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-blue-600">{post.category ?? "EV Blog"}</span>
                        <span className="text-xs text-slate-500">{formatDate(post.publishedAt)}</span>
                      </div>

                      <h4 className="mt-3 text-lg font-semibold leading-6 text-slate-900">{post.title}</h4>

                      <p className="mt-2 text-sm leading-6 text-slate-600">{previewWords(post.content || post.excerpt, 70)}</p>

                      <div className="mt-4 flex items-center justify-end">
                        <Link href={getReadMoreHref(post)} className="text-sm font-semibold text-blue-600">
                          Read more →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:underline">
                View all blog posts →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
