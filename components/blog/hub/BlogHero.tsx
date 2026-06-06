import { Search } from "lucide-react";
import type { BlogHeroProps } from "./types";

export default function BlogHero({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  quickCategories,
}: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white pt-32">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,191,159,0.08),transparent_62%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-black">
            Content hub for smarter EV decisions
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
            EV guides, comparisons, and buying insights
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black sm:text-lg">
            Make smarter EV decisions with expert content, comparisons, and cost breakdowns.
          </p>

          <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-2 shadow-sm">
            <label className="flex items-center gap-3 rounded-[1.4rem] border border-gray-200 bg-gray-50 px-5 py-4 text-left transition focus-within:border-brand/30 focus-within:shadow-[0_0_0_1px_rgba(31,191,159,0.2)]">
              <Search className="h-5 w-5 text-black" />
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                type="search"
                placeholder="Search buying guides, EV comparisons, charging advice..."
                className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-500 sm:text-base"
                aria-label="Search blog articles"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {quickCategories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                    active
                      ? "border-brand/40 bg-brand/10 text-black shadow-sm"
                      : "border-gray-200 bg-gray-50 text-black hover:border-brand/30 hover:bg-brand/10"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
