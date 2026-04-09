import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { FeaturedBlogPost } from "@/lib/blog";

interface BlogPreviewProps {
  posts: FeaturedBlogPost[];
}

function getReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 180))} min read`;
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="bg-[#090909] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Blog and insights</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Sharper EV guidance for smarter next steps</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Keep the content layer tight, useful, and connected to the product journey.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition hover:text-emerald-300">
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {displayPosts.map((post, index) => (
            <Link
              key={post.slug || `blog-post-${index}`}
              href={post.slug ? `/blog/${post.slug}` : "/blog"}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-[#151515]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                <Image
                  src={post.coverImage || "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <span className="text-cyan-200">{post.category ?? "Buying Guide"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{getReadTime(post.content)}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white transition-colors group-hover:text-emerald-300">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {post.excerpt ?? "EV buying guidance connected to compare, finance, and AI Match decisions."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
