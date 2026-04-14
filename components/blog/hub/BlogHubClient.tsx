"use client";

import { startTransition, useDeferredValue, useState } from "react";
import BlogCard from "./BlogCard";
import BlogCTASection from "./BlogCTASection";
import BlogFilter from "./BlogFilter";
import BlogHero from "./BlogHero";
import BuyerJourneySection from "./BuyerJourneySection";
import FeaturedArticle from "./FeaturedArticle";
import { BLOG_CATEGORIES, type BlogCategory, type BlogHubArticle } from "./types";

interface BlogHubClientProps {
  articles: BlogHubArticle[];
}

const QUICK_CATEGORIES = BLOG_CATEGORIES.filter(
  (category): category is Exclude<BlogCategory, "All"> => category !== "All",
);

export default function BlogHubClient({ articles }: BlogHubClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredArticles = articles.filter((article) => {
    const categoryMatch = activeCategory === "All" || article.category === activeCategory;
    const queryMatch =
      normalizedQuery.length === 0 ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.category.toLowerCase().includes(normalizedQuery);

    return categoryMatch && queryMatch;
  });

  const featuredArticle = filteredArticles[0] ?? articles[0];
  const remainingArticles = filteredArticles.filter((article) => article.id !== featuredArticle?.id);
  const firstGridArticles = remainingArticles.slice(0, 6);
  const secondGridArticles = remainingArticles.slice(6);

  return (
    <>
      <BlogHero
        query={query}
        onQueryChange={(value) => startTransition(() => setQuery(value))}
        activeCategory={activeCategory}
        onCategoryChange={(value) => startTransition(() => setActiveCategory(value))}
        quickCategories={QUICK_CATEGORIES}
      />

      <div className="space-y-12 py-12 sm:space-y-16 sm:py-16">
        <FeaturedArticle article={featuredArticle} />

        <BlogFilter
          categories={BLOG_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={(value) => startTransition(() => setActiveCategory(value))}
        />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Editorial picks</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Research that leads into action
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              High-intent EV content built to answer buyer questions and guide the next product step.
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-lg font-medium text-white">No articles match that search yet.</p>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Try a broader query or jump straight into AI Match, Compare EVs, or Check affordability.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {firstGridArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <BlogCTASection
            eyebrow="Conversion path"
            title="Not sure which EV fits you?"
            text="Answer a few questions and get your best EV match instantly."
            primaryLabel="Start Match"
            primaryHref="/ai-match"
            accent="emerald"
          />
          <BlogCTASection
            eyebrow="Decision tool"
            title="Compare EVs side by side"
            text="Move from reading into a clearer shortlist by comparing price, range, charging, and value in one view."
            primaryLabel="Compare EVs"
            primaryHref="/compare"
            accent="cyan"
          />
        </section>

        <BuyerJourneySection />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Latest posts</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                More ways to de-risk your EV decision
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Keep exploring charging, finance, and comparison content without losing the path into the product.
            </p>
          </div>

          {secondGridArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {secondGridArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <p className="text-sm leading-7 text-zinc-400">
                More posts will appear here as the content library expands. For now, the top stories cover the highest-intent buyer questions.
              </p>
            </div>
          ) : null}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <BlogCTASection
            eyebrow="Final step"
            title="Find your perfect EV today"
            text="Start your EV journey with smart recommendations and real cost insights."
            primaryLabel="Start Match"
            primaryHref="/ai-match"
            secondaryLabel="Explore EVs"
            secondaryHref="/vehicles"
            accent="emerald"
          />
        </section>
      </div>
    </>
  );
}
