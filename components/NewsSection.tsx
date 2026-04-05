"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { EVNewsItem } from "@/lib/news";

type NewsSectionProps = {
  items: EVNewsItem[];
};

export default function NewsSection({ items }: NewsSectionProps) {
  const filteredItems = useMemo(() => items, [items]);

  const featuredItem = filteredItems[0];
  const secondaryItems = filteredItems.slice(1, 4);
  const extraHeadlines = filteredItems.slice(5, 9);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">Trending EV News</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Latest EV tech, battery innovation, and charging updates
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-lg font-bold text-red-700">
              No live news is loading.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Check terminal logs for ENV CHECK, GNEWS STATUS, and GNEWS RAW RESPONSE.
            </p>
          </div>
        ) : (
          <>
            {featuredItem && (
              <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={featuredItem.image}
                      alt={featuredItem.title}
                      fill
                      sizes="(min-width: 1024px) 70vw, 100vw"
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {featuredItem.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {featuredItem.publishedAt}
                      </span>
                    </div>

                    <h3 className="mt-4 text-3xl font-bold text-slate-900">
                      {featuredItem.title}
                    </h3>

                    <p className="mt-4 text-base text-slate-600">
                      {featuredItem.summary}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-slate-500">
                        Source: {featuredItem.source}
                      </p>

                      {featuredItem.url ? (
                        <a
                          href={featuredItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                        >
                          Read more
                        </a>
                      ) : (
                        <span className="inline-flex items-center rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
                          Link unavailable
                        </span>
                      )}
                    </div>

                    {extraHeadlines.length > 0 && (
                      <div className="mt-6 border-t border-slate-200 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          More headlines
                        </p>
                        <div className="mt-3 space-y-3">
                          {extraHeadlines.map((item) => (
                            <a
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50"
                            >
                              <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {item.source} • {item.publishedAt}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                <div className="grid gap-4">
                  {secondaryItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-blue-600">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.publishedAt}
                        </span>
                      </div>

                      <h4 className="mt-3 text-lg font-semibold text-slate-900">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">{item.source}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-600"
                        >
                          Read more →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}