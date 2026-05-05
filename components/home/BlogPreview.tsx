"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
    <section className="bg-[#0D0D0D] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Blog and insights</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Sharper EV guidance for smarter decisions.
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-hover"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {displayPosts.map((post, i) => (
            <motion.div
              key={post.slug || `blog-post-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={post.slug ? `/blog/${post.slug}` : "/blog"}
                className="group block overflow-hidden rounded-[1.75rem] border border-white/6 bg-white/[0.03] transition-all duration-300 hover:border-brand/20 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                  <Image
                    src={
                      post.coverImage ||
                      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em]">
                    <span className="text-brand">{post.category ?? "Buying Guide"}</span>
                    <span className="flex items-center gap-1.5 text-white/30">
                      <Clock3 className="h-3 w-3" />
                      {getReadTime(post.content)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-brand">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    {post.excerpt ?? "EV buying guidance connected to compare, finance, and AI Match decisions."}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
