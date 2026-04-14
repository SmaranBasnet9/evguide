import Link from "next/link";
import Image from "next/image";
import { Clock3, ImageIcon } from "lucide-react";
import type { RelatedArticlesProps } from "./types";

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B7280]">Keep exploring</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Related buying guides</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#6B7280]">
            Continue the research journey with EV pricing, charging, and ownership guides tailored for UK buyers.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[#F8FAF9] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <ImageIcon className="h-7 w-7 text-zinc-700" strokeWidth={1.2} />
                  <p className="text-xs text-zinc-600">Upload via admin</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{article.category}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{article.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#6B7280]">{article.excerpt}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-[#6B7280]">
                <Clock3 className="h-4 w-4" />
                {article.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
