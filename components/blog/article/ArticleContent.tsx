import Link from "next/link";
import ArticleCTA from "./ArticleCTA";
import CompareCTA from "./CompareCTA";
import EVCardInline from "./EVCardInline";
import FinanceCTA from "./FinanceCTA";
import type { ArticleContentProps } from "./types";

export default function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <section className="bg-white text-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-20">
        <div className="min-w-0">
          <div className="space-y-10">
            {blocks.map((block) => {
              switch (block.type) {
                case "heading": {
                  const HeadingTag = block.level === 3 ? "h3" : "h2";
                  return (
                    <section key={block.id} id={block.id} className="scroll-mt-32">
                      {block.eyebrow ? (
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-black">
                          {block.eyebrow}
                        </p>
                      ) : null}
                      <HeadingTag className="text-3xl font-semibold leading-tight text-black sm:text-[2rem]">
                        {block.title}
                      </HeadingTag>
                    </section>
                  );
                }
                case "paragraph":
                  return (
                    <p
                      key={block.id}
                      className={block.lead ? "max-w-3xl text-xl leading-9 text-black" : "max-w-3xl text-lg leading-9 text-black"}
                    >
                      {block.content}
                    </p>
                  );
                case "list":
                  return (
                    <section key={block.id} className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm">
                      {block.title ? <h3 className="text-xl font-semibold text-black">{block.title}</h3> : null}
                      <ul className="mt-4 space-y-3">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-3 text-base leading-8 text-black">
                            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                case "insight":
                  return (
                    <section key={block.id} className="rounded-[2rem] border border-cyan-200 bg-cyan-50 p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">Why this matters</p>
                      <h3 className="mt-4 text-2xl font-semibold text-black">{block.title}</h3>
                      <p className="mt-4 max-w-3xl text-lg leading-8 text-black">{block.content}</p>
                    </section>
                  );
                case "evs":
                  return (
                    <section key={block.id} className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-semibold text-black">{block.title}</h2>
                        <p className="mt-3 max-w-3xl text-lg leading-8 text-black">{block.description}</p>
                      </div>
                      <div className="grid gap-6 xl:grid-cols-3">
                        {block.items.map((item) => (
                          <EVCardInline key={item.model.id} item={item} />
                        ))}
                      </div>
                    </section>
                  );
                case "cta":
                  return <ArticleCTA key={block.id} {...block} />;
                case "compare":
                  return <CompareCTA key={block.id} {...block} />;
                case "finance":
                  return <FinanceCTA key={block.id} {...block} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">Move from content to action</p>
            <h3 className="mt-4 text-2xl font-semibold text-black">Find the right EV faster</h3>
            <p className="mt-4 text-sm leading-7 text-black">
              Use the same decision stack across research, finance, comparison, and AI matching without restarting your journey.
            </p>
            <div className="mt-6 space-y-3">
              <Link href="/ai-match" className="block rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-hover">
                Start Match
              </Link>
              <Link href="/compare" className="block rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-black transition hover:border-brand/30 hover:bg-brand/10">
                Compare EVs
              </Link>
              <Link href="/finance" className="block rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-black transition hover:border-brand/30 hover:bg-brand/10">
                Check finance
              </Link>
              <Link href="/vehicles" className="block rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-black transition hover:border-brand/30 hover:bg-brand/10">
                Explore vehicles
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
