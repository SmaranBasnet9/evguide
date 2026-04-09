import Link from "next/link";
import ArticleCTA from "./ArticleCTA";
import CompareCTA from "./CompareCTA";
import EVCardInline from "./EVCardInline";
import FinanceCTA from "./FinanceCTA";
import type { ArticleContentProps } from "./types";

export default function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <section className="bg-[#0B0B0B] text-white">
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
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                          {block.eyebrow}
                        </p>
                      ) : null}
                      <HeadingTag className="text-3xl font-semibold leading-tight text-white sm:text-[2rem]">
                        {block.title}
                      </HeadingTag>
                    </section>
                  );
                }
                case "paragraph":
                  return (
                    <p
                      key={block.id}
                      className={block.lead ? "max-w-3xl text-xl leading-9 text-zinc-200" : "max-w-3xl text-lg leading-9 text-zinc-300"}
                    >
                      {block.content}
                    </p>
                  );
                case "list":
                  return (
                    <section key={block.id} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
                      {block.title ? <h3 className="text-xl font-semibold text-white">{block.title}</h3> : null}
                      <ul className="mt-4 space-y-3">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-3 text-base leading-8 text-zinc-300">
                            <span className="mt-3 h-2 w-2 rounded-full bg-emerald-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                case "insight":
                  return (
                    <section key={block.id} className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.08] p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Why this matters</p>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{block.title}</h3>
                      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-200">{block.content}</p>
                    </section>
                  );
                case "evs":
                  return (
                    <section key={block.id} className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-semibold text-white">{block.title}</h2>
                        <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-300">{block.description}</p>
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
          <div className="sticky top-28 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Move from content to action</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Find the right EV faster</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Use the same decision stack across research, finance, comparison, and AI matching without restarting your journey.
            </p>
            <div className="mt-6 space-y-3">
              <Link href="/ai-match" className="block rounded-full bg-emerald-400 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-300">
                Start AI Match
              </Link>
              <Link href="/compare" className="block rounded-full border border-white/10 bg-black/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Compare EVs
              </Link>
              <Link href="/finance" className="block rounded-full border border-white/10 bg-black/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Check finance
              </Link>
              <Link href="/vehicles" className="block rounded-full border border-white/10 bg-black/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Explore vehicles
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
