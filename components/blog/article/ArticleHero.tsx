import Image from "next/image";
import { Clock3, ImageIcon, Sparkles } from "lucide-react";
import type { ArticleHeroData } from "./types";

interface ArticleHeroProps {
  hero: ArticleHeroData;
}

export default function ArticleHero({ hero }: ArticleHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white pt-28 text-black">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,191,159,0.08),transparent_62%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            {hero.category}
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-black sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black sm:text-xl">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-black">
            <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-black">
              By {hero.author}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              {hero.readTime}
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
              {hero.publishedAt}
            </span>
            {hero.geoLocation ? (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-200">
                {hero.geoLocation}
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-50 shadow-sm">
          <div className="relative aspect-[4/3]">
            {hero.image ? (
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <ImageIcon className="h-10 w-10 text-white/20" strokeWidth={1.2} />
                <p className="text-xs font-medium text-white/30">Cover image — upload PNG via admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
