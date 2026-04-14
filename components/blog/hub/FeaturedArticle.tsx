import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogHubArticle } from "./types";

interface FeaturedArticleProps {
  article: BlogHubArticle;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="group overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white/90 shadow-[0_32px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl transition duration-500 hover:border-emerald-400/20 hover:shadow-[0_32px_100px_rgba(16,185,129,0.12)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] overflow-hidden border-b border-[#E5E7EB] lg:min-h-[420px] lg:border-b-0 lg:border-r">
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/15 to-cyan-400/10" />
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-cyan-100">
                  {article.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="mt-6 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {article.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#6B7280]">
                {article.description ?? article.excerpt}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-[#6B7280]">
                <span>{article.publishedAt}</span>
                {article.author ? <span className="ml-3 text-[#6B7280]">By {article.author}</span> : null}
              </div>

              <Link
                href={article.href}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/12 px-5 py-3 text-sm font-semibold text-emerald-100 transition duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/18 hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]"
              >
                Read article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
