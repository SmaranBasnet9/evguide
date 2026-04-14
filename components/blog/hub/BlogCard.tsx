import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogHubArticle } from "./types";

interface BlogCardProps {
  article: BlogHubArticle;
}

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <Link
      href={article.href}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white/88 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-emerald-400/20 hover:bg-[#151515] hover:shadow-[0_28px_60px_rgba(16,185,129,0.1)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
          <span className="rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1 text-emerald-100">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {article.readTime}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-emerald-200">
          {article.title}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-[#6B7280]">{article.excerpt}</p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">{article.publishedAt}</span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition group-hover:text-white">
            Read more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
