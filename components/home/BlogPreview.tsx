"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, ChevronRight, BookOpen } from "lucide-react";
import type { FeaturedBlogPost } from "@/lib/blog";

interface BlogPreviewProps {
  posts: FeaturedBlogPost[];
}

function getReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 180))} min read`;
}

function BlogCard({ post, index }: { post: FeaturedBlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="group relative flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111111] transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] sm:min-w-0"
    >
      {/* Top: category + read time */}
      <div className="px-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              {post.category ?? "Buying Guide"}
            </p>
            <h3 className="mt-0.5 text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand">
              {post.title}
            </h3>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white/40">
            <Clock3 className="h-3 w-3" />
            {getReadTime(post.content)}
          </span>
        </div>
        {post.excerpt && (
          <p className="mt-2 text-sm text-white/45 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Middle: cover image — same h-40/h-44 as DealCard */}
      <div className="relative mx-5 mt-4 h-40 overflow-hidden rounded-xl sm:h-44">
        <Image
          src={
            post.coverImage ||
            "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"
          }
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Bottom bar — mirrors DealCard */}
      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] px-5 py-4">
        <p className="text-sm text-white/50">
          Read the full guide
        </p>
        <Link
          href={
            post.slug
              ? `/blog/${post.slug}`
              : post.isDummy
                ? (post.category?.toLowerCase().includes("charging") ? "/charging"
                  : post.category?.toLowerCase().includes("finance") ? "/finance"
                  : "/consultation")
                : "/blog"
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-md transition-all hover:scale-110 hover:bg-brand hover:text-white"
          aria-label={`Read ${post.title}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="bg-[#080808] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header — mirrors FeaturedEVs header style */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
              <BookOpen className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                Blog &amp; Insights
              </h2>
              <p className="text-sm text-white/40">
                EV guidance you can actually use
              </p>
            </div>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-hover sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards — same layout as FeaturedEVs */}
        <div
          className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayPosts.map((post, i) => (
            <BlogCard key={post.slug || `blog-post-${i}`} post={post} index={i} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
